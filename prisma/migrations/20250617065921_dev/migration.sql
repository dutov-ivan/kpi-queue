/*
  Warnings:

  - You are about to drop the column `strategy` on the `Queue` table. All the data in the column will be lost.
  - Added the required column `name` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startStrategy` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stepStrategy` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QueueStartStrategy" AS ENUM ('Time', 'Manual');

-- CreateEnum
CREATE TYPE "QueueStepStrategy" AS ENUM ('ByName', 'ByNameReverse', 'FIFO', 'Manual');

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "strategy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR(500),
ADD COLUMN     "isParticipationAllowedPostStart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" VARCHAR(250) NOT NULL,
ADD COLUMN     "startFromId" INTEGER,
ADD COLUMN     "startStrategy" "QueueStartStrategy" NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "stepStrategy" "QueueStepStrategy" NOT NULL;

-- DropEnum
DROP TYPE "Strategy";

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_startFromId_fkey" FOREIGN KEY ("startFromId") REFERENCES "GroupParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
