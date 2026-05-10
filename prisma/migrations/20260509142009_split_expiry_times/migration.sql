/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `RegisterVerification` table. All the data in the column will be lost.
  - Added the required column `codeExpiresAt` to the `RegisterVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionExpiresAt` to the `RegisterVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisterVerification" DROP COLUMN "expiresAt",
ADD COLUMN     "codeExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionExpiresAt" TIMESTAMP(3) NOT NULL;
