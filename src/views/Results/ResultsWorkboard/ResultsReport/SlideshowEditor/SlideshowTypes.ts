export interface SlideshowSectionData {
	id: string;
	title: string;
	hidden?: boolean;
	mandatory?: boolean;
	open?: boolean;
}

export interface SlideshowSlideData {
	id: string;
	title: string;
	html: string;
	hidden?: boolean;
}
