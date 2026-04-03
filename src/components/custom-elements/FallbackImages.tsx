// components/FallbackImage.tsx
"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import fallbackSrc from "@/assets/images/profile.png"; // Your fallback image

function isValidSrc(src: any): boolean {
  return (
    !!src &&
    (src.startsWith("/") || src.startsWith("http") || src.startsWith("https"))
  );
}

export function FallbackImage(props: ImageProps) {
  const { src, alt, ...rest } = props;
  const url = isValidSrc(src) ? (src as string) : null;

  const [imgSrc, setImgSrc] = useState<string | typeof fallbackSrc | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setImgSrc(url);
  }, [url]);

  // Show placeholder during SSR and initial client render
  if (!isClient) {
    return (
      <div className="size-12 rounded-full border bg-gray-200 animate-pulse" />
    );
  }

  return (
    <Image
      {...rest}
      className="size-12 rounded-full border object-cover"
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
