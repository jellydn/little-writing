/**
 * Character data exports for the Handwriting Tracing App
 *
 * This file provides access to all character templates organized by category.
 * Data is loaded from JSON files in assets/characters/
 *
 * Reference: specs/001-handwriting-tracing/data-model.md
 */

import type {
  Category,
  CategoryCollection,
  CharacterTemplate,
} from '../../types/index';

// ============================================================================
// JSON IMPORTS
// ============================================================================
// Import all character JSON files

// Lowercase Letters (a-z)
import chara from '../../assets/characters/lowercase/a.json';
import charb from '../../assets/characters/lowercase/b.json';
import charc from '../../assets/characters/lowercase/c.json';
import chard from '../../assets/characters/lowercase/d.json';
import chare from '../../assets/characters/lowercase/e.json';
import charf from '../../assets/characters/lowercase/f.json';
import charg from '../../assets/characters/lowercase/g.json';
import charh from '../../assets/characters/lowercase/h.json';
import chari from '../../assets/characters/lowercase/i.json';
import charj from '../../assets/characters/lowercase/j.json';
import chark from '../../assets/characters/lowercase/k.json';
import charl from '../../assets/characters/lowercase/l.json';
import charm from '../../assets/characters/lowercase/m.json';
import charn from '../../assets/characters/lowercase/n.json';
import charo from '../../assets/characters/lowercase/o.json';
import charp from '../../assets/characters/lowercase/p.json';
import charq from '../../assets/characters/lowercase/q.json';
import charr from '../../assets/characters/lowercase/r.json';
import chars from '../../assets/characters/lowercase/s.json';
import chart from '../../assets/characters/lowercase/t.json';
import charu from '../../assets/characters/lowercase/u.json';
import charv from '../../assets/characters/lowercase/v.json';
import charw from '../../assets/characters/lowercase/w.json';
import charx from '../../assets/characters/lowercase/x.json';
import chary from '../../assets/characters/lowercase/y.json';
import charz from '../../assets/characters/lowercase/z.json';
// Numbers (0-9)
import char0 from '../../assets/characters/numbers/0.json';
import char1 from '../../assets/characters/numbers/1.json';
import char2 from '../../assets/characters/numbers/2.json';
import char3 from '../../assets/characters/numbers/3.json';
import char4 from '../../assets/characters/numbers/4.json';
import char5 from '../../assets/characters/numbers/5.json';
import char6 from '../../assets/characters/numbers/6.json';
import char7 from '../../assets/characters/numbers/7.json';
import char8 from '../../assets/characters/numbers/8.json';
import char9 from '../../assets/characters/numbers/9.json';
// Uppercase Letters (A-Z)
import charA from '../../assets/characters/uppercase/A.json';
import charB from '../../assets/characters/uppercase/B.json';
import charC from '../../assets/characters/uppercase/C.json';
import charD from '../../assets/characters/uppercase/D.json';
import charE from '../../assets/characters/uppercase/E.json';
import charF from '../../assets/characters/uppercase/F.json';
import charG from '../../assets/characters/uppercase/G.json';
import charH from '../../assets/characters/uppercase/H.json';
import charI from '../../assets/characters/uppercase/I.json';
import charJ from '../../assets/characters/uppercase/J.json';
import charK from '../../assets/characters/uppercase/K.json';
import charL from '../../assets/characters/uppercase/L.json';
import charM from '../../assets/characters/uppercase/M.json';
import charN from '../../assets/characters/uppercase/N.json';
import charO from '../../assets/characters/uppercase/O.json';
import charP from '../../assets/characters/uppercase/P.json';
import charQ from '../../assets/characters/uppercase/Q.json';
import charR from '../../assets/characters/uppercase/R.json';
import charS from '../../assets/characters/uppercase/S.json';
import charT from '../../assets/characters/uppercase/T.json';
import charU from '../../assets/characters/uppercase/U.json';
import charV from '../../assets/characters/uppercase/V.json';
import charW from '../../assets/characters/uppercase/W.json';
import charX from '../../assets/characters/uppercase/X.json';
import charY from '../../assets/characters/uppercase/Y.json';
import charZ from '../../assets/characters/uppercase/Z.json';

// ============================================================================
// CHARACTER REGISTRY
// ============================================================================

const NUMBER_CHARACTERS: CharacterTemplate[] = [
  char0 as CharacterTemplate,
  char1 as CharacterTemplate,
  char2 as CharacterTemplate,
  char3 as CharacterTemplate,
  char4 as CharacterTemplate,
  char5 as CharacterTemplate,
  char6 as CharacterTemplate,
  char7 as CharacterTemplate,
  char8 as CharacterTemplate,
  char9 as CharacterTemplate,
];

const UPPERCASE_CHARACTERS: CharacterTemplate[] = [
  charA as CharacterTemplate,
  charB as CharacterTemplate,
  charC as CharacterTemplate,
  charD as CharacterTemplate,
  charE as CharacterTemplate,
  charF as CharacterTemplate,
  charG as CharacterTemplate,
  charH as CharacterTemplate,
  charI as CharacterTemplate,
  charJ as CharacterTemplate,
  charK as CharacterTemplate,
  charL as CharacterTemplate,
  charM as CharacterTemplate,
  charN as CharacterTemplate,
  charO as CharacterTemplate,
  charP as CharacterTemplate,
  charQ as CharacterTemplate,
  charR as CharacterTemplate,
  charS as CharacterTemplate,
  charT as CharacterTemplate,
  charU as CharacterTemplate,
  charV as CharacterTemplate,
  charW as CharacterTemplate,
  charX as CharacterTemplate,
  charY as CharacterTemplate,
  charZ as CharacterTemplate,
];

const LOWERCASE_CHARACTERS: CharacterTemplate[] = [
  chara as CharacterTemplate,
  charb as CharacterTemplate,
  charc as CharacterTemplate,
  chard as CharacterTemplate,
  chare as CharacterTemplate,
  charf as CharacterTemplate,
  charg as CharacterTemplate,
  charh as CharacterTemplate,
  chari as CharacterTemplate,
  charj as CharacterTemplate,
  chark as CharacterTemplate,
  charl as CharacterTemplate,
  charm as CharacterTemplate,
  charn as CharacterTemplate,
  charo as CharacterTemplate,
  charp as CharacterTemplate,
  charq as CharacterTemplate,
  charr as CharacterTemplate,
  chars as CharacterTemplate,
  chart as CharacterTemplate,
  charu as CharacterTemplate,
  charv as CharacterTemplate,
  charw as CharacterTemplate,
  charx as CharacterTemplate,
  chary as CharacterTemplate,
  charz as CharacterTemplate,
];

export const CHARACTERS_BY_CATEGORY: Record<Category, CharacterTemplate[]> = {
  number: NUMBER_CHARACTERS,
  uppercase: UPPERCASE_CHARACTERS,
  lowercase: LOWERCASE_CHARACTERS,
};

// ============================================================================
// CATEGORY METADATA
// ============================================================================

const CATEGORY_METADATA: Record<Category, string> = {
  number: 'Numbers',
  uppercase: 'Uppercase',
  lowercase: 'Lowercase',
};

// ============================================================================
// PUBLIC API
// ============================================================================

export const ALL_CATEGORIES: Category[] = ['number', 'uppercase', 'lowercase'];

export function getCharacter(
  character: string,
  category: Category
): CharacterTemplate {
  const characters = CHARACTERS_BY_CATEGORY[category];
  const template = characters.find((c) => c.character === character);

  if (!template) {
    throw new Error(
      `Character "${character}" not found in category "${category}"`
    );
  }

  return template;
}

export function getCategory(category: Category): CategoryCollection {
  return {
    id: category,
    displayName: CATEGORY_METADATA[category],
    characters: CHARACTERS_BY_CATEGORY[category],
  };
}

export function getAllCategories(): CategoryCollection[] {
  return ALL_CATEGORIES.map((category) => getCategory(category));
}

export function getTotalCharacterCount(): number {
  return ALL_CATEGORIES.reduce(
    (total, category) => total + CHARACTERS_BY_CATEGORY[category].length,
    0
  );
}

export function hasCharacter(character: string, category: Category): boolean {
  return CHARACTERS_BY_CATEGORY[category].some(
    (c) => c.character === character
  );
}

export function getNextCharacter(
  currentCharacter: string,
  category: Category
): CharacterTemplate {
  const characters = CHARACTERS_BY_CATEGORY[category];
  const currentIndex = characters.findIndex(
    (c) => c.character === currentCharacter
  );
  const nextIndex = (currentIndex + 1) % characters.length;
  return characters[nextIndex];
}

export function getPreviousCharacter(
  currentCharacter: string,
  category: Category
): CharacterTemplate {
  const characters = CHARACTERS_BY_CATEGORY[category];
  const currentIndex = characters.findIndex(
    (c) => c.character === currentCharacter
  );
  const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1;
  return characters[prevIndex];
}
