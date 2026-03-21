import React, { useEffect, useRef } from "react";
import { renderSVGPath } from "../../lib/canvas/pathRenderer";
import { COLORS, UI_CONFIG } from "../../styles/theme";
import type { Category, CharacterTemplate } from "../../types";

export interface CharacterGridProps {
	category: Category;
	characters: CharacterTemplate[];
	onSelectCharacter: (char: CharacterTemplate) => void;
	onBack: () => void;
}

const getCategoryDisplayName = (category: Category): string => {
	switch (category) {
		case "number":
			return "Numbers";
		case "uppercase":
			return "Uppercase Letters";
		case "lowercase":
			return "Lowercase Letters";
	}
};

const containerStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	height: "100vh",
	backgroundColor: COLORS.background,
};

const headerStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: "16px 20px",
	backgroundColor: "#ffffff",
	borderBottom: `1px solid ${COLORS.outlineBorder}`,
	minHeight: `${UI_CONFIG.MIN_TOUCH_TARGET + 16}px`,
};

const backButtonStyle: React.CSSProperties = {
	minWidth: `${UI_CONFIG.MIN_TOUCH_TARGET * 2}px`,
	minHeight: `${UI_CONFIG.MIN_TOUCH_TARGET}px`,
	fontSize: "18px",
	fontWeight: "600",
	color: COLORS.highlight,
	background: "none",
	border: "none",
	cursor: "pointer",
	textAlign: "left",
	padding: "8px 0",
	transition: "opacity 0.2s",
};

const titleStyle: React.CSSProperties = {
	fontSize: "24px",
	fontWeight: "700",
	color: "#333333",
	textAlign: "center",
	margin: 0,
};

const scrollContainerStyle: React.CSSProperties = {
	flex: 1,
	overflowY: "auto",
	padding: "16px",
};

const gridStyle: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
	gap: "16px",
	justifyContent: "center",
	maxWidth: "1200px",
	margin: "0 auto",
};

const getCardStyle = (isPressed: boolean): React.CSSProperties => ({
	width: "100px",
	height: "100px",
	minWidth: `${UI_CONFIG.MIN_TOUCH_TARGET * 2}px`,
	minHeight: `${UI_CONFIG.MIN_TOUCH_TARGET * 2}px`,
	backgroundColor: COLORS.background,
	borderRadius: "16px",
	padding: "8px",
	cursor: "pointer",
	border: `2px solid ${COLORS.outlineBorder}`,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
	transform: isPressed ? "scale(0.95)" : "translateY(0)",
	boxShadow: isPressed
		? "0 2px 4px rgba(0, 0, 0, 0.1)"
		: "0 4px 8px rgba(0, 0, 0, 0.1)",
	outline: "none",
});

interface CharacterPreviewProps {
	template: CharacterTemplate;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ template }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const size = 80;
		const padding = 5;
		canvas.width = size;
		canvas.height = size;

		ctx.clearRect(0, 0, size, size);

		const scaleX = (size - padding * 2) / template.bounds.width;
		const scaleY = (size - padding * 2) / template.bounds.height;
		const scale = Math.min(scaleX, scaleY, 1);

		const offsetX = (size - template.bounds.width * scale) / 2;
		const offsetY = (size - template.bounds.height * scale) / 2;

		template.strokes.forEach((stroke) => {
			ctx.save();
			ctx.strokeStyle = COLORS.highlight;
			ctx.lineWidth = 2;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.setLineDash([4, 4]);

			renderSVGPath(ctx, stroke.path, {
				strokeColor: COLORS.highlight,
				strokeWidth: 2,
				scale,
				offsetX,
				offsetY,
			});

			ctx.restore();
		});
	}, [template]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				width: "64px",
				height: "64px",
				display: "block",
				pointerEvents: "none",
			}}
		/>
	);
};

export const CharacterGrid: React.FC<CharacterGridProps> = ({
	category,
	characters,
	onSelectCharacter,
	onBack,
}) => {
	const [pressedCharacter, setPressedCharacter] = React.useState<string | null>(
		null,
	);

	const handleCharacterSelect = (character: CharacterTemplate) => {
		onSelectCharacter(character);
	};

	const handlePointerDown = (char: string) => {
		setPressedCharacter(char);
	};

	const handlePointerUp = () => {
		setPressedCharacter(null);
	};

	const handlePointerLeave = () => {
		setPressedCharacter(null);
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLButtonElement>,
		character: CharacterTemplate,
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleCharacterSelect(character);
		}
	};

	return (
		<div style={containerStyle}>
			<header style={headerStyle}>
				<h2 className="visually-hidden">{getCategoryDisplayName(category)}</h2>
				<button
					type="button"
					style={backButtonStyle}
					onClick={onBack}
					aria-label="Go back to category selection"
				>
					← Back
				</button>
				<h1 style={titleStyle}>{getCategoryDisplayName(category)}</h1>
				<div style={{ minWidth: `${UI_CONFIG.MIN_TOUCH_TARGET * 2}px` }} />
			</header>

			<div style={scrollContainerStyle}>
				<ul
					style={gridStyle as React.CSSProperties}
					aria-label={`${getCategoryDisplayName(category)} grid`}
				>
					{characters.map((character) => {
						const isPressed = pressedCharacter === character.character;

						return (
							<li key={character.character}>
								<button
									type="button"
									style={getCardStyle(isPressed)}
									onClick={() => handleCharacterSelect(character)}
									onPointerDown={() => handlePointerDown(character.character)}
									onPointerUp={handlePointerUp}
									onPointerLeave={handlePointerLeave}
									onKeyDown={(e) => handleKeyDown(e, character)}
									aria-label={`Select ${character.displayName || character.character}`}
								>
									<CharacterPreview template={character} />
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};
