/**
 * CharacterSelectionScreen Component
 *
 * Grid of all characters in the selected category.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import React from 'react';
import type { Category, CharacterTemplate } from '../../types';

interface CharacterSelectionScreenProps {
  category: Category;
  characters: CharacterTemplate[];
  onSelectCharacter: (char: CharacterTemplate) => void;
  onBack: () => void;
}

export const CharacterSelectionScreen: React.FC<
  CharacterSelectionScreenProps
> = ({ category, characters, onSelectCharacter, onBack }) => {
  const categoryLabel = category === 'number' ? 'Number' : 'Letter';

  return (
    <div className="character-selection-screen">
      <button
        onClick={onBack}
        aria-label="Go back to category selection"
        className="back-button"
      >
        ← Back
      </button>
      <h1>Select {categoryLabel}</h1>
      <div className="character-grid" role="list" aria-label={`${categoryLabel} characters`}>
        {characters.map((char) => (
          <button
            key={char.character}
            onClick={() => onSelectCharacter(char)}
            aria-label={`Select ${char.displayName || char.character}`}
            role="listitem"
            className="character-card"
          >
            {char.character}
          </button>
        ))}
      </div>
    </div>
  );
};
