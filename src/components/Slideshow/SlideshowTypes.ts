export interface Slide {
	html: string;
}

export interface SlideLegacy {
	type: string;
	title: string;
	body?: any;
	metadata: {
		devices?: any;
	};
	html: string;
	slide_data: any;
	elements: any[];
}
