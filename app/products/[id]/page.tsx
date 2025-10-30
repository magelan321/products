"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import styles from "./ProductDetailsPage.module.scss";
import Image from "next/image";
import { 
  fetchProductById, 
  ingestIfMissing, 
  startEditing, 
  cancelEditing, 
  saveProduct 
} from "@/store/productsSlice";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector((s: RootState) =>
    s.products.items.find((p) => String(p.id) === String(id))
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => ({
    title: product?.title || '',
    description: product?.description || '',
    category: product?.category || '',
    image: product?.image || '',
  }));



  useEffect(() => {
    if (!id) return;
    if (!product) {
      dispatch(fetchProductById(id));
    } else {
      dispatch(ingestIfMissing(product));
    }
  }, [id, product, dispatch]);

  const handleEdit = () => {
    if (product) {
      dispatch(startEditing(product.id));
      setIsEditing(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      dispatch(saveProduct({
        title: formData.title,
        description: formData.description,
        category: formData.category || undefined,
        image: formData.image || undefined,
        liked: product.liked,
        created: product.created,
        deleted: false
      }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    dispatch(cancelEditing());
    setIsEditing(false);
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category || '',
        image: product.image || '',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
          {isEditing ? (
            <div className={styles.editForm}>
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="image" className={styles.label}>Image URL</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  {formData.image && (
                    <Image
                      src={formData.image}
                      alt="Preview"
                      width={300}
                      height={150}
                      unoptimized
                      className={styles.imagePreview}
                    />
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category" className={styles.label}>Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={styles.textarea}
                    required
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
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
                <div className={styles.header}>
                  <h1 className={styles.title}>{product.title}</h1>
                  <button
                    onClick={handleEdit}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                </div>
                
                {product.category && (
                  <div className={styles.category}>{product.category}</div>
                )}
                
                <p className={styles.description}>
                  {product.description || "No description"}
                </p>
                {product.created && (
                  <span className={styles.userCreated}>
                    Created by you
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {!isEditing && (
        <Link href="/products" className={styles.link}>
          Go to list
        </Link>
      )}
    </div>
  );
}