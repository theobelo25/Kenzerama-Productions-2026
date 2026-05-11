import { appendFileSync } from "node:fs";

const DEFAULT_DIRECTUS_URL = "http://127.0.0.1:8055";

type LoginResponse = {
  data?: {
    access_token?: string;
  };
};

function appendGithubEnv(key: string, value: string) {
  const githubEnv = process.env.GITHUB_ENV;
  if (!githubEnv) {
    process.env[key] = value;
    return;
  }

  appendFileSync(githubEnv, `${key}=${value}\n`, "utf8");
}

async function main() {
  if (process.env.DIRECTUS_TOKEN?.trim()) {
    console.log("DIRECTUS_TOKEN is already set; skipping token mint.");
    return;
  }

  const baseUrl = (process.env.DIRECTUS_URL ?? DEFAULT_DIRECTUS_URL).replace(
    /\/$/,
    "",
  );
  const email = process.env.DIRECTUS_ADMIN_EMAIL;
  const password = process.env.DIRECTUS_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "DIRECTUS_ADMIN_EMAIL and DIRECTUS_ADMIN_PASSWORD are required when DIRECTUS_TOKEN is not set.",
    );
  }

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const body = (await response.json().catch(() => null)) as LoginResponse | null;
  const accessToken = body?.data?.access_token?.trim();

  if (!response.ok || !accessToken) {
    throw new Error(
      `Failed to mint Directus build token: ${response.status} ${JSON.stringify(body)}`,
    );
  }

  appendGithubEnv("DIRECTUS_TOKEN", accessToken);
  console.log("Minted Directus build token.");
}

main().catch((error) => {
  console.error("Directus token mint failed:", error);
  process.exitCode = 1;
});
