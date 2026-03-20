/**
 * AppLayout Component
 *
 * Main app shell that handles screen routing based on store state.
 *
 * Renders different screens based on currentScreen state:
 * - "category-selection": CategorySelectionScreen
 * - "character-selection": CharacterSelectionScreen
 * - "tracing": TracingScreen
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 * Task: T028
 */

import React from 'react';
import { useAppStore } from '../../state/sessionStore';
import { CategorySelectionScreen } from '../screens/CategorySelectionScreen';
import { CharacterSelectionScreen } from '../screens/CharacterSelectionScreen';
import { TracingScreen } from '../screens/TracingScreen';
import { ErrorBoundary } from './ErrorBoundary';
import { CHARACTERS_BY_CATEGORY } from '../../lib/templates/characterData';
import './AppLayout.css';

/**
 * Main app layout component that manages screen routing
 */
export const AppLayout: React.FC = () => {
  const currentScreen = useAppStore((state) => state.currentScreen);
  const currentCategory = useAppStore((state) => state.currentCategory);
  const currentCharacter = useAppStore((state) => state.currentCharacter);
  const session = useAppStore((state) => state.session);

  const selectCategory = useAppStore((state) => state.selectCategory);
  const selectCharacter = useAppStore((state) => state.selectCharacter);
  const navigateToCategorySelection = useAppStore(
    (state) => state.navigateToCategorySelection
  );
  const startStroke = useAppStore((state) => state.startStroke);
  const addStrokePoint = useAppStore((state) => state.addStrokePoint);
  const endStroke = useAppStore((state) => state.endStroke);
  const clearSession = useAppStore((state) => state.clearSession);
  const nextCharacter = useAppStore((state) => state.nextCharacter);
  const previousCharacter = useAppStore((state) => state.previousCharacter);

  const characters = CHARACTERS_BY_CATEGORY[currentCategory];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'category-selection':
        return <CategorySelectionScreen onSelectCategory={selectCategory} />;

      case 'character-selection':
        return (
          <CharacterSelectionScreen
            category={currentCategory}
            characters={characters}
            onSelectCharacter={selectCharacter}
            onBack={navigateToCategorySelection}
          />
        );

      case 'tracing':
        if (!currentCharacter || !session) {
          // Fallback to category selection if no character/session
          navigateToCategorySelection();
          return null;
        }
        return (
          <TracingScreen
            template={currentCharacter}
            session={session}
            onStrokeStart={startStroke}
            onStrokeMove={addStrokePoint}
            onStrokeEnd={endStroke}
            onNext={nextCharacter}
            onPrevious={previousCharacter}
            onBack={navigateToCategorySelection}
            onClear={clearSession}
          />
        );

      default:
        // Ensure exhaustive check - TypeScript will error if new screens are added
        const _exhaustiveCheck: never = currentScreen;
        return _exhaustiveCheck;
    }
  };

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ErrorBoundary>
        <main id="main-content" className="app-container">
          {renderScreen()}
        </main>
      </ErrorBoundary>
    </div>
  );
};
