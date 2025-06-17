/*
  Warnings:

  - You are about to drop the `_Declined` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Invitations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Declined" DROP CONSTRAINT "_Declined_A_fkey";

-- DropForeignKey
ALTER TABLE "_Declined" DROP CONSTRAINT "_Declined_B_fkey";

-- DropForeignKey
ALTER TABLE "_Invitations" DROP CONSTRAINT "_Invitations_A_fkey";

-- DropForeignKey
ALTER TABLE "_Invitations" DROP CONSTRAINT "_Invitations_B_fkey";

-- DropTable
DROP TABLE "_Declined";

-- DropTable
DROP TABLE "_Invitations";

-- CreateTable
CREATE TABLE "QueueInvitation" (
    "id" SERIAL NOT NULL,
    "queueId" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAccepted" BOOLEAN,

    CONSTRAINT "QueueInvitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueueInvitation" ADD CONSTRAINT "QueueInvitation_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueInvitation" ADD CONSTRAINT "QueueInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
