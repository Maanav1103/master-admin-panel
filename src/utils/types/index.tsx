export interface ParmasTypeForQuiz {
  question?: string;
  options?: string[];
  page?: number;
  per_page?: number;
  limit?: number;
  status?: null | "active" | "inactive";
  search?: string;
  sortBy?: string;
  total_items?: number;
  total_pages?: number;
  sortOrder?: "ASC" | "DESC";
}

export interface DropdownOption {
  value: string | number;
  label: string;
}

export type FileType = "image" | "audio" | "video" | "media";