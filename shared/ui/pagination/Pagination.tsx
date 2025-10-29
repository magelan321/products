"use client";
import React from "react";
import styles from "./Pagination.module.scss";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`${styles.btn} ${styles.btnPage} ${
            p === currentPage ? styles.btnActive : ""
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
