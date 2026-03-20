/**
 * Template Loader for Character Templates
 *
 * Loads and validates character template JSON files from assets.
 * Templates are stored in src/assets/characters/{category}/{character}.json
 */
/**
 * Custom error class for template loading errors
 */
export class TemplateLoadError extends Error {
    constructor(message, character, category) {
        super(message);
        this.character = character;
        this.category = category;
        this.name = 'TemplateLoadError';
    }
}
/**
 * Validates that a template object matches the CharacterTemplate interface
 *
 * @param template - The template object to validate
 * @returns true if valid, false otherwise
 */
export function validateTemplate(template) {
    // Basic null/undefined check
    if (!template || typeof template !== 'object') {
        return false;
    }
    const t = template;
    // Check required top-level properties
    if (typeof t.character !== 'string' ||
        !['number', 'uppercase', 'lowercase'].includes(t.category)) {
        return false;
    }
    // Validate bounds
    if (!t.bounds ||
        typeof t.bounds !== 'object' ||
        typeof t.bounds.width !== 'number' ||
        typeof t.bounds.height !== 'number' ||
        typeof t.bounds.viewBox !== 'string') {
        return false;
    }
    // Validate strokes array
    if (!Array.isArray(t.strokes) || t.strokes.length === 0) {
        return false;
    }
    // Validate each stroke
    for (const stroke of t.strokes) {
        if (!stroke ||
            typeof stroke !== 'object' ||
            typeof stroke.id !== 'number' ||
            typeof stroke.path !== 'string' ||
            !stroke.startPoint ||
            typeof stroke.startPoint !== 'object' ||
            !stroke.endPoint ||
            typeof stroke.endPoint !== 'object' ||
            !Array.isArray(stroke.guidePoints)) {
            return false;
        }
        // Validate startPoint and endPoint structure
        const startPoint = stroke.startPoint;
        const endPoint = stroke.endPoint;
        if (typeof startPoint.x !== 'number' ||
            typeof startPoint.y !== 'number' ||
            typeof endPoint.x !== 'number' ||
            typeof endPoint.y !== 'number') {
            return false;
        }
        // Validate guidePoints
        const guidePoints = stroke
            .guidePoints;
        for (const point of guidePoints) {
            if (!point ||
                typeof point !== 'object' ||
                typeof point.x !== 'number' ||
                typeof point.y !== 'number') {
                return false;
            }
        }
    }
    // Validate totalStrokes
    if (typeof t.totalStrokes !== 'number' ||
        t.totalStrokes !== t.strokes.length) {
        return false;
    }
    // Validate displayName if present
    if (t.displayName !== undefined && typeof t.displayName !== 'string') {
        return false;
    }
    return true;
}
/**
 * Loads a single character template from JSON file
 *
 * @param character - The character name (e.g., "A", "5")
 * @param category - The category category ('number' | 'uppercase' | 'lowercase')
 * @returns Promise resolving to the validated CharacterTemplate
 * @throws TemplateLoadError if file not found, parsing fails, or validation fails
 */
export async function loadCharacterTemplate(character, category) {
    try {
        // Dynamic import of the JSON file
        const filePath = `../../../assets/characters/${category}/${character}.json`;
        const module = await import(filePath);
        // Handle both default export and direct module exports
        const rawData = module.default || module;
        // Validate the loaded data
        if (!validateTemplate(rawData)) {
            throw new TemplateLoadError(`Invalid template structure for character "${character}" in category "${category}"`, character, category);
        }
        // Additional validation: ensure the character matches the filename
        if (rawData.character !== character) {
            throw new TemplateLoadError(`Template character mismatch: expected "${character}" but got "${rawData.character}"`, character, category);
        }
        // Additional validation: ensure the category matches
        if (rawData.category !== category) {
            throw new TemplateLoadError(`Template category mismatch: expected "${category}" but got "${rawData.category}"`, character, category);
        }
        return rawData;
    }
    catch (error) {
        // Re-throw TemplateLoadError as-is
        if (error instanceof TemplateLoadError) {
            throw error;
        }
        // Handle module not found errors
        if (error instanceof Error &&
            error.message.includes('Cannot find module')) {
            throw new TemplateLoadError(`Template file not found for character "${character}" in category "${category}"`, character, category);
        }
        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            throw new TemplateLoadError(`Invalid JSON in template file for character "${character}" in category "${category}"`, character, category);
        }
        // Wrap unknown errors
        throw new TemplateLoadError(`Failed to load template for character "${character}" in category "${category}": ${error instanceof Error ? error.message : 'Unknown error'}`, character, category);
    }
}
/**
 * Loads all character templates for a specific category
 *
 * @param category - The category to load templates for
 * @returns Promise resolving to an array of validated CharacterTemplate objects
 * @throws TemplateLoadError if the category directory cannot be accessed
 */
export async function loadCategory(category) {
    // List of known characters for each category
    // In a production app, this could be dynamically discovered
    const characterLists = {
        number: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        uppercase: [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
        ],
        lowercase: [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
        ],
    };
    const characters = characterLists[category];
    const templates = [];
    const errors = [];
    // Try to load each character template
    for (const character of characters) {
        try {
            const template = await loadCharacterTemplate(character, category);
            templates.push(template);
        }
        catch (error) {
            // Collect errors but continue loading other templates
            errors.push({
                character,
                error: error instanceof Error ? error : new Error(String(error)),
            });
        }
    }
    // If no templates were loaded, throw an error
    if (templates.length === 0) {
        throw new TemplateLoadError(`No valid templates found for category "${category}". Errors: ${errors.map((e) => `${e.character} (${e.error.message})`).join(', ')}`, undefined, category);
    }
    // Log warnings for failed loads (but don't fail the entire operation)
    if (errors.length > 0) {
        console.warn(`Failed to load some templates for category "${category}":`, errors.map((e) => e.character));
    }
    return templates;
}
/**
 * Batch loads multiple character templates
 *
 * @param characters - Array of {character, category} objects to load
 * @returns Promise resolving to an array of validated CharacterTemplate objects
 * @throws TemplateLoadError if any template fails to load
 */
export async function loadCharacterTemplates(characters) {
    const templates = [];
    const errors = [];
    // Load templates in parallel
    const results = await Promise.allSettled(characters.map(({ character, category }) => loadCharacterTemplate(character, category)));
    // Process results
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const { character, category } = characters[i];
        if (result.status === 'fulfilled') {
            templates.push(result.value);
        }
        else {
            errors.push({
                character,
                category,
                error: result.reason instanceof Error
                    ? result.reason
                    : new Error(String(result.reason)),
            });
        }
    }
    // If no templates were loaded, throw an error
    if (templates.length === 0) {
        throw new TemplateLoadError(`Failed to load all templates. Errors: ${errors.map((e) => `${e.character} (${e.error.message})`).join(', ')}`);
    }
    // Log warnings for failed loads
    if (errors.length > 0) {
        console.warn('Failed to load some templates:', errors.map((e) => `${e.character} (${e.category})`));
    }
    return templates;
}
