"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/app/gql/Product";
import { Product } from "@/app/types/productTypes";
import {
  DEMO_PRODUCTS,
  filterDemoProducts,
  paginateDemoProducts,
} from "@/app/data/demo/catalog";
import { isDemoCatalogForced, shouldUseDemoCatalog } from "@/app/lib/catalog/demoMode";
import type { FilterValues } from "@/app/(public)/shop/ProductFilters";

const PAGE_SIZE = 12;

export function useShopProducts(filters: FilterValues) {
  const forceDemo = isDemoCatalogForced();
  const [skip, setSkip] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { first: PAGE_SIZE, skip: 0, filters },
    fetchPolicy: "no-cache",
    skip: forceDemo,
    onCompleted: (result) => {
      setDisplayedProducts(result.products.products);
      setHasMore(result.products.hasMore);
      setSkip(0);
    },
  });

  const isDemoCatalog = shouldUseDemoCatalog(Boolean(error));

  const filteredDemoProducts = useMemo(
    () => (isDemoCatalog ? filterDemoProducts(DEMO_PRODUCTS, filters) : []),
    [isDemoCatalog, filters]
  );

  useEffect(() => {
    if (!isDemoCatalog) return;
    const page = paginateDemoProducts(filteredDemoProducts, 0, PAGE_SIZE);
    setDisplayedProducts(page.products);
    setHasMore(page.hasMore);
    setSkip(0);
  }, [isDemoCatalog, filteredDemoProducts]);

  useEffect(() => {
    if (isDemoCatalog) return;
    setDisplayedProducts([]);
    setSkip(0);
    setHasMore(true);
  }, [filters, isDemoCatalog]);

  const handleShowMore = () => {
    if (isFetchingMore) return;

    if (isDemoCatalog) {
      const newSkip = skip + PAGE_SIZE;
      const page = paginateDemoProducts(filteredDemoProducts, newSkip, PAGE_SIZE);
      setDisplayedProducts((prev) => [...prev, ...page.products]);
      setSkip(newSkip);
      setHasMore(page.hasMore);
      return;
    }

    setIsFetchingMore(true);
    const newSkip = skip + PAGE_SIZE;
    fetchMore({
      variables: { first: PAGE_SIZE, skip: newSkip, filters },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const newProducts = fetchMoreResult.products.products;
        setDisplayedProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setSkip(newSkip);
        setHasMore(fetchMoreResult.products.hasMore);
        setIsFetchingMore(false);
        return {
          products: {
            ...fetchMoreResult.products,
            products: [...prev.products.products, ...newProducts],
          },
        };
      },
    });
  };

  return {
    displayedProducts,
    loading: isDemoCatalog ? false : loading && !displayedProducts.length,
    error: isDemoCatalog ? undefined : error,
    hasMore,
    isFetchingMore,
    handleShowMore,
    isDemoCatalog,
  };
}
