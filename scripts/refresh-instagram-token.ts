const DEFAULT_SERVER_URL = "http://localhost:3000";

function getRefreshUrl() {
  const baseUrl = (
    process.env.SERVER_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    DEFAULT_SERVER_URL
  ).replace(/\/$/, "");

  return `${baseUrl}/api/instagram/refresh`;
}

async function main() {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    throw new Error("CRON_SECRET is not set.");
  }

  const response = await fetch(getRefreshUrl(), {
    method: "POST",
    headers: {
      "x-cron-secret": cronSecret,
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Instagram token refresh failed: ${response.status} ${JSON.stringify(body)}`,
    );
  }

  console.log(JSON.stringify(body, null, 2));
}

main().catch((error) => {
  console.error("Instagram token refresh job failed: ", error);
  process.exitCode = 1;
});
