import type { Accountability, Collection, File, Item, SchemaOverview } from '@directus/types';
import type { DataExtract, DirectusError, Scope, UserCollectionItem, UserCollectionItems } from '../../types/extension';
import saveToFile from '../../utils/save-file';
import { directusFileFields } from '../../utils/system-fields';

/** ItemsService / readByQuery need this entry; otherwise convertWildcards throws on `.fields`. */
function collectionExistsOnSchema(schema: SchemaOverview, name: string): boolean {
	return Boolean(schema.collections?.[name]);
}

const EXTRACT_LOG_PREFIX = '[migration-bundle/extract-data]';

/** Hint when Directus has a `directus_collections` row but no SQL table (not in SchemaOverview). */
function missingCollectionHint(c: Collection): string {
	if (c.meta?.icon === 'folder') {
		return 'folder (groups other collections; no item table — safe to ignore for export)';
	}
	return 'no matching schema.collections entry';
}

/** Log collection names present in `directus_collections` but missing from `schema.collections` (server + migration stream). */
function logCollectionsMissingFromSchemaOverview(res: { write: (s: string) => void }, kind: 'tabular' | 'singleton', skipped: Collection[]): void {
	if (skipped.length === 0) return;

	const names = skipped.map((c) => c.collection).sort();
	const details = skipped.map((c) => ({ collection: c.collection, hint: missingCollectionHint(c) }));
	console.warn(
		`${EXTRACT_LOG_PREFIX} ${kind}: ${names.length} collection(s) in DB metadata but no SchemaOverview entry (schema.collections[name] is undefined).`,
		{ collections: names, details },
	);
	res.write(
		`\r\n* [${kind}] ${names.length} collection(s) missing from SchemaOverview: ${names.join(', ')}\r\n`,
	);
	for (const c of skipped.sort((a, b) => a.collection.localeCompare(b.collection))) {
		res.write(`  — "${c.collection}": ${missingCollectionHint(c)}\r\n`);
	}
	res.write(
		`  (Otherwise: stale cache, extension-only model, or orphaned metadata.)\r\n`,
	);
}

async function extractContent({
	res,
	services,
	accountability,
	schema,
	getSchema,
	scope,
	folder,
	storage,
}: {
	res: any;
	services: any;
	accountability: Accountability;
	schema: SchemaOverview;
	getSchema?: (opts?: { bypassCache?: boolean }) => Promise<SchemaOverview>;
	scope: Scope;
	folder: string;
	storage: string;
}): Promise<DataExtract> {
	const {
		CollectionsService,
		FieldsService,
		FilesService,
		ItemsService,
	} = services;

	const collectionService = new CollectionsService({ accountability, schema });
	const fieldService = new FieldsService({ accountability, schema });
	const fileService = new FilesService({ accountability, schema });

	try {
		res.write('* Fetching collections');

		const collections: Collection[] = await collectionService.readByQuery({
			limit: -1,
		});

		res.write(' ...done\r\n\r\n');

		res.write('* Fetching fields');
		const primaryKeyMap = await getCollectionPrimaryKeys(fieldService);
		res.write(' ...done\r\n\r\n');

		const itemsSchema = getSchema ? await getSchema({ bypassCache: true }) : schema;

		res.write('* Fetching full data');
		const fullData: UserCollectionItems[] = scope.content
			? await loadFullData(res, collections, ItemsService, primaryKeyMap, accountability, itemsSchema)
			: [];
		res.write(' ...');
		await saveToFile(fullData, 'items_full_data', fileService, folder, storage);
		res.write('done\r\n\r\n');

		res.write('* Fetching singletons');
		const singletons: UserCollectionItem[] = scope.content
			? await loadSingletons(res, collections, ItemsService, accountability, itemsSchema)
			: [];
		res.write(' ...');
		await saveToFile(singletons, 'items_singleton', fileService, folder, storage);
		res.write('done\r\n\r\n');

		res.write('* Fetching files');
		const files: File[] = scope.content ? await fileService.readByQuery({ fields: directusFileFields, filter: { _or: [{ folder: { _neq: folder } }, { folder: { _null: true } }] }, limit: -1 }) : [];
		res.write(' ...');
		await saveToFile(files, 'files', fileService, folder, storage);
		res.write('done\r\n\r\n');

		return {
			collections,
			fullData,
			singletons,
			files,
			data_errors: null,
		};
	}
	catch (error) {
		console.error(error);
		return {
			collections: null,
			fullData: null,
			singletons: null,
			files: null,
			data_errors: error as DirectusError,
		};
	}
}

async function extractData(collection: string, ItemsService: any, accountability: Accountability, schema: SchemaOverview, primaryKeyField: string): Promise<Item[] | null> {
	if (!collectionExistsOnSchema(schema, collection)) {
		console.warn(`${EXTRACT_LOG_PREFIX} readByQuery guard: "${collection}" has no schema.collections entry (should have been skipped earlier).`);
		return null;
	}
	if (!primaryKeyField) {
		console.warn(`${EXTRACT_LOG_PREFIX} readByQuery guard: "${collection}" has no primaryKeyField.`);
		return null;
	}

	let page = 1;
	const limit = 100;
	const sort = [primaryKeyField];
	let data: Item[] | null = [];

	const itemService = new ItemsService(collection, { accountability, schema });

	while (true) {
		try {
			const response = await itemService.readByQuery({
				limit,
				page,
				sort,
			});

			if (response.length === 0)
				break;
			for (const item of response) data.push(item);
			if (response.length < limit)
				break;
			page++;
		}
		catch (error) {
			console.error(error);
			data = null;
			break;
		}
	}

	return data;
}

async function extractSingleton(collection: string, ItemsService: any, accountability: Accountability, schema: SchemaOverview): Promise<Item | null> {
	if (!collectionExistsOnSchema(schema, collection)) {
		console.warn(`${EXTRACT_LOG_PREFIX} readSingleton guard: "${collection}" has no schema.collections entry.`);
		return null;
	}
	const itemService = new ItemsService(collection, { accountability, schema });
	return await itemService.readSingleton({});
}

async function loadFullData(
	res: any,
	collections: Collection[],
	itemService: any,
	primaryKeyMap: Record<string, string>,
	accountability: Accountability,
	schema: SchemaOverview,
): Promise<UserCollectionItems[]> {
	const userCollections = collections
		.filter((item) => !item.collection.startsWith('directus_', 0))
		.filter((item) => item.schema !== null)
		.filter((item) => !item.meta?.singleton)
		.filter((item) => collectionExistsOnSchema(schema, item.collection));

	const skipped = collections
		.filter((item) => !item.collection.startsWith('directus_', 0))
		.filter((item) => item.schema !== null)
		.filter((item) => !item.meta?.singleton)
		.filter((item) => !collectionExistsOnSchema(schema, item.collection));

	logCollectionsMissingFromSchemaOverview(res, 'tabular', skipped);

	return await Promise.all(userCollections.map(async (collection) => {
		const name = collection.collection;
		const primaryKeyField = getPrimaryKey(schema, primaryKeyMap, name);
		if (!primaryKeyField) {
			console.warn(`${EXTRACT_LOG_PREFIX} tabular: skipping "${name}" — no primary key in field map and no "id" field on schema.`);
			res.write(`\r\n* Skipping "${name}" (no primary key resolved)\r\n`);
			return {
				collection: name,
				primaryKeyField: '',
				items: null,
			};
		}
		return {
			collection: name,
			primaryKeyField,
			items: await extractData(name, itemService, accountability, schema, primaryKeyField),
		};
	}));
}

async function loadSingletons(
	res: any,
	collections: Collection[],
	itemService: any,
	accountability: Accountability,
	schema: SchemaOverview,
): Promise<UserCollectionItem[]> {
	const singletonCollections = collections
		.filter((item) => !item.collection.startsWith('directus_', 0))
		.filter((item) => item.meta?.singleton)
		.filter((item) => collectionExistsOnSchema(schema, item.collection));

	const skipped = collections
		.filter((item) => !item.collection.startsWith('directus_', 0))
		.filter((item) => item.meta?.singleton)
		.filter((item) => !collectionExistsOnSchema(schema, item.collection));

	logCollectionsMissingFromSchemaOverview(res, 'singleton', skipped);

	return await Promise.all(singletonCollections.map(async (collection) => {
		const name = collection.collection;
		return {
			collection: name,
			item: await extractSingleton(name, itemService, accountability, schema),
		};
	}));
}

async function getCollectionPrimaryKeys(fieldService: any): Promise<Record<string, string>> {
	const fields = await fieldService.readAll();
	if (!fields) {
		return {};
	}
	const primaryKeys: Record<string, string> = {};

	for (const field of fields) {
		if (field.schema && field.schema?.is_primary_key) {
			primaryKeys[field.collection] = field.field;
		}
	}

	return primaryKeys;
}

function getPrimaryKey(schema: SchemaOverview, collectionsMap: Record<string, string>, collection: string): string | undefined {
	if (collectionsMap[collection]) {
		return collectionsMap[collection];
	}
	const colFields = schema.collections?.[collection]?.fields;
	if (colFields?.id) {
		return 'id';
	}
	console.warn(`${EXTRACT_LOG_PREFIX} primary key: "${collection}" not in field map and no "id" field on schema.`);
	return undefined;
}

export default extractContent;
