-- DropForeignKey
ALTER TABLE "Feeding" DROP CONSTRAINT "Feeding_animalId_fkey";

-- DropForeignKey
ALTER TABLE "Treatment" DROP CONSTRAINT "Treatment_animalId_fkey";

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeding" ADD CONSTRAINT "Feeding_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
