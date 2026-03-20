/**
 * CategorySelectionScreen Component
 *
 * First screen displayed when app opens. Allows choosing between Numbers and Letters.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import React from 'react';
import type { Category } from '../../types';

interface CategorySelectionScreenProps {
  onSelectCategory: (category: Category) => void;
}

export const CategorySelectionScreen: React.FC<
  CategorySelectionScreenProps
> = ({ onSelectCategory }) => {
  return (
    <div className="category-selection-screen">
      <h1>Select a Category</h1>
      <div className="category-grid">
        <button onClick={() => onSelectCategory('number')}>Numbers</button>
        <button onClick={() => onSelectCategory('uppercase')}>Letters</button>
      </div>
    </div>
  );
};
