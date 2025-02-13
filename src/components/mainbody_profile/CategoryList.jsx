// src/components/CategoryList.jsx
import React from 'react';
import CategoryItem from './CategoryItem';

const CategoryList = ({ categories, onCategorySelect }) => {
  return (
    <div className="category-grid">
      {categories.map((category, index) => (
        <CategoryItem 
          key={index} 
          category={category} 
          onSelect={() => onCategorySelect(category.name)} 
        />
      ))}
    </div>
  );
};

export default CategoryList;