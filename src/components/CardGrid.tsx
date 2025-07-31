import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useState, useEffect } from "react";
import Card from "./Card";
import { cardData } from "../assets/cardData";

interface CardData {
	id: number;
	position: [number, number, number];
	backColor: string;
	frontImage: string;
	title: string;
	description: string;
}

// Responsive camera component
function ResponsiveCamera() {
	const { camera, size } = useThree();

	useEffect(() => {
		if (camera) {
			// Calculate responsive zoom based on screen size
			const baseZoom = 40;
			const minDimension = Math.min(size.width, size.height);

			// Adjust zoom based on screen size and aspect ratio
			let responsiveZoom = baseZoom;

			if (minDimension < 500) {
				// Mobile
				responsiveZoom = baseZoom * 0.5;
			} else if (minDimension < 800) {
				// Tablets
				responsiveZoom = baseZoom * 0.55;
			}

			camera.zoom = responsiveZoom;
			camera.updateProjectionMatrix();
		}
	}, [camera, size]);

	return null;
}

export default function CardGrid() {
	const [resetFlipTrigger, setResetFlipTrigger] = useState(0);

	const getGridDimensions = () => {
		const isMobile = window.innerWidth < 500;
		const isTablet = window.innerWidth < 800;

		if (isMobile || isTablet) {
			return { rows: 5, cols: 2 }; // 5x2 for mobile/tablet
		}
		return { rows: 2, cols: 5 }; // 2x5 for desktop
	};

	// Initialize card positions with responsive grid
	const [cards, setCards] = useState<CardData[]>(() => {
		const initialCards: CardData[] = [];
		let cardId = 0;
		const spacing = { horizontal: 5, vertical: 7 };
		const { rows, cols } = getGridDimensions();

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const dataIndex = cardId % cardData.length;
				const card = cardData[dataIndex];
				initialCards.push({
					id: cardId,
					position: [
						(col - (cols - 1) / 2) * spacing.horizontal, // Center horizontally
						((rows - 1) / 2 - row) * spacing.vertical, // Center vertically
						0,
					],
					backColor: card.colors.back,
					frontImage: card.image,
					title: card.title,
					description: card.description,
				});
				cardId++;
			}
		}

		return initialCards;
	});

	// Update card positions on window resize
	useEffect(() => {
		const handleResize = () => {
			const spacing = { horizontal: 5, vertical: 7 };
			const { rows, cols } = getGridDimensions();

			setCards((prevCards) => {
				return prevCards.map((card, index) => {
					const row = Math.floor(index / cols);
					const col = index % cols;
					return {
						...card,
						position: [
							(col - (cols - 1) / 2) * spacing.horizontal,
							((rows - 1) / 2 - row) * spacing.vertical,
							0,
						],
					};
				});
			});
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleCardPositionChange = (
		cardIndex: number,
		newPosition: [number, number, number]
	) => {
		setCards((prevCards) => {
			const newCards = [...prevCards];

			// Find the card being moved
			const draggedCard = newCards[cardIndex];

			// find the closest grid position
			let closestIndex = 0;
			let minDistance = Infinity;

			newCards.forEach((card, index) => {
				if (index === cardIndex) return;

				const distance = Math.sqrt(
					Math.pow(newPosition[0] - card.position[0], 2) +
						Math.pow(newPosition[1] - card.position[1], 2)
				);

				if (distance < minDistance) {
					minDistance = distance;
					closestIndex = index;
				}
			});

			// If close enough to another card, swap positions
			if (minDistance < 2.0) {
				// Slightly increased threshold for mobile
				const targetCard = newCards[closestIndex];
				const tempPosition = targetCard.position;

				newCards[closestIndex] = {
					...targetCard,
					position: draggedCard.position,
				};

				newCards[cardIndex] = {
					...draggedCard,
					position: tempPosition,
				};
			}

			return newCards;
		});
	};

	// Reset cards to original positions and flip states
	const resetCards = () => {
		const spacing = { horizontal: 5, vertical: 7 };
		const { rows, cols } = getGridDimensions();

		setCards((prevCards) => {
			return prevCards.map((card, index) => {
				const row = Math.floor(index / cols);
				const col = index % cols;
				return {
					...card,
					position: [
						(col - (cols - 1) / 2) * spacing.horizontal,
						((rows - 1) / 2 - row) * spacing.vertical,
						0,
					],
				};
			});
		});

		// Trigger flip state reset for all cards
		setResetFlipTrigger((prev) => prev + 1);
	};

	return (
		<div className="w-screen h-screen relative">
			<header className="fixed top-0 left-0 right-0 h-32 z-[2000] ">
				<div className="flex justify-center items-center h-full">
					<h1 className="text-white text-3xl font-bold font-sans">
						Left Field Labs Demo
					</h1>
				</div>
			</header>

			<Canvas
				orthographic
				camera={{
					position: [0, 0, 10],
					zoom: 80,
					near: 0.1,
					far: 1000,
				}}
				className="w-full h-full"
			>
				<ResponsiveCamera />

				<Environment preset="studio" />

				{cards.map((card, index) => (
					<Card
						key={card.id}
						position={card.position}
						cardIndex={index}
						backColor={card.backColor}
						frontImage={card.frontImage}
						title={card.title}
						description={card.description}
						resetFlip={resetFlipTrigger}
						onPositionChange={handleCardPositionChange}
					/>
				))}
			</Canvas>

			<footer className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-100">
				<button
					onClick={resetCards}
					className="w-32 p-16  text-white border border-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-slate-200 hover:text-black  font-sans"
				>
					Reset Cards
				</button>
			</footer>
		</div>
	);
}
