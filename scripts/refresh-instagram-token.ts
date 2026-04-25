import { refreshInstagramTokenIfNeeded } from "@/lib/services/instagram-token";

async function main() {
  const updated = await refreshInstagramTokenIfNeeded(true);

  console.log(
    JSON.stringify(
      {
        ok: true,
        provider: updated.provider,
        expiresAt: updated.expiresAt,
        refreshedAt: updated.lastRefreshedAt,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error("Instagram token refresh job failed: ", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$disconnect();
  });
