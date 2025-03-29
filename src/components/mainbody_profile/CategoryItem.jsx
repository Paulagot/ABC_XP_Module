import React from 'react';


const CategoryItem = ({ category, onSelect }) => {
  return (
    <div 
      className="category-card"
      onClick={onSelect}
    >
      <h3 className="category-title">{category.name}</h3>
      <div className="category-progress-container">
        <div 
          className={`category-progress ${category.color}`}
          style={{width: `${category.progress * 100}%`}}
        />
      </div>
    </div>
  );
};

export default CategoryItem;