"use client";

import { useQuery } from "@apollo/client";
import { GET_SINGLE_PRODUCT } from "@/app/gql/Product";
import { Product } from "@/app/types/productTypes";
import { getDemoProductBySlug } from "@/app/data/demo/catalog";
import { isDemoCatalogForced, shouldUseDemoCatalog } from "@/app/lib/catalog/demoMode";

export function useProductBySlug(slug: string) {
  const forceDemo = isDemoCatalogForced();

  const { data, loading, error } = useQuery<{ product: Product }>(
    GET_SINGLE_PRODUCT,
    {
      variables: { slug },
      fetchPolicy: "no-cache",
      skip: forceDemo || !slug,
    }
  );

  const isDemoCatalog = shouldUseDemoCatalog(Boolean(error));
  const product = isDemoCatalog
    ? getDemoProductBySlug(slug)
    : data?.product;

  return {
    product,
    loading: isDemoCatalog ? false : loading,
    error: isDemoCatalog ? undefined : error,
    isDemoCatalog,
    notFound: !loading && !isDemoCatalog && !product && !error,
    demoNotFound: isDemoCatalog && !product,
  };
}
