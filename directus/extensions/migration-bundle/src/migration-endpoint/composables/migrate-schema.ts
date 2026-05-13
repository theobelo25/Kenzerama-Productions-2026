import type { RestClient, SchemaDiffOutput, SchemaSnapshotOutput } from '@directus/sdk';
import type { DirectusError } from '../../types/extension';
import type { Schema } from '../api';
import { schemaApply, schemaDiff } from '@directus/sdk';

type ResWrite = { write: (chunk: string) => void };

type UnknownRecord = Record<string, unknown>;

type DiffSection = 'collections' | 'fields' | 'systemFields' | 'relations';

const MAX_DIFF_DIAGNOSTICS_PER_SECTION = 20;

function nonEmptyString(v: unknown): v is string {
	return typeof v === 'string' && v.length > 0;
}

function describeInvalidDiffEntry(section: DiffSection, index: number, e: unknown, rule: 'collection' | 'field-like'): string {
	if (e === null || e === undefined) {
		return `* ${section}[${index}]: ${e === null ? 'null' : 'undefined'}\r\n`;
	}
	if (typeof e !== 'object' || Array.isArray(e)) {
		return `* ${section}[${index}]: expected object, got ${Array.isArray(e) ? 'array' : typeof e}\r\n`;
	}
	const o = e as UnknownRecord;
	const keys = Object.keys(o);
	const keyList = `${keys.slice(0, 24).join(', ')}${keys.length > 24 ? ', …' : ''}`;
	let detail = `keys=[${keyList}]`;
	if (rule === 'collection') {
		detail += `; collection=${JSON.stringify(o.collection)} (type ${typeof o.collection})`;
	}
	else {
		detail += `; collection=${JSON.stringify(o.collection)}; field=${JSON.stringify(o.field)}`;
	}
	detail += `; diff isArray=${Array.isArray(o.diff)}`;
	return `* ${section}[${index}] rejected: ${detail}\r\n`;
}

function filterDiffSection(
	section: DiffSection,
	arr: unknown,
	predicate: (e: unknown) => e is UnknownRecord,
	rule: 'collection' | 'field-like',
	res: ResWrite,
): { kept: UnknownRecord[]; dropped: number } {
	const input = Array.isArray(arr) ? arr : [];
	const kept: UnknownRecord[] = [];
	let diagnostics = 0;
	for (let i = 0; i < input.length; i++) {
		const e = input[i];
		if (predicate(e)) {
			kept.push({ ...(e as UnknownRecord) });
		}
		else if (diagnostics < MAX_DIFF_DIAGNOSTICS_PER_SECTION) {
			res.write(describeInvalidDiffEntry(section, i, e, rule));
			diagnostics++;
		}
	}
	const dropped = input.length - kept.length;
	if (dropped > MAX_DIFF_DIAGNOSTICS_PER_SECTION) {
		res.write(
			`* ${section}: ${dropped - MAX_DIFF_DIAGNOSTICS_PER_SECTION} more invalid entr${dropped - MAX_DIFF_DIAGNOSTICS_PER_SECTION === 1 ? 'y' : 'ies'} not listed\r\n`,
		);
	}
	return { kept, dropped };
}

/**
 * Directus `/schema/apply` validates each diff entry with Joi (`collection` / `field` required).
 * Some version pairs can emit malformed rows; strip them so the rest of the migration can apply.
 */
function sanitizeSchemaDiffForApply(diff: SchemaDiffOutput, res: ResWrite): SchemaDiffOutput {
	if (!diff || typeof diff !== 'object' || !('hash' in diff)) {
		return diff;
	}

	const raw = (diff as { diff?: UnknownRecord }).diff;
	if (!raw || typeof raw !== 'object') {
		res.write(
			`* Schema diff payload has no usable \`diff\` object; apply validation may fail. Check source/destination Directus versions.\r\n\r\n`,
		);
		return diff;
	}

	const collectionEntryOk = (e: unknown): e is UnknownRecord =>
		!!e &&
		typeof e === 'object' &&
		!Array.isArray(e) &&
		nonEmptyString((e as UnknownRecord).collection) &&
		Array.isArray((e as UnknownRecord).diff);

	const fieldLikeEntryOk = (e: unknown): e is UnknownRecord =>
		!!e &&
		typeof e === 'object' &&
		!Array.isArray(e) &&
		nonEmptyString((e as UnknownRecord).collection) &&
		nonEmptyString((e as UnknownRecord).field) &&
		Array.isArray((e as UnknownRecord).diff);

	const { kept: collections, dropped: d0 } = filterDiffSection('collections', raw.collections, collectionEntryOk, 'collection', res);
	const { kept: fields, dropped: d1 } = filterDiffSection('fields', raw.fields, fieldLikeEntryOk, 'field-like', res);
	const { kept: systemFields, dropped: d2 } = filterDiffSection('systemFields', raw.systemFields, fieldLikeEntryOk, 'field-like', res);
	const { kept: relations, dropped: d3 } = filterDiffSection('relations', raw.relations, fieldLikeEntryOk, 'field-like', res);
	const dropped = d0 + d1 + d2 + d3;

	if (dropped > 0) {
		res.write(
			`* Removed ${dropped} invalid diff ${dropped === 1 ? 'entry' : 'entries'} (need non-empty collection/field and a diff array).\r\n\r\n`,
		);
	}

	return {
		...(diff as UnknownRecord),
		hash: (diff as { hash: string }).hash,
		diff: {
			collections,
			fields,
			systemFields,
			relations,
		},
	} as SchemaDiffOutput;
}

function isSchemaApplyDiffEmpty(payload: SchemaDiffOutput): boolean {
	const d = (payload as { diff?: { collections?: unknown[]; fields?: unknown[]; systemFields?: unknown[]; relations?: unknown[] } })
		.diff;
	if (!d) return true;
	return (
		(d.collections?.length ?? 0) === 0 &&
		(d.fields?.length ?? 0) === 0 &&
		(d.systemFields?.length ?? 0) === 0 &&
		(d.relations?.length ?? 0) === 0
	);
}

export async function migrateSchema({ res, client, schema, dry_run = false, force = false }: { res: any; client: RestClient<Schema>; schema: SchemaSnapshotOutput; dry_run: boolean; force: boolean }): Promise<SchemaDiffOutput | DirectusError> {
	try {
		res.write('1. Comparing Schemas ...');

		const diff: SchemaDiffOutput = force
			? await client.request(() => ({
				body: JSON.stringify(schema),
				method: 'POST',
				path: '/schema/diff?force=true',
			}))
			: await client.request(schemaDiff(schema));

		if (!('hash' in diff)) {
			res.write('match\r\n\r\n');
			return diff;
		}

		res.write('done\r\n\r\n');

		const diffToApply = sanitizeSchemaDiffForApply(diff, res);

		if (isSchemaApplyDiffEmpty(diffToApply)) {
			res.write('2. Applying Schemas ...skipped (no valid changes)\r\n\r\n');
			return diffToApply;
		}

		res.write('2. Applying Schemas ...');

		if (!dry_run) {
			await (!force
				? client.request(schemaApply(diffToApply))
				: client.request(() => ({
						body: JSON.stringify(diffToApply),
						method: 'POST',
						path: '/schema/apply?force=true',
					})));

			res.write('done\r\n\r\n');
		}
		else {
			res.write('skipped\r\n\r\n');
		}

		return diffToApply;
	}
	catch (error) {
		const errorResponse = error as DirectusError;
		res.write('error\r\n\r\n');

		if (errorResponse.errors && errorResponse.errors.length > 0) {
			for (const err of errorResponse.errors) {
				const line = err.extensions?.reason ?? err.message;
				if (line) {
					res.write(`${line}\r\n`);
				}
			}
			res.write(`\r\n`);
		}

		return errorResponse;
	}
}

export async function checkSchema({ client, schema }: { client: RestClient<Schema>; schema: SchemaSnapshotOutput }): Promise<SchemaDiffOutput | DirectusError> {
	try {
		return await client.request(schemaDiff(schema));
	}
	catch (error) {
		const errorResponse = error as DirectusError;
		return errorResponse;
	}
}
