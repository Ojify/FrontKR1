import React from 'react';

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="productCard">
      {product.image && <img src={product.image} alt={product.name} className="productCard__image" />}
      <div className="productCard__content">
        <div className="productCard__id">#{product.id}</div>
        <div className="productCard__name">{product.name}</div>
        <div className="productCard__category">{product.category}</div>
        <div className="productCard__description">{product.description}</div>
        <div className="productCard__price">{product.price} ₽</div>
        <div className="productCard__stock">В наличии: {product.stock}</div>
        {product.rating && <div className="productCard__rating">★ {product.rating}</div>}
      </div>
      <div className="productCard__actions">
        <button className="btn btn--primary" onClick={() => onEdit(product)}>Редактировать</button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id)}>Удалить</button>
      </div>
    </div>
  );
}