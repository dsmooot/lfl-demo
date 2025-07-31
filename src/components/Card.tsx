import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

gsap.registerPlugin(useGSAP);

interface CardProps {
	position: [number, number, number];
	cardIndex: number;
	backColor: string;
	frontImage: string;
	title: string;
	description: string;
	resetFlip?: number;
	onPositionChange: (
		index: number,
		newPosition: [number, number, number]
	) => void;
}

export default function Card({
	position,
	cardIndex,
	backColor,
	frontImage,
	title,
	description,
	resetFlip,
	onPositionChange,
}: CardProps) {
	const meshRef = useRef<THREE.Mesh>(null!);
	const [isFlipped, setIsFlipped] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [hovered, setHovered] = useState(false);
	const { size, viewport } = useThree();

	useGSAP(
		() => {
			if (meshRef.current) {
				gsap.set(meshRef.current.scale, {
					x: 0.8,
					y: 0.8,
					z: 0.8,
				});
			}
		},
		{ scope: meshRef }
	);

	// Store initial position
	const initialPosition = useRef(position);

	useEffect(() => {
		initialPosition.current = position;
	}, [position]);

	// Reset flip state when resetFlip prop changes
	useGSAP(
		() => {
			if (resetFlip !== undefined) {
				setIsFlipped(false);
				// Also reset the mesh rotation to front-facing
				if (meshRef.current) {
					gsap.set(meshRef.current.rotation, { y: 0 });
				}
			}
		},
		{ dependencies: [resetFlip], scope: meshRef }
	);

	// Hover animation
	useGSAP(
		() => {
			if (meshRef.current) {
				gsap.to(meshRef.current.scale, {
					duration: 0.3,
					x: hovered ? 1.05 : 1,
					y: hovered ? 1.05 : 1,
					z: hovered ? 1.05 : 1,
					ease: "power2.out",
				});
			}
		},
		{ dependencies: [hovered], scope: meshRef }
	);

	// Flip animation
	const handleFlip = () => {
		if (isDragging) return;

		const flipCard = () => {
			setIsFlipped(!isFlipped);
			if (meshRef.current) {
				gsap.to(meshRef.current.rotation, {
					duration: 0.6,
					y: isFlipped ? 0 : Math.PI,
					ease: "power2.inOut",
				});
			}
		};

		flipCard();
	};

	// Drag gesture
	const bind = useDrag(
		({
			active,
			movement: [x, y],
			memo = meshRef.current.position.clone(),
		}) => {
			setIsDragging(active);

			if (meshRef.current) {
				if (active) {
					// Convert screen coordinates to world coordinates with responsive scaling
					const baseZoom = 40;
					const minDimension = Math.min(size.width, size.height);

					// Calculate responsive zoom factor to match ResponsiveCamera
					let zoomFactor = 1;
					if (minDimension < 500) {
						zoomFactor = 0.4;
					} else if (minDimension < 800) {
						zoomFactor = 0.55;
					}

					const effectiveZoom = baseZoom * zoomFactor;
					const factor =
						(viewport.width / size.width) * (40 / effectiveZoom);

					meshRef.current.position.x = memo.x + x * factor;
					meshRef.current.position.y = memo.y - y * factor;
					meshRef.current.position.z = 1.0;
				} else {
					// Snap back to grid or update position
					const newPos: [number, number, number] = [
						meshRef.current.position.x,
						meshRef.current.position.y,
						0,
					];
					onPositionChange(cardIndex, newPos);

					// Animate back to grid position or new position
					gsap.to(meshRef.current.position, {
						duration: 0.2,
						x: position[0],
						y: position[1],
						z: position[2],
						ease: "power2.out",
					});
				}
			}

			return memo;
		},
		{ filterTaps: true }
	);

	// Update position when props change
	useEffect(() => {
		if (meshRef.current && !isDragging) {
			gsap.to(meshRef.current.position, {
				duration: 0.2,
				x: position[0],
				y: position[1],
				z: position[2],
				ease: "power2.out",
			});
		}
	}, [position, isDragging]);

	return (
		<mesh
			ref={meshRef}
			position={position}
			onClick={handleFlip}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
			{...bind()}
		>
			{/* Invisible interaction mesh */}
			<boxGeometry args={[4, 6, 0.1]} />
			<meshBasicMaterial transparent opacity={0} />

			{/* Front face card */}
			{!isFlipped && (
				<Html
					position={[0, 0, 0.01]}
					transform
					center
					className="w-[180px] h-[240px] pointer-events-none select-none touch-none"
					style={{
						WebkitUserSelect: "none",
						MozUserSelect: "none",
						msUserSelect: "none",
					}}
					zIndexRange={isDragging ? [1000, 1000] : [-1000, -1000]}
				>
					<div
						className={`
							w-[180px] h-[240px] flex flex-col justify-center items-center 
							p-4 text-white text-center bg-cover bg-center rounded-xl overflow-hidden
							font-sans box-border pointer-events-none select-none relative
							
						`}
						style={{
							backgroundImage: `url(${frontImage})`,
						}}
					>
						<div className="absolute inset-0 bg-black/40 z-[1]" />
						<div className="relative z-[2] flex flex-col items-center">
							<h3 className="mb-3 text-white text-lg font-semibold drop-shadow-lg leading-tight">
								{title}
							</h3>
							<p className="text-white text-sm leading-relaxed drop-shadow-md opacity-95">
								{description}
							</p>
						</div>
					</div>
				</Html>
			)}

			{/* Back face card */}
			{isFlipped && (
				<Html
					position={[0, 0, -0.01]}
					transform
					center
					className="w-[180px] h-[240px] pointer-events-none select-none touch-none"
					style={{
						transform: "rotateY(180deg)",
						WebkitUserSelect: "none",
						MozUserSelect: "none",
						msUserSelect: "none",
					}}
					zIndexRange={isDragging ? [1000, 1000] : [-1000, -1000]}
				>
					<div
						className={`
							w-[180px] h-[240px] flex flex-col justify-center items-center 
							p-4 text-white text-center rounded-xl overflow-hidden font-sans box-border 
							pointer-events-none select-none
							
						`}
						style={{
							background: backColor,
						}}
					>
						<h3 className="mb-3 text-white text-lg font-semibold drop-shadow-lg leading-tight">
							{title}
						</h3>
						<p className="text-white text-sm leading-relaxed drop-shadow-md opacity-95">
							Back of Card
						</p>
					</div>
				</Html>
			)}
		</mesh>
	);
}
