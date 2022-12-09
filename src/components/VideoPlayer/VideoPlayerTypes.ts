export interface WavesurferRegionOptions {
	id: string;
	start: number;
	end: number;
	loop: boolean;
	drag: boolean;
	resize: boolean;
	color?: string;
}

export interface WavesurferRegion {
	wavesurfer: WaveSurfer;
	wrapper: Element;
	id: string;
	start: number;
	end: number;
	resize: boolean;
	drag: boolean;
	isResizing: boolean;
	isDragging: boolean;
	loop: boolean;
	color: string;
	scroll: boolean;
	scrollSpeed: number;
	scrollThreshold: number;
	preventContextMenu: boolean;
	firedIn: boolean;
	firedOut: boolean;
	element: Element;
	isRegion: boolean;
	isMarker: boolean;
	data: {
		group: string;
	};

	on(event: string, callback: (ev: Event) => any): void;
	un(event: string, callback: (ev: Event) => any): void;
	unAll(): void;
	once(event: string, callback: (ev: Event) => any): void;
	fireEvent(event: string): void;
	update(params: WavesurferRegionOptions): void;
	remove(): void;
	play(start: number): void;
	playLoop(start: number): void;
	render(): void;
	formatTime(start: number, end: number): void;
	getWidth(): number;
	updateRender(): void;
	onDrag(delta: number): void;
	onResize(delta: number, direction: string): void;
}
export interface VideoCut {
	id: string;
	start: number;
	end: number;
}

export interface VideoMarker {
	id: string;
	timeStamp: number;
}

export function isVideoCut(data: any): boolean {
	return (
		data.hasOwnProperty('start') &&
		typeof data.start === 'number' &&
		data.hasOwnProperty('end') &&
		typeof data.end === 'number'
	);
}
