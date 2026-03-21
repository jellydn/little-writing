/**
 * CategorySelectionScreen Component
 *
 * First screen displayed when app opens. Allows choosing between Numbers, Uppercase, and Lowercase letters.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import type React from 'react';
import type { Category } from '../../types';
import './CategorySelectionScreen.css';

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
        <button type="button" onClick={() => onSelectCategory('number')}>
          <span className="category-icon">1</span>
          <span className="category-label">Numbers</span>
        </button>
        <button type="button" onClick={() => onSelectCategory('uppercase')}>
          <span className="category-icon">A</span>
          <span className="category-label">Uppercase</span>
        </button>
        <button type="button" onClick={() => onSelectCategory('lowercase')}>
          <span className="category-icon">a</span>
          <span className="category-label">Lowercase</span>
        </button>
      </div>
    </div>
  );
};
