/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Habitat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Habitat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Habitat" ADD COLUMN     "number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Habitat_number_key" ON "Habitat"("number");
