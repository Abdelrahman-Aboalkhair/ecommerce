"use client";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_SUMMARY } from "./gql/Product";
import { useMemo } from "react";
import groupProductsByFlag from "./utils/groupProductsByFlag";

const HeroSection = dynamic(() => import("./(public)/(home)/HeroSection"), {
  ssr: false,
});
const ProductSection = dynamic(
  () => import("./(public)/product/ProductSection"),
  { ssr: false }
);
const MainLayout = dynamic(() => import("./components/templates/MainLayout"), {
  ssr: false,
});

const Home = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_SUMMARY, {
    variables: { first: 100 },
    fetchPolicy: "no-cache",
  });

  const { featured, trending, newArrivals, bestSellers } = useMemo(() => {
    if (!data?.products?.products)
      return { featured: [], trending: [], newArrivals: [], bestSellers: [] };
    return groupProductsByFlag(data.products.products);
  }, [data]);

  return (
    <MainLayout>
      <HeroSection />
      <ProductSection
        title="Featured"
        products={featured}
        loading={loading}
        error={error}
      />

      <ProductSection
        title="Trending"
        products={trending}
        loading={loading}
        error={error}
      />

      <ProductSection
        title="New Arrivals"
        products={newArrivals}
        loading={loading}
        error={error}
      />

      <ProductSection
        title="Best Sellers"
        products={bestSellers}
        loading={loading}
        error={error}
      />
    </MainLayout>
  );
};

export default Home;
