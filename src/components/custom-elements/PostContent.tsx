import React from "react";
import { useRouter } from "next/navigation";
import { CommentIcon } from "@/assets/icon/icons";

interface PostContentProps {
  content?: string;
  postId: string | string[];
  commentCount?: number;
}

export const PostContent: React.FC<PostContentProps> = ({
  content,
  postId,
  commentCount = 0,
}) => {
  const router = useRouter();

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Post Content</h2>

      {content && (
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            Content
          </h4>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="leading-relaxed text-gray-900">{content}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#2F3794] to-[#5A388B] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
          onClick={() => router.push(`/usersposts/${postId}/userscomments`)}
        >
          <CommentIcon />
          View Comments ({commentCount})
        </button>
      </div>
    </div>
  );
};