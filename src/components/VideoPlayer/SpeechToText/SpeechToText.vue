<template>
	<div>
		<div class="segment compact">
			<div ref="stt" id="speech-to-text" v-if="!noWords">
				<span id="before-reader">{{ textStart }}</span>
				<span ref="reader" id="reader">{{ readText }}</span>
				<span id="after-reader">{{ textEnd }}</span>

				<tooltip ref="tooltip" id="stt-tooltip" :intrusive="false">
					<button class="button rounded" @click="createNewManualCut">
						<icon class="icon cut" />
					</button>
				</tooltip>
			</div>
			<span v-else>{{ fullText }}</span>
		</div>
		<div id="acceptable-stt" class="segment compact options" v-if="!noWords">
			{{ $t('Texte acceptable ?') }}
			<button
				:class="`button small ${acceptableStt === true ? 'green' : 'ghost grey' }`"
				@click="handleAcceptableStt(true)"
			>
				{{ $t('Oui') }}
			</button>
			<button
				:class="`button small ${acceptableStt === false ? 'red' : 'ghost grey' }`"
				@click="handleAcceptableStt(false)"
			>
				{{ $t('Non') }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { acceptableSttUrl } from '@/components/VideoPlayer/SpeechToText/SpeechToTextConfig';
import { Word } from '@/components/VideoPlayer/SpeechToText/SpeechToTextTypes';
import { VideoCut } from '@/components/VideoPlayer/VideoPlayerTypes';
import AxiosUtils from '@/services/AxiosUtils';
import ComponentsUtils from '@/services/ComponentsUtils';
import Js from '@/services/JsService';
import Axios, { AxiosResponse } from 'axios';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
	},
})
export default class SpeechToText extends Vue {
	@Prop({ default: 0 }) public readonly currentTime!: number;
	@Prop() public readonly fullText!: string;
	@Prop() public readonly words!: Word[];
	@Prop({ default: true }) public readonly ttsActive!: boolean;
	@Prop() public readonly acceptable?: boolean;

	@Ref() protected readonly stt!: Element;
	@Ref() protected readonly tooltip!: Tooltip;

	protected textStart: string = '';
	protected textEnd: string = '';
	protected readText: string = '';

	private readStart: number = 0;
	private readEnd: number = 0;
	private wordsIndexes: number[] = [];
	private noWords: boolean = false;
	private acceptableStt: boolean | 0 = 0;
	private timeStartExtract: number = 0;
	private timeEndExtract: number = 0;

	public resetReader(start: number): void {
		if (this.noWords) return;
		this.readStart = Math.max(0, this.firstWordAfter(start) - 1);
		this.updateReaderEnd();
		this.spliceReadWords();
	}

	@Watch('currentTime', { immediate: true })
	protected onCurrentTimeChange(val: number): void {
		if (!this.wordsIndexes.length) {
			if (this.fullText) {
				if (this.words) this.initSpeechToText();
				else this.noWords = true;
			}
			return;
		}

		if (val >= this.words[this.readEnd].start_time) {
			this.readStart = this.readEnd;
			this.updateReaderEnd();
			this.spliceReadWords();
		}
	}

	protected selectionHandler(event: MouseEvent): void {
		if (this.tooltip) this.tooltip.hide();

		const target: HTMLElement = event.target as HTMLElement;
		if (
			(target.parentElement !== this.stt && target !== this.stt) ||
			!this.ttsActive ||
			this.noWords
		)
			return;

		const selection: Selection | null = window.getSelection();
		if (!selection || !selection.anchorNode || selection.isCollapsed)
			return;

		/**
		 * If only one word is selected on the text (double click), textToSpeech is called.
		 * Otherwise, if more than 1 word is selected, it will display the tooltip button
		 */
		if (selection.toString().trim().split(' ').length === 1)
			this.textToSpeech(selection);
		else if (selection.type === 'Range')
			this.selectSttExtract(event, selection);
	}

	private updated(): void {
		if (!this.noWords) {
			const reader: Element = this.$refs['reader'] as Element;

			reader.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'nearest',
			});
		}
	}

	private textToSpeech(selection: Selection): void {
		let offset: number = 0;

		if (
			!selection ||
			!selection.anchorNode ||
			!selection.anchorNode.parentElement ||
			selection.isCollapsed
		)
			return;
		const id: string = selection.anchorNode.parentElement.id;
		if (id === 'reader') offset = this.textStart.length;
		else if (id === 'after-reader')
			offset = this.textStart.length + this.readText.length;
		this.$emit(
			'seek',
			this.timeFromChar(offset + selection.anchorOffset, true)
		);
		selection.removeAllRanges();
	}

	private selectSttExtract(event: MouseEvent, selection: Selection): void {
		let startOffset: number = 0;
		let endOffset: number = 0;

		if (
			!selection ||
			!selection.anchorNode ||
			!selection.anchorNode.parentElement ||
			!selection.focusNode ||
			!selection.focusNode.parentElement ||
			selection.isCollapsed
		)
			return;

		const idStart: string = selection.anchorNode.parentElement.id;
		if (idStart === 'reader') startOffset = this.textStart.length;
		else if (idStart === 'after-reader')
			startOffset = this.textStart.length + this.readText.length;

		const idEnd: string = selection.focusNode.parentElement.id;
		if (idEnd === 'reader') endOffset = this.textStart.length;
		else if (idEnd === 'after-reader')
			endOffset = this.textStart.length + this.readText.length;

		const startSelect: number = this.timeFromChar(
			startOffset + selection.anchorOffset,
			true
		);
		const endSelect: number = this.timeFromChar(
			endOffset + selection.focusOffset,
			false
		);

		if (startSelect > endSelect) {
			this.timeStartExtract = endSelect;
			this.timeEndExtract = startSelect;
		} else {
			this.timeStartExtract = startSelect;
			this.timeEndExtract = endSelect;
		}

		this.tooltip.show();
		this.tooltip.$el.setAttribute(
			'style',
			`top: ${event.y - this.stt.getBoundingClientRect().top - 50}px;
			left: ${
				selection.anchorOffset > selection.focusOffset
					? event.x - this.stt.getBoundingClientRect().left
					: event.x - this.stt.getBoundingClientRect().left - 30
			}px;`
		);
	}

	private createNewManualCut(): void {
		if (!this.timeStartExtract && !this.timeEndExtract) return;

		this.$emit('selection:created', {
			id: 'selected-extract',
			start: this.timeStartExtract,
			end: this.timeEndExtract,
		} as VideoCut);
	}

	private firstWordAfter(timeStamp: number, index?: number): number {
		if (!this.words) return -1;
		for (let i: number = index ? index : 0; i < this.words.length; i++) {
			const word: Word = this.words[i];

			if (word.start_time > timeStamp) return i;
		}
		return this.words.length - 1;
	}

	private timeFromChar(index: number, start: boolean): number {
		if (this.words[Js.nbWordsBefore(index, this.fullText) + 1])
			return start
				? this.words[Js.nbWordsBefore(index, this.fullText) + 1]
						.start_time
				: this.words[Js.nbWordsBefore(index, this.fullText) + 1]
						.end_time;
		else
			return start
				? this.words[Js.nbWordsBefore(index, this.fullText)].start_time
				: this.words[Js.nbWordsBefore(index, this.fullText)].end_time;
	}

	private spliceReadWords(): void {
		this.textStart = this.fullText.substring(
			0,
			this.wordsIndexes[this.readStart]
		);
		if (this.readStart !== this.readEnd) {
			this.readText = this.fullText.substring(
				this.wordsIndexes[this.readStart],
				this.wordsIndexes[this.readEnd] - 1
			);
			this.textEnd = this.fullText.substring(
				this.wordsIndexes[this.readEnd] - 1
			);
		} else {
			this.readText = this.fullText.substring(
				this.wordsIndexes[this.readEnd]
			);
			this.textEnd = '';
		}
	}

	private initSpeechToText(): void {
		this.wordsIndexes = Js.wordsIndexes(this.fullText);
		this.resetReader(this.currentTime);
	}

	private updateReaderEnd(): void {
		if (!this.words[this.readStart]) return;

		this.readEnd = this.firstWordAfter(
			this.words[this.readStart].start_time +
				ComponentsUtils.defaultSttWordDelay,
			this.readStart
		);
	}

	private handleAcceptableStt(acceptable: boolean): void {
		Axios.post(
			`${acceptableSttUrl}`,
			{
				acceptable,
				affectationId: Number.parseInt(
					this.$route.params.affectation_id
				),
			},
			AxiosUtils.defaultConfig
		)
			.then((response?: AxiosResponse<boolean>): void => {
				if (!response?.data) return;

				this.acceptableStt = acceptable;
			})
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`SpeechToText: Cannot post on ${acceptableSttUrl}`,
					error
				);
			});
	}

	private mounted(): void {
		if (this.acceptable !== undefined) this.acceptableStt = this.acceptable;

		document.addEventListener('mouseup', this.selectionHandler);
	}

	private destroyed(): void {
		document.removeEventListener('mouseup', this.selectionHandler);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#speech-to-text {
	max-height: 30vh;
	overflow-y: auto;
	white-space: pre-wrap;

	#reader {
		background: scale-color($yellow, $lightness: 55%);
		box-shadow: 0 3px $primary-color;
	}
}

#stt-tooltip {
	background: none;

	&:after {
		display: none;
	}

	button {
		padding: math.div($padding, 3);
		border: 5px solid $white;
		box-shadow: 0 math.div($padding, 3) math.div($padding, 2) rgba(0,0,0, 0.25), 0 math.div($padding, 3) math.div($padding, 2) rgba(0,0,0, 0.25);

		&::after {
			color: $white;
			content: "";
			position: absolute;
			display: block;
			border-top: solid 10px;
			border-left: solid 10px transparent;
			border-right: solid 10px transparent;
			transform: translateY(110%);
			bottom: 10px;
		}

		.icon {
			margin: 0px;
		}
	}
}

#acceptable-stt {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	font-size: .8rem;
	color: scale-color($secondary-color, $lightness: -40%);

	button:first-of-type {
		margin-left: math.div($padding, 2);
	}
}
</style>
