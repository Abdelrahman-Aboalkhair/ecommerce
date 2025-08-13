import { Product } from "../types/productTypes";

const groupProductsByFlag = (products: Product[]) => {
  const flags = {
    featured: [] as Product[],
    trending: [] as Product[],
    newArrivals: [] as Product[],
    bestSellers: [] as Product[],
  };

  for (const product of products) {
    if (product.isFeatured) flags.featured.push(product);
    if (product.isTrending) flags.trending.push(product);
    if (product.isNew) flags.newArrivals.push(product);
    if (product.isBestSeller) flags.bestSellers.push(product);
  }

  return flags;
};

export default groupProductsByFlag;
