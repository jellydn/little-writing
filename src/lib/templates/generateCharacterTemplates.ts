/**
 * Character Template Generator
 *
 * Generates JSON templates for all 62 characters (0-9, A-Z, a-z).
 * Run with: bun run src/lib/templates/generateCharacterTemplates.ts
 */

import fs from 'fs';
import path from 'path';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: number;
  path: string;
  startPoint: Point;
  endPoint: Point;
  guidePoints: Point[];
}

interface Bounds {
  width: number;
  height: number;
  viewBox: string;
}

interface CharacterTemplate {
  character: string;
  category: 'number' | 'uppercase' | 'lowercase';
  displayName: string;
  bounds: Bounds;
  strokes: Stroke[];
  totalStrokes: number;
}

// Base path values for a 100x100 grid
const TOP = 20;
const MIDDLE = 60;
const BOTTOM = 80;
const LEFT = 20;
const CENTER = 50;
const RIGHT = 80;

function createTemplate(
  char: string,
  category: 'number' | 'uppercase' | 'lowercase',
  displayName: string,
  strokes: Omit<Stroke, 'id'>[]
): CharacterTemplate {
  const strokesWithIds = strokes.map((stroke, index) => ({
    ...stroke,
    id: index + 1,
  }));

  return {
    character: char,
    category,
    displayName,
    bounds: {
      width: 100,
      height: 100,
      viewBox: '0 0 100 100',
    },
    strokes: strokesWithIds,
    totalStrokes: strokes.length,
  };
}

function generateLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  steps = 4
): Omit<Stroke, 'id'> {
  const guidePoints: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    guidePoints.push({
      x: x1 + (x2 - x1) * (i / steps),
      y: y1 + (y2 - y1) * (i / steps),
    });
  }

  return {
    path: `M ${x1} ${y1} L ${x2} ${y2}`,
    startPoint: { x: x1, y: y1 },
    endPoint: { x: x2, y: y2 },
    guidePoints,
  };
}

function generateCurve(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  controlX: number,
  controlY: number
): Omit<Stroke, 'id'> {
  const steps = 6;
  const guidePoints: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    // Quadratic bezier
    const x = mt * mt * startX + 2 * mt * t * controlX + t * t * endX;
    const y = mt * mt * startY + 2 * mt * t * controlY + t * t * endY;
    guidePoints.push({ x, y });
  }

  return {
    path: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
    startPoint: { x: startX, y: startY },
    endPoint: { x: endX, y: endY },
    guidePoints,
  };
}

function generateArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): Omit<Stroke, 'id'> {
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;

  const startX = centerX + radius * Math.cos(startAngleRad);
  const startY = centerY + radius * Math.sin(startAngleRad);
  const endX = centerX + radius * Math.cos(endAngleRad);
  const endY = centerY + radius * Math.sin(endAngleRad);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  const sweepFlag = 1;

  const steps = 8;
  const guidePoints: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = startAngleRad + (endAngleRad - startAngleRad) * (i / steps);
    guidePoints.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return {
    path: `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`,
    startPoint: { x: startX, y: startY },
    endPoint: { x: endX, y: endY },
    guidePoints,
  };
}

// Numbers 2-9
const numbers: CharacterTemplate[] = [
  createTemplate('2', 'number', 'Two', [
    generateCurve(LEFT, BOTTOM, RIGHT, BOTTOM, CENTER, TOP), // Top curve
    generateLine(RIGHT, BOTTOM, LEFT, BOTTOM), // Middle line (simplified)
  ]),
  createTemplate('3', 'number', 'Three', [
    generateCurve(RIGHT, TOP, RIGHT, MIDDLE, CENTER + 30, TOP + 20),
    generateCurve(RIGHT, MIDDLE, RIGHT, BOTTOM, CENTER + 30, BOTTOM - 20),
  ]),
  createTemplate('4', 'number', 'Four', [
    generateLine(RIGHT, TOP, RIGHT, BOTTOM),
    generateLine(LEFT, MIDDLE, RIGHT, MIDDLE),
    generateLine(LEFT, TOP, LEFT, MIDDLE),
  ]),
  createTemplate('5', 'number', 'Five', [
    generateLine(RIGHT, TOP, LEFT, TOP),
    generateLine(LEFT, TOP, LEFT, MIDDLE),
    generateLine(LEFT, MIDDLE, RIGHT, MIDDLE),
    generateCurve(RIGHT, MIDDLE, RIGHT, BOTTOM, CENTER, BOTTOM),
  ]),
  createTemplate('6', 'number', 'Six', [
    generateCurve(RIGHT, MIDDLE, RIGHT, BOTTOM, CENTER + 30, MIDDLE + 20),
    generateCurve(RIGHT, BOTTOM, LEFT, BOTTOM, CENTER - 20, BOTTOM + 20),
    generateCurve(LEFT, BOTTOM, LEFT, MIDDLE, CENTER - 30, MIDDLE - 10),
  ]),
  createTemplate('7', 'number', 'Seven', [
    generateLine(LEFT, TOP, RIGHT, TOP),
    generateLine(RIGHT, TOP, LEFT, BOTTOM),
  ]),
  createTemplate('8', 'number', 'Eight', [
    generateCurve(CENTER, TOP + 10, CENTER, MIDDLE - 10, CENTER + 30, TOP + 20),
    generateCurve(CENTER, MIDDLE - 10, CENTER, TOP + 10, CENTER - 30, TOP + 20),
    generateCurve(
      CENTER,
      MIDDLE + 10,
      CENTER,
      BOTTOM - 10,
      CENTER + 30,
      BOTTOM - 20
    ),
    generateCurve(
      CENTER,
      BOTTOM - 10,
      CENTER,
      MIDDLE + 10,
      CENTER - 30,
      BOTTOM - 20
    ),
  ]),
  createTemplate('9', 'number', 'Nine', [
    generateCurve(LEFT, BOTTOM, LEFT, MIDDLE, CENTER - 30, BOTTOM - 20),
    generateCurve(LEFT, MIDDLE, RIGHT, MIDDLE, CENTER + 20, MIDDLE + 20),
    generateCurve(RIGHT, MIDDLE, RIGHT, TOP, CENTER + 30, TOP + 10),
  ]),
];

// Uppercase B-Z (A already exists)
const uppercase: CharacterTemplate[] = [
  createTemplate('B', 'uppercase', 'Bee', [
    generateLine(CENTER, TOP, CENTER, BOTTOM),
    generateCurve(CENTER, TOP, CENTER, MIDDLE, RIGHT, TOP + 20),
    generateCurve(CENTER, MIDDLE, CENTER, MIDDLE, RIGHT, MIDDLE - 20),
    generateCurve(CENTER, MIDDLE, CENTER, BOTTOM, RIGHT, BOTTOM - 20),
    generateCurve(CENTER, BOTTOM, CENTER, BOTTOM, RIGHT, BOTTOM + 20),
  ]),
  createTemplate('C', 'uppercase', 'C', [
    generateArc(CENTER + 10, MIDDLE, 35, 0, 360),
  ]),
  createTemplate('D', 'uppercase', 'Dee', [
    generateLine(CENTER, TOP, CENTER, BOTTOM),
    generateCurve(CENTER, TOP, CENTER, BOTTOM, RIGHT, MIDDLE),
  ]),
  createTemplate('E', 'uppercase', 'Ee', [
    generateLine(RIGHT, TOP, LEFT, TOP),
    generateLine(LEFT, TOP, LEFT, BOTTOM),
    generateLine(LEFT, MIDDLE, CENTER - 10, MIDDLE),
    generateLine(LEFT, BOTTOM, RIGHT, BOTTOM),
  ]),
  createTemplate('F', 'uppercase', 'Eff', [
    generateLine(RIGHT, TOP, LEFT, TOP),
    generateLine(LEFT, TOP, LEFT, BOTTOM),
    generateLine(LEFT, MIDDLE, RIGHT, MIDDLE),
  ]),
  createTemplate('G', 'uppercase', 'Gee', [
    generateArc(CENTER + 10, MIDDLE, 35, 45, 315),
    generateLine(CENTER + 10, MIDDLE, CENTER, MIDDLE),
    generateLine(CENTER, MIDDLE, CENTER + 30, MIDDLE),
  ]),
  createTemplate('H', 'uppercase', 'Aitch', [
    generateLine(LEFT, TOP, LEFT, BOTTOM),
    generateLine(RIGHT, TOP, RIGHT, BOTTOM),
    generateLine(LEFT, MIDDLE, RIGHT, MIDDLE),
  ]),
  createTemplate('I', 'uppercase', 'Eye', [
    generateLine(CENTER, TOP, CENTER, BOTTOM),
  ]),
  createTemplate('J', 'uppercase', 'Jay', [
    generateLine(RIGHT, TOP, RIGHT, BOTTOM - 10),
    generateCurve(RIGHT, BOTTOM - 10, CENTER + 15, BOTTOM, CENTER, BOTTOM),
  ]),
  createTemplate('K', 'uppercase', 'Kay', [
    generateLine(LEFT, TOP, LEFT, BOTTOM),
    generateLine(RIGHT, TOP, LEFT, MIDDLE),
    generateLine(LEFT, MIDDLE, RIGHT, BOTTOM),
  ]),
  createTemplate('L', 'uppercase', 'Ell', [
    generateLine(LEFT, TOP, LEFT, BOTTOM),
    generateLine(LEFT, BOTTOM, RIGHT, BOTTOM),
  ]),
  createTemplate('M', 'uppercase', 'Em', [
    generateLine(LEFT, BOTTOM, LEFT, TOP),
    generateLine(LEFT, TOP, CENTER, TOP + 25),
    generateLine(CENTER, TOP + 25, RIGHT, TOP),
    generateLine(RIGHT, TOP, RIGHT, BOTTOM),
  ]),
  createTemplate('N', 'uppercase', 'En', [
    generateLine(LEFT, BOTTOM, LEFT, TOP),
    generateLine(LEFT, TOP, RIGHT, BOTTOM),
    generateLine(RIGHT, BOTTOM, RIGHT, TOP),
  ]),
  createTemplate('O', 'uppercase', 'Oh', [
    generateArc(CENTER, MIDDLE, 35, 0, 360),
  ]),
  createTemplate('P', 'uppercase', 'Pee', [
    generateLine(CENTER, TOP, CENTER, BOTTOM),
    generateCurve(CENTER, TOP, CENTER, MIDDLE, RIGHT, TOP + 20),
    generateCurve(CENTER, MIDDLE, CENTER, MIDDLE, RIGHT, MIDDLE - 20),
  ]),
  createTemplate('Q', 'uppercase', 'Cue', [
    generateArc(CENTER, MIDDLE, 35, 0, 360),
    generateLine(CENTER + 20, BOTTOM - 10, RIGHT, BOTTOM),
  ]),
  createTemplate('R', 'uppercase', 'Are', [
    generateLine(CENTER, TOP, CENTER, BOTTOM),
    generateCurve(CENTER, TOP, CENTER, MIDDLE, RIGHT, TOP + 20),
    generateCurve(CENTER, MIDDLE, CENTER, MIDDLE, RIGHT, MIDDLE - 20),
    generateLine(CENTER, MIDDLE, RIGHT, BOTTOM),
  ]),
  createTemplate('S', 'uppercase', 'Ess', [
    generateCurve(RIGHT, TOP, LEFT, TOP + 15, CENTER + 20, TOP),
    generateCurve(LEFT, TOP + 15, LEFT, MIDDLE - 10, CENTER - 20, MIDDLE),
    generateCurve(LEFT, MIDDLE - 10, RIGHT, BOTTOM, CENTER, BOTTOM),
  ]),
  createTemplate('T', 'uppercase', 'Tee', [
    generateLine(LEFT, TOP, RIGHT, TOP),
    generateLine(CENTER, TOP, CENTER, BOTTOM),
  ]),
  createTemplate('U', 'uppercase', 'You', [
    generateLine(LEFT, TOP, LEFT, BOTTOM - 10),
    generateCurve(LEFT, BOTTOM - 10, RIGHT, BOTTOM - 10, CENTER, BOTTOM),
    generateLine(RIGHT, BOTTOM - 10, RIGHT, TOP),
  ]),
  createTemplate('V', 'uppercase', 'Vee', [
    generateLine(LEFT, TOP, CENTER, BOTTOM),
    generateLine(CENTER, BOTTOM, RIGHT, TOP),
  ]),
  createTemplate('W', 'uppercase', 'Double-U', [
    generateLine(LEFT, TOP, LEFT + 25, BOTTOM),
    generateLine(LEFT + 25, BOTTOM, CENTER, TOP + 20),
    generateLine(CENTER, TOP + 20, RIGHT - 25, BOTTOM),
    generateLine(RIGHT - 25, BOTTOM, RIGHT, TOP),
  ]),
  createTemplate('X', 'uppercase', 'Ex', [
    generateLine(LEFT, TOP, RIGHT, BOTTOM),
    generateLine(RIGHT, TOP, LEFT, BOTTOM),
  ]),
  createTemplate('Y', 'uppercase', 'Why', [
    generateLine(LEFT, TOP, CENTER, MIDDLE),
    generateLine(RIGHT, TOP, CENTER, MIDDLE),
    generateLine(CENTER, MIDDLE, CENTER, BOTTOM),
  ]),
  createTemplate('Z', 'uppercase', 'Zee', [
    generateLine(LEFT, TOP, RIGHT, TOP),
    generateLine(RIGHT, TOP, LEFT, BOTTOM),
    generateLine(LEFT, BOTTOM, RIGHT, BOTTOM),
  ]),
];

// Lowercase a-z
const lowercase: CharacterTemplate[] = [
  createTemplate('a', 'lowercase', 'a', [
    generateCurve(
      CENTER,
      MIDDLE - 10,
      CENTER,
      MIDDLE - 10,
      CENTER + 25,
      MIDDLE - 20
    ),
    generateCurve(
      CENTER,
      MIDDLE - 10,
      CENTER,
      MIDDLE - 10,
      CENTER - 25,
      MIDDLE - 20
    ),
    generateLine(CENTER - 15, MIDDLE, CENTER - 15, BOTTOM - 10),
  ]),
  createTemplate('b', 'lowercase', 'b', [
    generateLine(LEFT, TOP, LEFT, BOTTOM),
    generateCurve(LEFT, MIDDLE, RIGHT, MIDDLE, CENTER, MIDDLE + 20),
    generateCurve(RIGHT, MIDDLE, LEFT, MIDDLE, CENTER, MIDDLE - 20),
  ]),
  createTemplate('c', 'lowercase', 'c', [
    generateCurve(CENTER + 10, MIDDLE, CENTER + 10, MIDDLE, RIGHT, MIDDLE - 20),
    generateCurve(CENTER + 10, MIDDLE, CENTER + 10, MIDDLE, LEFT, MIDDLE + 20),
  ]),
  createTemplate('d', 'lowercase', 'd', [
    generateLine(RIGHT, TOP, RIGHT, BOTTOM),
    generateCurve(RIGHT, MIDDLE, LEFT, MIDDLE, CENTER, MIDDLE + 20),
    generateCurve(LEFT, MIDDLE, RIGHT, MIDDLE, CENTER, MIDDLE - 20),
  ]),
  createTemplate('e', 'lowercase', 'e', [
    generateCurve(CENTER + 5, MIDDLE, CENTER + 5, MIDDLE, RIGHT, MIDDLE - 20),
    generateCurve(CENTER + 5, MIDDLE, CENTER + 5, MIDDLE, LEFT, MIDDLE + 20),
    generateLine(LEFT, MIDDLE, RIGHT, MIDDLE),
  ]),
  createTemplate('f', 'lowercase', 'f', [
    generateCurve(RIGHT, TOP, LEFT, TOP + 10, CENTER, TOP),
    generateLine(LEFT, TOP + 10, LEFT, BOTTOM),
    generateLine(LEFT, MIDDLE - 5, RIGHT, MIDDLE - 5),
  ]),
  createTemplate('g', 'lowercase', 'g', [
    generateCurve(RIGHT, MIDDLE, LEFT, MIDDLE, CENTER, MIDDLE + 20),
    generateCurve(LEFT, MIDDLE, RIGHT, MIDDLE, CENTER, MIDDLE - 20),
    generateLine(RIGHT, MIDDLE, RIGHT, BOTTOM + 10),
    generateCurve(RIGHT, BOTTOM + 10, LEFT, BOTTOM + 10, CENTER, BOTTOM + 30),
  ]),
  createTemplate('h', 'lowercase', 'h', [
    generateLine(LEFT, TOP, LEFT, BOTTOM),
    generateCurve(LEFT, MIDDLE - 5, RIGHT, MIDDLE - 5, CENTER, MIDDLE + 15),
  ]),
  createTemplate('i', 'lowercase', 'i', [
    generateLine(CENTER, MIDDLE, CENTER, BOTTOM),
  ]),
  createTemplate('j', 'lowercase', 'j', [
    generateLine(CENTER + 5, MIDDLE, CENTER + 5, BOTTOM + 10),
    generateCurve(
      CENTER + 5,
      BOTTOM + 10,
      LEFT + 5,
      BOTTOM + 10,
      CENTER,
      BOTTOM + 25
    ),
  ]),
  createTemplate('k', 'lowercase', 'k', [
    generateLine(LEFT, TOP, LEFT, BOTTOM),
    generateLine(RIGHT, MIDDLE, LEFT, MIDDLE),
    generateLine(LEFT, MIDDLE, RIGHT, BOTTOM),
  ]),
  createTemplate('l', 'lowercase', 'l', [
    generateLine(CENTER, TOP, CENTER, BOTTOM),
  ]),
  createTemplate('m', 'lowercase', 'm', [
    generateLine(LEFT, MIDDLE, LEFT, BOTTOM),
    generateCurve(LEFT, MIDDLE, CENTER - 15, MIDDLE, LEFT + 15, MIDDLE + 15),
    generateLine(CENTER - 15, MIDDLE, CENTER - 15, BOTTOM),
    generateCurve(CENTER - 15, MIDDLE, RIGHT, MIDDLE, CENTER + 15, MIDDLE + 15),
  ]),
  createTemplate('n', 'lowercase', 'n', [
    generateLine(LEFT, MIDDLE, LEFT, BOTTOM),
    generateCurve(LEFT, MIDDLE, RIGHT, MIDDLE, CENTER, MIDDLE + 15),
  ]),
  createTemplate('o', 'lowercase', 'o', [
    generateCurve(RIGHT, MIDDLE, LEFT, MIDDLE, CENTER, MIDDLE + 20),
    generateCurve(LEFT, MIDDLE, RIGHT, MIDDLE, CENTER, MIDDLE - 20),
  ]),
  createTemplate('p', 'lowercase', 'p', [
    generateLine(LEFT, MIDDLE, LEFT, BOTTOM + 10),
    generateCurve(LEFT, MIDDLE, RIGHT, MIDDLE, CENTER, MIDDLE + 20),
    generateCurve(RIGHT, MIDDLE, LEFT, MIDDLE, CENTER, MIDDLE - 20),
  ]),
  createTemplate('q', 'lowercase', 'q', [
    generateLine(RIGHT, MIDDLE, RIGHT, BOTTOM + 10),
    generateCurve(RIGHT, MIDDLE, LEFT, MIDDLE, CENTER, MIDDLE + 20),
    generateCurve(LEFT, MIDDLE, RIGHT, MIDDLE, CENTER, MIDDLE - 20),
  ]),
  createTemplate('r', 'lowercase', 'r', [
    generateLine(LEFT, MIDDLE, LEFT, BOTTOM),
    generateCurve(LEFT, MIDDLE, CENTER + 10, MIDDLE, CENTER, MIDDLE + 15),
  ]),
  createTemplate('s', 'lowercase', 's', [
    generateCurve(RIGHT, MIDDLE, LEFT, MIDDLE - 5, CENTER + 15, MIDDLE),
    generateCurve(LEFT, MIDDLE - 5, LEFT, MIDDLE + 5, CENTER, MIDDLE),
    generateCurve(LEFT, MIDDLE + 5, RIGHT, MIDDLE, CENTER - 5, MIDDLE),
  ]),
  createTemplate('t', 'lowercase', 't', [
    generateLine(CENTER, TOP, CENTER, BOTTOM - 5),
    generateLine(LEFT, MIDDLE - 5, RIGHT, MIDDLE - 5),
  ]),
  createTemplate('u', 'lowercase', 'u', [
    generateLine(LEFT, MIDDLE, LEFT, BOTTOM - 5),
    generateCurve(LEFT, BOTTOM - 5, RIGHT, BOTTOM - 5, CENTER, BOTTOM + 10),
  ]),
  createTemplate('v', 'lowercase', 'v', [
    generateLine(LEFT, MIDDLE, CENTER, BOTTOM),
    generateLine(CENTER, BOTTOM, RIGHT, MIDDLE),
  ]),
  createTemplate('w', 'lowercase', 'w', [
    generateLine(LEFT, MIDDLE, LEFT + 20, BOTTOM),
    generateLine(LEFT + 20, BOTTOM, CENTER, MIDDLE + 5),
    generateLine(CENTER, MIDDLE + 5, RIGHT - 20, BOTTOM),
    generateLine(RIGHT - 20, BOTTOM, RIGHT, MIDDLE),
  ]),
  createTemplate('x', 'lowercase', 'x', [
    generateLine(LEFT, MIDDLE, RIGHT, BOTTOM),
    generateLine(RIGHT, MIDDLE, LEFT, BOTTOM),
  ]),
  createTemplate('y', 'lowercase', 'y', [
    generateLine(LEFT, MIDDLE, CENTER, BOTTOM),
    generateLine(CENTER, BOTTOM, RIGHT, MIDDLE),
    generateLine(CENTER, BOTTOM, CENTER, BOTTOM + 10),
  ]),
  createTemplate('z', 'lowercase', 'z', [
    generateLine(LEFT, MIDDLE, RIGHT, MIDDLE),
    generateLine(RIGHT, MIDDLE, LEFT, BOTTOM),
    generateLine(LEFT, BOTTOM, RIGHT, BOTTOM),
  ]),
];

function writeTemplate(template: CharacterTemplate, dir: string): void {
  const fileName = `${template.character}.json`;
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
}

function main(): void {
  const baseDir = path.join(__dirname, '../../assets/characters');

  // Ensure directories exist
  const numbersDir = path.join(baseDir, 'numbers');
  const uppercaseDir = path.join(baseDir, 'uppercase');
  const lowercaseDir = path.join(baseDir, 'lowercase');

  [numbersDir, uppercaseDir, lowercaseDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Write templates
  numbers.forEach((template) => writeTemplate(template, numbersDir));
  uppercase.forEach((template) => writeTemplate(template, uppercaseDir));
  lowercase.forEach((template) => writeTemplate(template, lowercaseDir));

  // eslint-disable-next-line no-console
  console.log(`Generated ${numbers.length} number templates`);
  // eslint-disable-next-line no-console
  console.log(`Generated ${uppercase.length} uppercase letter templates`);
  // eslint-disable-next-line no-console
  console.log(`Generated ${lowercase.length} lowercase letter templates`);
  // eslint-disable-next-line no-console
  console.log('Total: 62 character templates');
}

main();
