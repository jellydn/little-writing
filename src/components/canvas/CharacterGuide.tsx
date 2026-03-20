/**
 * CharacterGuide Component - Placeholder
 *
 * TODO: Implement character guide rendering
 */
import React from 'react';
import type { CharacterTemplate } from '../../types';

interface CharacterGuideProps {
  template: CharacterTemplate;
  currentStrokeIndex: number;
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({ template }) => {
  return (
    <div className="character-guide">
      {/* TODO: Render SVG character guide */}
      <span>{template.character}</span>
    </div>
  );
};
