-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Participant');

-- CreateEnum
CREATE TYPE "Strategy" AS ENUM ('Time', 'FIFO', 'Manual');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "avatar" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupParticipant" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "GroupParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "strategy" "Strategy" NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueParticipant" (
    "id" SERIAL NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queueId" INTEGER NOT NULL,
    "groupParticipantId" INTEGER NOT NULL,

    CONSTRAINT "QueueParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Invitations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Invitations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Declined" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Declined_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupParticipant_userId_groupId_key" ON "GroupParticipant"("userId", "groupId");

-- CreateIndex
CREATE INDEX "_Invitations_B_index" ON "_Invitations"("B");

-- CreateIndex
CREATE INDEX "_Declined_B_index" ON "_Declined"("B");

-- AddForeignKey
ALTER TABLE "GroupParticipant" ADD CONSTRAINT "GroupParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupParticipant" ADD CONSTRAINT "GroupParticipant_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueParticipant" ADD CONSTRAINT "QueueParticipant_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueParticipant" ADD CONSTRAINT "QueueParticipant_groupParticipantId_fkey" FOREIGN KEY ("groupParticipantId") REFERENCES "GroupParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invitations" ADD CONSTRAINT "_Invitations_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invitations" ADD CONSTRAINT "_Invitations_B_fkey" FOREIGN KEY ("B") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Declined" ADD CONSTRAINT "_Declined_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Declined" ADD CONSTRAINT "_Declined_B_fkey" FOREIGN KEY ("B") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
