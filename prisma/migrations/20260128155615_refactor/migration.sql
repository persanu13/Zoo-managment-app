/*
  Warnings:

  - The values [ILL,QUARANTINE,RECOVERING] on the enum `HealthStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HealthStatus_new" AS ENUM ('HEALTHY', 'OBSERVATION', 'UNHEALTHY');
ALTER TABLE "public"."Animal" ALTER COLUMN "healthStatus" DROP DEFAULT;
ALTER TABLE "Animal" ALTER COLUMN "healthStatus" TYPE "HealthStatus_new" USING ("healthStatus"::text::"HealthStatus_new");
ALTER TYPE "HealthStatus" RENAME TO "HealthStatus_old";
ALTER TYPE "HealthStatus_new" RENAME TO "HealthStatus";
DROP TYPE "public"."HealthStatus_old";
ALTER TABLE "Animal" ALTER COLUMN "healthStatus" SET DEFAULT 'HEALTHY';
COMMIT;
