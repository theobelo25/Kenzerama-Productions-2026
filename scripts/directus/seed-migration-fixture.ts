import "dotenv/config";

import {
  authentication,
  createCollection,
  createDirectus,
  createItems,
  readCollection,
  readItems,
  rest,
} from "@directus/sdk";

const COLLECTION = "migration_fixture_demo";

function normalizeBaseUrl(raw: string) {
  return raw.replace(/\/$/, "");
}

async function main() {
  const url = normalizeBaseUrl(
    process.env.SCRATCH_DIRECTUS_URL ?? "http://127.0.0.1:8057",
  );
  const email =
    process.env.SCRATCH_DIRECTUS_ADMIN_EMAIL?.trim() ??
    process.env.DIRECTUS_ADMIN_EMAIL?.trim() ??
    "admin@example.com";
  const password =
    process.env.SCRATCH_DIRECTUS_ADMIN_PASSWORD?.trim() ??
    process.env.DIRECTUS_ADMIN_PASSWORD?.trim() ??
    "admin";

  const client = createDirectus(url).with(rest()).with(authentication());
  await client.login({ email, password });

  let collectionExists = true;
  try {
    await client.request(readCollection(COLLECTION as never));
  } catch {
    collectionExists = false;
  }

  if (!collectionExists) {
    await client.request(
      createCollection({
        collection: COLLECTION,
        meta: { icon: "science", note: "Migration dry-run fixture" },
        schema: { name: COLLECTION },
        fields: [
          {
            field: "id",
            type: "uuid",
            meta: {
              hidden: true,
              interface: "input",
              readonly: true,
              special: ["uuid"],
            },
            schema: {
              is_primary_key: true,
              has_auto_increment: false,
              length: 36,
            },
          },
          {
            field: "title",
            type: "string",
            meta: { interface: "input", required: true },
            schema: { max_length: 255 },
          },
        ],
      } as never),
    );
    console.log(`Created collection "${COLLECTION}".`);
  }

  const rows = (await client.request(
    readItems(COLLECTION as never, { fields: ["id"], limit: 10 }),
  )) as { id: string }[];

  const targetCount = 2;
  const need = targetCount - rows.length;
  if (need <= 0) {
    console.log(
      `Fixture already has ${rows.length} row(s); nothing to insert.`,
    );
    return;
  }

  const titles = [
    "Fixture row A (migration dry-run)",
    "Fixture row B (migration dry-run)",
  ].slice(rows.length, rows.length + need);

  await client.request(
    createItems(
      COLLECTION as never,
      titles.map((title) => ({ title })) as never,
    ),
  );
  console.log(`Inserted ${need} row(s) into "${COLLECTION}".`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
