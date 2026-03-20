/**
 * NavButtons Component
 *
 * Navigation buttons for the tracing screen.
 * Provides Back, Previous, Clear, and Next actions with child-friendly styling.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 * Task: T042
 */

import type React from "react";
import { Button } from "../ui/Button";
import "./NavButtons.css";

export interface NavButtonsProps {
	/** Whether there is a next character available */
	hasNext: boolean;
	/** Whether there is a previous character available */
	hasPrevious: boolean;
	/** Callback for Next button */
	onNext: () => void;
	/** Callback for Previous button */
	onPrevious: () => void;
}

export const NavButtons: React.FC<NavButtonsProps> = ({
	hasNext,
	hasPrevious,
	onNext,
	onPrevious,
}) => {
	return (
		<div className="nav-buttons">
			<div className="nav-buttons__center">
				<Button
					variant="secondary"
					onClick={onPrevious}
					disabled={!hasPrevious}
					aria-label="Previous character"
				>
					← Prev
				</Button>

				<Button
					variant="primary"
					onClick={onNext}
					disabled={!hasNext}
					aria-label="Next character"
				>
					Next →
				</Button>
			</div>
		</div>
	);
};
