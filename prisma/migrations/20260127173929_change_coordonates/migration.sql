/*
  Warnings:

  - The `coordinates` column on the `Habitat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Habitat" DROP COLUMN "coordinates",
ADD COLUMN     "coordinates" INTEGER[];
