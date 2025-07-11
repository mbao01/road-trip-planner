"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { setSearchParams } from "../../helpers";
import { UsePageUrlArgs } from "./types";

export const usePageUrl = ({ queryKeyPrefix }: UsePageUrlArgs = {}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getPageUrl = ({ page, perPage }: { page: number; perPage: number }) => {
    const queryValue = { page, per_page: perPage };
    const path = `${pathname}?${searchParams.toString()}`;
    const pageUrl = setSearchParams(
      path,
      queryKeyPrefix ? { [queryKeyPrefix]: queryValue } : queryValue
    );
    return pageUrl;
  };

  return { getPageUrl };
};
