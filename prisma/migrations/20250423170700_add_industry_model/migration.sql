-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CANDIDATE', 'HIRING_MANAGER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CANDIDATE',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industryId" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopCandidate" (
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" TEXT,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopCandidate" ADD CONSTRAINT "TopCandidate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopCandidate" ADD CONSTRAINT "TopCandidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
