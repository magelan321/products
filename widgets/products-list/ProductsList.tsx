"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Link from "next/link";
import styles from "./ui/ProductsList.module.scss";
import { deleteProduct, fetchProductsByFirstLetter, searchProductsByName, setFilter, setPage, setSearch, toggleLike } from "@/store/productsSlice";
import ProductCard from "@/entities/product/ProductCard";
import Pagination from "@/shared/ui/pagination/Pagination";

export default function ProductsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, filter, page, pageSize, status, search } = useSelector((s: RootState) => s.products);
  const loadInitialProducts = () => {
    const letters = ["a", "b", "c"];
    letters.forEach((l) => {
      dispatch(fetchProductsByFirstLetter(l));
    });
  };

  useEffect(() => {
    loadInitialProducts();
  }, [dispatch]);

  const [localQuery, setLocalQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setSearch(localQuery));
      if (localQuery) {
        dispatch(searchProductsByName(localQuery));
      } else {
  
        loadInitialProducts();
      }
    }, 400);
    return () => clearTimeout(t);
  }, [localQuery, dispatch]);

  const filtered = useMemo(() => {
    const base = filter === "favorites" ? items.filter((i) => i.liked) : items;
    return base;
  }, [items, filter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);
  const hasNoProducts = total === 0;
  const isSearching = search.length > 0;


  const handleClearSearch = () => {
    setLocalQuery("");
    dispatch(setSearch(""));
    dispatch(setFilter("all"));
    loadInitialProducts();
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button
          onClick={() => dispatch(setFilter("all"))}
          className={`${styles.btn} ${filter === "all" ? styles.btnActive : ""}`}
        >
          All
        </button>
        <button
          onClick={() => dispatch(setFilter("favorites"))}
          className={`${styles.btn} ${filter === "favorites" ? styles.btnActive : ""}`}
        >
          Favorites
        </button>
        <Link href="/create-product" passHref>
          <button className={styles.btn}>Create product</button>
        </Link>
        <input
          type="text"
          placeholder="Search by name..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className={styles.input}
        />
        <span className={styles.status}>
          {status === "loading" ? "Loading..." : `${total} items`}
        </span>
      </div>

      {status === "loading" ? (
        <div className={styles["spinner-block"]}><span className={styles.spinner}></span></div>
      ) : hasNoProducts ? (
        <div className={styles.emptyState}>
          {isSearching ? (
            <>
              <h3>No products found</h3>
              <p>No products match your search criteria &quot;{search}&quot;</p>
              <button 
                onClick={handleClearSearch}
                className={styles.clearSearchBtn}
              >
                Clear search
              </button>
            </>
          ) : filter === "favorites" ? (
            <>
              <h3>No favorite products</h3>
              <p>You haven&apos;t added any products to favorites yet</p>
              <Link href="/" passHref>
                <button className={styles.browseBtn}>Browse products</button>
              </Link>
            </>
          ) : (
            <>
              <h3>No products available</h3>
              <p>There are no products in the catalog yet</p>
              <Link href="/create-product" passHref>
                <button className={styles.createBtn}>Create first product</button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {paged.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onToggleLike={(id) => dispatch(toggleLike(id))}
                onDelete={(id) => dispatch(deleteProduct(id))}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </>
      )}
    </div>
  );
}