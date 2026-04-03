import React from "react";
import { formatNumber } from "@/utils/helpers/commonHelpers";

interface EngagementStatsProps {
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}

export const EngagementStats: React.FC<EngagementStatsProps> = ({
  likesCount = 0,
  commentsCount = 0,
  sharesCount = 0,
}) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Engagement Stats
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {formatNumber(likesCount)}
          </div>
          <div className="text-sm font-medium text-red-700">Likes</div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(commentsCount)}
          </div>
          <div className="text-sm font-medium text-blue-700">Comments</div>
        </div>

        <div className="rounded-lg bg-purple-50 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatNumber(sharesCount)}
          </div>
          <div className="text-sm font-medium text-purple-700">Shares</div>
        </div>
      </div>
    </div>
  );
};