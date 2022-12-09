export interface Word {
	start_time: number;
	end_time: number;
	word: string;
}

export interface SttData {
	text: string;
	words: Word[];
	acceptable?: boolean;
}
