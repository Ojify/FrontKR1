import React, { useEffect, useState } from 'react';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialProduct?.name ?? '');
    setCategory(initialProduct?.category ?? '');
    setDescription(initialProduct?.description ?? '');
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : '');
    setStock(initialProduct?.stock != null ? String(initialProduct.stock) : '');
    setRating(initialProduct?.rating != null ? String(initialProduct.rating) : '');
    setImage(initialProduct?.image ?? '');
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === 'edit' ? 'Редактирование товара' : 'Новый товар';

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDesc = description.trim();
    const numPrice = Number(price);
    const numStock = Number(stock);
    const numRating = rating ? Number(rating) : undefined;

    if (!trimmedName || !trimmedCategory || !trimmedDesc) {
      alert('Заполните название, категорию и описание');
      return;
    }
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      alert('Цена должна быть положительным числом');
      return;
    }
    if (!Number.isInteger(numStock) || numStock < 0) {
      alert('Количество на складе должно быть целым неотрицательным числом');
      return;
    }
    if (rating && (!Number.isFinite(numRating) || numRating < 0 || numRating > 5)) {
      alert('Рейтинг должен быть числом от 0 до 5');
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category: trimmedCategory,
      description: trimmedDesc,
      price: numPrice,
      stock: numStock,
      rating: numRating,
      image: image.trim() || undefined
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название *
            <input className="input" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </label>
          <label className="label">
            Категория *
            <input className="input" value={category} onChange={e => setCategory(e.target.value)} />
          </label>
          <label className="label">
            Описание *
            <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          <label className="label">
            Цена (₽) *
            <input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </label>
          <label className="label">
            Количество на складе *
            <input className="input" type="number" value={stock} onChange={e => setStock(e.target.value)} />
          </label>
          <label className="label">
            Рейтинг (0–5)
            <input className="input" type="number" step="0.1" value={rating} onChange={e => setRating(e.target.value)} />
          </label>
          <label className="label">
            Ссылка на изображение
            <input className="input" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
          </label>
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn btn--primary">
              {mode === 'edit' ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}