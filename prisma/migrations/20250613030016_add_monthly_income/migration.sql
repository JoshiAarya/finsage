/*
  Warnings:

  - Added the required column `monthlyIncome` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "monthlyIncome" DECIMAL(65,30) NOT NULL;
