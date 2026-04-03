"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import TooltipWrapper from "../custom-elements/TooltipWrapper";

interface SwiperWrapperProps {
  images: string[];
  onImageClick?: () => void;
}

export const SwiperWrapper = ({ images, onImageClick }: SwiperWrapperProps) => {
  if (!images?.length) return null;

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop={images.length > 1}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      navigation={images.length > 1}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper h-full"
      style={{ minHeight: "400px" }}
    >
      {images.map((url, index) => (
        <SwiperSlide key={index} className="flex items-center justify-center">
          <div className="flex h-full w-full items-center justify-center p-4 cursor-pointer">
            <TooltipWrapper content="Click to view in full screen">
              <Image
                width={500}
                height={400}
                loading="lazy"
                src={url}
                alt={`Post image ${index + 1}`}
                className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
                style={{ objectFit: "contain" }}
                onClick={onImageClick}
              />
            </TooltipWrapper>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
