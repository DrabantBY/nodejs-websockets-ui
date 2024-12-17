import type { Ship } from '../types/game.ts';

const SHIPS: Ship[][] = [
	[
		{ position: { x: 5, y: 6 }, direction: false, type: 'huge', length: 4 },
		{ position: { x: 0, y: 6 }, direction: false, type: 'large', length: 3 },
		{ position: { x: 0, y: 8 }, direction: false, type: 'large', length: 3 },
		{ position: { x: 0, y: 3 }, direction: false, type: 'medium', length: 2 },
		{ position: { x: 5, y: 1 }, direction: false, type: 'medium', length: 2 },
		{ position: { x: 7, y: 8 }, direction: false, type: 'medium', length: 2 },
		{ position: { x: 3, y: 2 }, direction: false, type: 'small', length: 1 },
		{ position: { x: 5, y: 3 }, direction: true, type: 'small', length: 1 },
		{ position: { x: 5, y: 8 }, direction: true, type: 'small', length: 1 },
		{ position: { x: 0, y: 1 }, direction: false, type: 'small', length: 1 },
	],
	[
		{ position: { x: 2, y: 0 }, direction: false, type: 'huge', length: 4 },
		{ position: { x: 5, y: 4 }, direction: false, type: 'large', length: 3 },
		{ position: { x: 6, y: 6 }, direction: true, type: 'large', length: 3 },
		{ position: { x: 2, y: 7 }, direction: false, type: 'medium', length: 2 },
		{ position: { x: 8, y: 6 }, direction: false, type: 'medium', length: 2 },
		{ position: { x: 1, y: 2 }, direction: true, type: 'medium', length: 2 },
		{ position: { x: 0, y: 8 }, direction: false, type: 'small', length: 1 },
		{ position: { x: 8, y: 2 }, direction: false, type: 'small', length: 1 },
		{ position: { x: 0, y: 0 }, direction: true, type: 'small', length: 1 },
		{ position: { x: 2, y: 5 }, direction: true, type: 'small', length: 1 },
	],
];

export default SHIPS;
