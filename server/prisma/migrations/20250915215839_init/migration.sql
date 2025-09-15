-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('APPROVED', 'DISAPPROVED');

-- CreateEnum
CREATE TYPE "public"."ListingType" AS ENUM ('sale', 'buy', 'rent');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('land', 'apartment', 'condo', 'house');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'landlord', 'user');

-- CreateEnum
CREATE TYPE "public"."PropertyStatus" AS ENUM ('available', 'occupied', 'under_contract', 'for_sale', 'under_renovation', 'pending_approval', 'sold', 'terminated', 'pending_availability', 'inactive');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "public"."PropertyCondition" AS ENUM ('NEW', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "public"."Maintenancekind" AS ENUM ('Routine', 'Preventive', 'Corrective', 'Predictive', 'Emergency', 'Cosmetic', 'Seasonal', 'Deffered');

-- CreateEnum
CREATE TYPE "public"."PropertyKind" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND');

-- CreateEnum
CREATE TYPE "public"."PropertyState" AS ENUM ('UNOCCUPIED', 'RENTED', 'UNDER_MAINTENANCE', 'UNDER_SALE');

-- CreateTable
CREATE TABLE "public"."listings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ListingType" NOT NULL,
    "property" "public"."PropertyType" NOT NULL,
    "status" "public"."PropertyStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Burundi',
    "city" TEXT NOT NULL DEFAULT 'Bujumbura',
    "address" TEXT NOT NULL,
    "regularPrice" DOUBLE PRECISION NOT NULL,
    "discountPrice" DOUBLE PRECISION NOT NULL,
    "facilities" JSONB NOT NULL,
    "image" TEXT[],
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalStatus" "public"."ApprovalStatus" NOT NULL DEFAULT 'DISAPPROVED',

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'user',
    "password" TEXT,
    "image" TEXT,
    "bookedVisits" JSONB[],
    "favResidenciesID" TEXT[],
    "chatIDs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Maintenance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."Maintenancekind" NOT NULL,
    "property" "public"."PropertyKind" NOT NULL,
    "state" "public"."PropertyState" NOT NULL,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Burundi',
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "maintenanceCharge" DOUBLE PRECISION NOT NULL,
    "image" TEXT[],
    "yearBuilt" DOUBLE PRECISION,
    "lastRenovationDate" TIMESTAMP(3),
    "maintenanceHistory" JSONB,
    "materialsUsed" TEXT NOT NULL,
    "estimatedValue" DOUBLE PRECISION,
    "condition" "public"."PropertyCondition" NOT NULL,
    "maintenanceSchedule" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listings_userEmail_address_key" ON "public"."listings"("userEmail", "address");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."listings" ADD CONSTRAINT "listings_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "public"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Maintenance" ADD CONSTRAINT "Maintenance_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "public"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "listing_transaction_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "maintenance_transaction_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
