import { format } from "date-fns/format";

export const formatDate = (date: Date | string | null | undefined, dateFormat = "do MMM, yyyy") => {
  if (!date) return "";

  return format(new Date(isNaN(date as any) ? date : Number(date)), dateFormat);
};
