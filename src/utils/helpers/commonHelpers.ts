import dayjs from "dayjs";

export const capitalizeWords = (str: string): string => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatNumber = (
  count: number | undefined | null,
  isAllowK: boolean = true
) => {
  if (count === undefined || count === null || isNaN(Number(count))) {
    return "0";
  }

  const numCount = Number(count);
  if (numCount >= 1000000) {
    return (numCount / 1000000).toFixed(1) + "M";
  } else if (numCount >= 1000 && isAllowK) {
    return (numCount / 1000).toFixed(1) + "K";
  }
  return numCount.toString();
};

export const formatDate = (date: string) => {
  if (!date) return "";
  return dayjs(date).format("DD MMM, YYYY") === "Invalid Date"
    ? ""
    : dayjs(date).format("DD MMM, YYYY");
};

export const formateDate = (date: string) => {
  return dayjs(date).format("DD MMM, YYYY") === "Invalid Date"
    ? ""
    : dayjs(date).format("DD MMM, YYYY");
};

export function getReportStatusClasses(status: string): string {
  const statusClasses = {
    solved: "border border-green-200 rounded-xl bg-green-300 text-green-800",
    pending:
      "border border-yellow-200 rounded-xl bg-yellow-300 text-yellow-800",
    blocked: "border border-red-200 rounded-xl bg-red-300 text-red-800",
  };

  return `rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${statusClasses[status as keyof typeof statusClasses] || statusClasses["pending"]}`;
}

export const getStatusBadge = (status: "active" | "pending" | "blocked") => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "active":
      return "bg-green-100 text-green-800";
    //   case "solved":
    //     return "bg-green-100 text-green-800";
    case "blocked":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "solved":
      return "Solved";
    case "active":
      return "Active";
    case "blocked":
      return "Blocked";
    default:
      return "Unknown Status";
  }
};

export async function getBlobFromStaticFile(path: string) {
  const response = await fetch(path);
  const blob = await response.blob();
  return blob;
}

export async function getFileFromStaticFile(path: string, filename: string) {
  const blob = await getBlobFromStaticFile(path);
  return new File([blob], filename, { type: blob.type });
}

export function getFileType(type: string): "image" | "video" | "audio" {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "image"; // default to image
}

export function isBase64(str: string): boolean {
  if (!str || typeof str !== "string") return false;

  // Remove data URL scheme if present
  const cleaned = str.includes(",") ? str.split(",")[1] : str;

  // Base64 regex (allows padding with = or ==)
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

  // Length must be multiple of 4
  if (cleaned.length % 4 !== 0) return false;

  return base64Regex.test(cleaned);
}

export function base64ToFile(base64: string, filename: string): File {
  // Extract mime type
  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";

  // Decode base64
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function compactFormat(value: number) {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  return isNaN(value) ? "-" : formatter.format(value);
}

// Helper function to get next day
export function getNextDay(date: Date) {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay;
}
