"use client";
import Link from "next/link";
import { Product } from "@/types/types";
import Image from "next/image";
import styles from './ui/card/ProductCard.module.scss';
import ActionButtons from "@/features/actionButtons/ActionButtons";

type Props = {
  product: Product;
  onToggleLike: (id: string | number) => void;
  onDelete: (id: string | number) => void;
};

export default function ProductCard({
  product,
  onToggleLike,
  onDelete,
}: Props) {
  const { id, title, description, image, liked } = product;

  return (
    <div className={styles.card}>
      <Link href={`/products/${id}`} className={styles.content}>
        {image && (
          <Image
            src={image}
            alt={title}
            width={300}
            height={160}
            unoptimized
            className={styles.image}
          />
        )}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description || "No description"}</p>
        <span className={styles.category}>{product.category}</span>
      </Link>
      <div className={styles.overlayButton}>
        <ActionButtons
          liked={!!liked}
          onLike={() => onToggleLike(id)}
          onDelete={() => onDelete(id)}
        />
      </div>
    

    </div>
  );
}