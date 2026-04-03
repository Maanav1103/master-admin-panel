import React from "react";
import { ImageIcon } from "@/assets/icon/icons";
import dynamic from "next/dynamic";

const SwiperWrapper = dynamic(
  () =>
    import("@/components/shared/SwiperWrapper").then(
      (mod) => mod.SwiperWrapper
    ),
  { ssr: false }
);

interface MediaContentProps {
  images: string[];
  onImageClick: () => void;
}

export const MediaContent: React.FC<MediaContentProps> = ({
  images,
  onImageClick,
}) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Media Content
        </h2>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {images.length > 0 ? (
          <div className="w-full lg:w-1/2">
            <div
              className="overflow-hidden rounded-xl bg-gray-100 shadow-inner"
              style={{ height: "420px" }}
            >
              <SwiperWrapper images={images} onImageClick={onImageClick} />
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">
              {images.length} Image{images.length > 1 ? "s" : ""}
            </p>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="text-center text-gray-500">
              <ImageIcon />
              <p>No media content available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};