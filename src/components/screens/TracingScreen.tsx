/**
 * TracingScreen Component
 *
 * Main tracing interface where user draws the character.
 * Integrates canvas with navigation and success animation.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import type React from "react";
import type { CharacterTemplate, DrawingSession, Point } from "../../types";
import { NavButtons } from "../navigation/NavButtons";
import { Canvas } from "../tracing/Canvas";
import { SuccessAnimation } from "../tracing/SuccessAnimation";
import "./TracingScreen.css";

interface TracingScreenProps {
	template: CharacterTemplate;
	session: DrawingSession;
	categoryCharacters: CharacterTemplate[];
	onStrokeStart: (point: Point) => void;
	onStrokeMove: (point: Point) => void;
	onStrokeEnd: () => void;
	onNext: () => void;
	onPrevious: () => void;
	onBack: () => void;
	onClear: () => void;
}

export const TracingScreen: React.FC<TracingScreenProps> = ({
	template,
	session,
	categoryCharacters,
	onStrokeStart,
	onStrokeMove,
	onStrokeEnd,
	onNext,
	onPrevious,
	onBack,
	onClear,
}) => {
	const currentIndex = categoryCharacters.findIndex(
		(c) => c.character === template.character,
	);
	const hasNext = currentIndex < categoryCharacters.length - 1;
	const hasPrevious = currentIndex > 0;

	return (
		<div className="tracing-screen">
			<header className="tracing-header">
				<h2 className="visually-hidden">Tracing {template.character}</h2>
				<button
					type="button"
					className="back-button"
					onClick={onBack}
					aria-label="Back to character selection"
				>
					← Back
				</button>
				<div
					className="character-display"
					aria-live="polite"
					aria-atomic="true"
				>
					<span className="character-label">Trace:</span>
					<span className="character-value">{template.character}</span>
				</div>
			</header>

			<main className="tracing-canvas-container">
				<Canvas
					key={`${template.character}-${session.startedAt}`}
					template={template}
					session={session}
					width={500}
					height={500}
					onStrokeStart={onStrokeStart}
					onStrokeMove={onStrokeMove}
					onStrokeEnd={onStrokeEnd}
				/>

				<div
					className="progress-indicator"
					role="status"
					aria-live="polite"
					aria-atomic="true"
				>
					<span>
						{session.isComplete
							? `Completed ${template.totalStrokes} of ${template.totalStrokes} strokes`
							: session.strokes.length === 0 && session.currentStrokeIndex === 0
								? `Start with stroke 1 of ${template.totalStrokes}`
								: `Stroke ${Math.min(session.currentStrokeIndex + 1, template.totalStrokes)} of ${template.totalStrokes}`}
					</span>
					<button
						type="button"
						className="clear-button"
						onClick={onClear}
						aria-label="Clear drawing"
					>
						Clear
					</button>
				</div>

				{session.isComplete && (
					<div role="status" aria-live="assertive" className="visually-hidden">
						Great job! You completed tracing {template.character}!
					</div>
				)}

				<SuccessAnimation
					isVisible={session.isComplete}
					onComplete={() => {}}
				/>
			</main>

			<nav className="tracing-controls" aria-label="Character navigation">
				<NavButtons
					hasNext={hasNext}
					hasPrevious={hasPrevious}
					onNext={onNext}
					onPrevious={onPrevious}
				/>
			</nav>
		</div>
	);
};
