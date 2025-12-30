-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('NEWS_API', 'RSS', 'SCRAPER');

-- CreateTable
CREATE TABLE "NewsSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "SourceType" NOT NULL DEFAULT 'NEWS_API',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastFetched" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawArticle" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "url" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "sourceId" TEXT NOT NULL,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "rawArticleId" TEXT NOT NULL,
    "telegramPosted" BOOLEAN NOT NULL DEFAULT false,
    "telegramPostId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'uz',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsSource_url_key" ON "NewsSource"("url");

-- CreateIndex
CREATE UNIQUE INDEX "RawArticle_externalId_key" ON "RawArticle"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "RawArticle_url_key" ON "RawArticle"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_rawArticleId_key" ON "Article"("rawArticleId");

-- CreateIndex
CREATE INDEX "Article_slug_idx" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_createdAt_idx" ON "Article"("createdAt");

-- AddForeignKey
ALTER TABLE "RawArticle" ADD CONSTRAINT "RawArticle_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "NewsSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_rawArticleId_fkey" FOREIGN KEY ("rawArticleId") REFERENCES "RawArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
