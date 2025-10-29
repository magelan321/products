"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { addProduct } from "@/store/productsSlice";
import styles from "./CreateProduct.module.scss";
import Image from "next/image";

interface Category {
  strCategory: string;
}

export default function CreateProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [image, setImage] = useState("");
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list"
        );
        const data = await response.json();
        setCategories(data.drinks || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategory = category === "custom" ? customCategory : category;

    const errors = {
      title: title.trim().length < 3,
      description: description.trim().length < 10,
    };

    if (errors.title || errors.description) {
      setTouched({ title: true, description: true });
      return;
    }

    dispatch(
      addProduct({
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory || undefined,
        image: image.trim() || undefined,
        created: true,
        liked: false,
        deleted: false,
      })
    );

    router.push("/products");
  };

  const error = (name: string, cond: boolean) =>
    touched[name] && cond ? (
      <div className={styles.error}>This field is required</div>
    ) : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Product</h1>
        <p className={styles.subtitle}>Add a new product to your catalog</p>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            placeholder="Enter product title (minimum 3 characters)"
            className={styles.input}
          />
          {error("title", title.trim().length < 3)}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, description: true }))}
            placeholder="Enter product description (minimum 10 characters)"
            rows={5}
            className={styles.textarea}
          />
          {error("description", description.trim().length < 10)}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Loading categories...
            </div>
          ) : (
            <div className={styles.categorySection}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.select}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.strCategory} value={cat.strCategory}>
                    {cat.strCategory}
                  </option>
                ))}
                <option value="custom">Custom category</option>
              </select>

              {category === "custom" && (
                <input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter your custom category"
                  className={styles.input}
                />
              )}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Image URL</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://www.thecocktaildb.com/images/media/drink/..."
            className={styles.input}
          />
          {image && (
            <div className={styles.imagePreview}>
              <Image
                unoptimized
                src={image}
                alt="Preview"
                className={styles.previewImage}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Create Product
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
