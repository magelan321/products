import React from "react";
import ProductsList from "@/widgets/products-list/ProductsList";

export default function ProductsPage() {
  return (
    <div>
      <h1 className="mb-3 text-xl font-bold">Products</h1>
      <ProductsList />
    </div>
  );
}