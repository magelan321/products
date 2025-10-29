"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/store/store";

import styles from "./ProductDetailsPage.module.scss";
import Image from "next/image";
import { fetchProductById, ingestIfMissing } from "@/store/productsSlice";


export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector((s: RootState) => s.products.items.find((p) => String(p.id) === String(id)));

  useEffect(() => {
    if (!id) return;
    if (!product) {
      dispatch(fetchProductById(id));
    } else {
      dispatch(ingestIfMissing(product));
    }
  }, [id, product, dispatch]);

  if (!id) return null;

  return (
    <div className={styles.container}>
      <button 
        onClick={() => router.push("/products")} 
        className={styles.backButton}
      >
        Back
      </button>
      
      {!product ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.productGrid}>
          {product.image && (
            <Image 
              src={product.image} 
              alt={product.title} 
              width={560} 
              height={280} 
              unoptimized
              className={styles.image}
            />
          )}
          <div className={styles.details}>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.category}>{product.category}</div>
            <p className={styles.description}>{product.description || "No description"}</p>
          </div>
        </div>
      )}
      
      <Link href="/products" className={styles.link}>
        Go to list
      </Link>
    </div>
  );
}