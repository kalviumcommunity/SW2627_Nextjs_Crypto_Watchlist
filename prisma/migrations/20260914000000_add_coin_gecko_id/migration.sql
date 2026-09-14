ALTER TABLE "Coin" ADD COLUMN "coinGeckoId" TEXT;

CREATE UNIQUE INDEX "Coin_coinGeckoId_key" ON "Coin"("coinGeckoId");