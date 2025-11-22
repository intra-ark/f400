-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YearData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "dt" DOUBLE PRECISION,
    "ut" DOUBLE PRECISION,
    "nva" DOUBLE PRECISION,
    "kd" DOUBLE PRECISION,
    "ke" DOUBLE PRECISION,
    "ker" DOUBLE PRECISION,
    "ksr" DOUBLE PRECISION,
    "otr" DOUBLE PRECISION,
    "tsr" TEXT,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "YearData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" SERIAL NOT NULL,
    "headerImageUrl" TEXT NOT NULL DEFAULT '/F400i.png',

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "YearData_productId_year_key" ON "YearData"("productId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "YearData" ADD CONSTRAINT "YearData_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
