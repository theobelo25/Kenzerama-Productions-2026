/*
  Warnings:

  - You are about to drop the `InstagramAccessToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "InstagramAccessToken";

-- CreateTable
CREATE TABLE "OAuthState" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramCredential" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'instagram-basic-display',
    "accessToken" TEXT NOT NULL,
    "tokenType" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastRefreshedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthState_state_key" ON "OAuthState"("state");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramCredential_provider_key" ON "InstagramCredential"("provider");
