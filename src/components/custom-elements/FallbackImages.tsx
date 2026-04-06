// components/FallbackImage.tsx
"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import fallbackSrc from "@/assets/images/profile.png";
import { cn } from "@/lib/utils";

function isValidSrc(src: any): boolean {
  return (
    !!src &&
    (src.startsWith("/") || src.startsWith("http") || src.startsWith("https"))
  );
}

export function FallbackImage(props: ImageProps) {
  const { src, alt, className, ...rest } = props;
  const url = isValidSrc(src) ? (src as string) : null;

  const [imgSrc, setImgSrc] = useState<string | typeof fallbackSrc | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setImgSrc(url);
  }, [url]);

  if (!isClient) {
    return <div className={cn("rounded-full border bg-gray-200 animate-pulse", className ?? "size-8")} />;
  }

  return (
    <Image
      {...rest}
      className={cn("rounded-full border object-cover shrink-0", className ?? "size-8")}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
