"use client";
import React, { useState } from "react";
import styles from "./ui/ActionButtons.module.scss";
import { Heart, HeartCrack, Trash } from "lucide-react";
import { useModal } from "@/hook/useModal";
import Modal from "@/widgets/modal/Modal";

type Props = {
  liked: boolean;
  onLike: () => void;
  onDelete: () => void;
};

export default function ActionButtons({ liked, onLike, onDelete }: Props) {
  const [hoverLike, setHoverLike] = useState(false);
  const deleteModal = useModal();
  const unlikeModal = useModal();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (liked) {
      unlikeModal.open();
    } else {
      onLike();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteModal.open();
  };

  const confirmUnlike = () => {
    onLike();
    unlikeModal.close();
  };

  const confirmDelete = () => {
    onDelete();
    deleteModal.close();
  };

  return (
    <>
      <div className={styles.actions}>
        <button
          aria-label="like"
          onMouseEnter={() => setHoverLike(true)}
          onMouseLeave={() => setHoverLike(false)}
          onClick={handleLikeClick} 
          className={`${styles.likeBtn} ${
            liked ? styles["likeBtn--active"] : ""
          }`}
          title={liked ? "Unlike" : "Like"}
        >
          {liked && hoverLike ? (
            <HeartCrack />
          ) : liked ? (
            <Heart fill="currentColor" stroke="currentColor" />
          ) : (
            <Heart />
          )}
        </button>
        <button
          aria-label="delete"
          onClick={handleDeleteClick} 
          className={styles.deleteBtn}
          title="Delete"
        >
          <Trash />
        </button>
      </div>


      <Modal
        isOpen={unlikeModal.isOpen}
        onClose={unlikeModal.close}
        title="Remove from favorites?"
        actions={
          <>
            <button 
              className={styles.modalCancelButton} 
              onClick={unlikeModal.close}
            >
              Cancel
            </button>
            <button 
              className={styles.modalConfirmButton} 
              onClick={confirmUnlike}
            >
              Remove
            </button>
          </>
        }
      >
        <p>Are you sure you want to remove this product from your favorites?</p>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        title="Delete product?"
        actions={
          <>
            <button 
              className={styles.modalCancelButton} 
              onClick={deleteModal.close}
            >
              Cancel
            </button>
            <button 
              className={styles.modalDeleteButton} 
              onClick={confirmDelete}
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
      </Modal>
    </>
  );
}