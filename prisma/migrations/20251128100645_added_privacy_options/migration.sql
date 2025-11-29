/*
  Warnings:

  - The `privacy` column on the `post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PostPrivacy" AS ENUM ('PUBLIC', 'PRIVATE', 'FRIENDS_ONLY');

-- AlterTable
ALTER TABLE "post" DROP COLUMN "privacy",
ADD COLUMN     "privacy" "PostPrivacy" NOT NULL DEFAULT 'PUBLIC';
