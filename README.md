This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Directus Promotion Pipelines

This repository includes GitHub Actions schema pipelines for:

- Pull requests to `development`: schema artifact validation
- `development` branch push: schema promotion to staging
- `main` branch push: schema promotion to production

Each promotion runs in this order:

1. Back up target DB
2. Apply Directus schema snapshot
3. Run schema health checks

### Required repository/environment configuration

Set these secrets/vars in GitHub Environments:

- **Secrets** for staging workflow:
  - `STAGING_DB_URL`
  - `STAGING_DIRECTUS_DATABASE_URL` (or `STAGING_DIRECTUS_SCHEMA_APPLY_CMD`)
- **Secrets** for production workflow:
  - `PROD_DB_URL`
  - `PROD_DIRECTUS_DATABASE_URL` (or `PROD_DIRECTUS_SCHEMA_APPLY_CMD`)

### Directus schema artifact

The workflow applies `directus/schema.snapshot.yaml`.
Export from your local Directus workspace before opening a PR:

```bash
npx --yes directus@11 schema snapshot ./directus/schema.snapshot.yaml
```

### Branch and environment rules

- Author schema locally and commit the updated snapshot in git.
- Open a PR to `development`; `Schema PR Checks` validates artifact quality.
- Merge to `development` to promote schema to staging.
- Promote to `main` to apply the exact same schema artifact to production.
- Do not make manual schema changes in staging or production.
