-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_video_id_fkey";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "post_id" TEXT,
ADD COLUMN     "type" INTEGER,
ALTER COLUMN "video_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
