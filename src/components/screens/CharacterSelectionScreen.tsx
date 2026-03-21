/**
 * CharacterSelectionScreen Component
 *
 * Grid of all characters in the selected category.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import type React from 'react';
import type { Category, CharacterTemplate } from '../../types';
import './CharacterSelectionScreen.css';

interface CharacterSelectionScreenProps {
  category: Category;
  characters: CharacterTemplate[];
  onSelectCharacter: (char: CharacterTemplate) => void;
  onBack: () => void;
}

export const CharacterSelectionScreen: React.FC<
  CharacterSelectionScreenProps
> = ({ category, characters, onSelectCharacter, onBack }) => {
  const categoryLabel =
    category === 'number'
      ? 'Number'
      : category === 'uppercase'
        ? 'Letter'
        : 'Letter';

  return (
    <div className="character-selection-screen">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back to category selection"
        className="back-button"
      >
        ← Back
      </button>
      <h1>Select {categoryLabel}</h1>
      <ul className="character-grid" aria-label={`${categoryLabel} characters`}>
        {characters.map((char) => (
          <li key={char.character}>
            <button
              type="button"
              onClick={() => onSelectCharacter(char)}
              aria-label={`Select ${char.displayName || char.character}`}
              className="character-card"
            >
              {char.character}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
