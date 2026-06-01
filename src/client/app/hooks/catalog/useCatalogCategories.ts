"use client";

import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@/app/gql/Product";
import { DEMO_CATEGORIES, DemoCategory } from "@/app/data/demo/catalog";
import { isDemoCatalogForced, shouldUseDemoCatalog } from "@/app/lib/catalog/demoMode";

export function useCatalogCategories() {
  const forceDemo = isDemoCatalogForced();

  const { data, loading, error } = useQuery(GET_CATEGORIES, {
    skip: forceDemo,
  });

  const isDemoCatalog = shouldUseDemoCatalog(Boolean(error));
  const categories: DemoCategory[] = isDemoCatalog
    ? DEMO_CATEGORIES
    : data?.categories ?? [];

  return {
    categories,
    loading: isDemoCatalog ? false : loading,
    error: isDemoCatalog ? undefined : error,
    isDemoCatalog,
  };
}
