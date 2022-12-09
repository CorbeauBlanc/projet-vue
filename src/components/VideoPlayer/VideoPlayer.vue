<template lang="pug">
	.video-player
		.media-container
			.overlay(
				@click="togglePlaying",
				@keydown.prevent,
				@keyup.prevent="onKeyUp",
				tabindex="0"
			)
			video(
				ref="videoPlayer",
				@loadedmetadata="initPlayer",
				@timeupdate="updateCurrentTime(true)",
				@play="play",
				@pause="pause"
			)
				source(:src="src", :type="type")
		div(:class="`player-controls ${regionsActive ? 'regions-active' : ''}`")
			.control-panel.left
				button.button.icon.control(@click="togglePlaying")
					i(:class="`icon ${isPlaying ? 'pause solid' : 'play'}`")
				button.button.icon.control(@click="rewind")
					icon(replay, five)
				#volume-controls(
					@mouseenter="showVolumeSlider = true",
					@mouseleave="showVolumeSlider = false"
				)
					button.button.icon.control(@click="toggleMuted")
						i(:class="`icon volume ${muted ? 'off' : ''}`")
					range-input(
						class="inverted",
						:config="volumeConfig",
						@change="changeVolume()",
						v-model="volumeInput",
						v-show="showVolumeSlider"
					)
				.cuts-button(v-if="allowedVideoEdit")
					button(
						:class="`button icon control ${regionsActive ? 'active' : ''}`",
						@click="toggleRegions"
					)
						icon(cut)
			.control-panel.center(:class="{ invisible: !waveReady }")
				span.time-tracker
					| {{ currentTimeLabel }}
				.wavesurfer(
					ref="wavesurfer",
					@keydown.prevent,
					@keyup.prevent="onKeyUp",
					tabindex="0"
				)
				span.time-tracker
					| {{ durationLabel }}
			.control-panel.right
				#stt-button(v-if="allowedStt")
					button(
						:class="`button icon control ${showStt ? 'active' : ''}`",
						@click="handleSttControl"
					)
						icon(speech, to, text)
				#speed-controls
					button.button.icon.control(@click="showSpeedMenu = !showSpeedMenu")
						icon(playing, speed)
					#menu(v-show="showSpeedMenu")
						button(
							v-for="i in [1, 1.25, 1.5, 1.75, 2]",
							:class="`button flat white ${i === playbackRate ? 'active' : ''}`",
							:key="i",
							@click="setPlaybackRate(i)"
						)
							| x{{ i }}
				.button.icon.control(@click="downloadSrc")
					icon(download)
			.control-panel.regions-container
				.horizontal-separator
				.cut-timeline
					span.badge.small
						| {{ $t('Extraits analysés') }}
					.separator
		speech-to-text(
			v-if="showStt && allowedStt",
			ref="stt",
			:acceptable="stt ? stt.acceptable : undefined",
			:current-time="reactivePlayerTime",
			:full-text="stt ? stt.text : undefined",
			:words="stt ? stt.words : undefined",
			:ttsActive="regionsActive",
			@seek="seekTo"
			@selection:created="$emit('cut:created', $event)"
		)
</template>

<script lang="ts">
import { InputConfig } from '@/components/Inputs/InputsTypes';
import RangeInput from '@/components/Inputs/RangeInput.vue';
import SpeechToText from '@/components/VideoPlayer/SpeechToText/SpeechToText.vue';
import { SttData } from '@/components/VideoPlayer/SpeechToText/SpeechToTextTypes';
import {
	VideoCut,
	VideoMarker,
	WavesurferRegion,
} from '@/components/VideoPlayer/VideoPlayerTypes';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import UserUtils from '@/services/UserUtils';
import _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Wavesurfer from 'wavesurfer.js';
import WavesurferCursor from 'wavesurfer.js/dist/plugin/wavesurfer.cursor';
import WavesurferRegions from 'wavesurfer.js/dist/plugin/wavesurfer.regions';

@Component({
	components: {
		RangeInput,
		SpeechToText,
	},
})
export default class VideoPlayer extends Vue {
	public get playing(): boolean {
		return this.isPlaying;
	}

	public get speed(): number {
		return this.playbackRate;
	}

	public get currentTime(): number {
		return this.player.currentTime;
	}

	public get volume(): number {
		return Number.parseFloat(this.volumeInput);
	}

	public set volume(v: number) {
		v = _.clamp(v, 0, 1);
		this.volumeInput = v.toString();
		this.player.volume = v;
	}

	public get fullscreen(): boolean {
		return this.fullscreenActive;
	}

	public increaseVolume(): void {
		this.volume += 0.1;
		this.changeVolume();
	}

	public decreaseVolume(): void {
		this.volume -= 0.1;
		this.changeVolume();
	}

	public changeVolume(): void {
		this.player.volume = this.volume;

		if (this.volume === 0) {
			this.muted = true;
		} else {
			this.muted = false;
		}
	}

	@Prop() public readonly src!: string;
	@Prop({ default: 'video/mp4' }) public readonly type!: string;
	@Prop() public readonly cuts!: VideoCut[];
	@Prop() public readonly markers!: VideoMarker[];
	@Prop() public readonly stt!: SttData;

	protected waveReady: boolean = false;
	protected regionsActive: boolean = false;
	protected durationLabel: string = '00:00';
	protected currentTimeLabel: string = '00:00';
	protected volumeConfig: InputConfig = {
		constraints: {
			min: 0,
			max: 1,
			step: 0.01,
		},
	};
	protected volumeInput: string = '1';
	protected showVolumeSlider: boolean = false;
	protected muted: boolean = false;
	protected playbackRate: number = 1;
	protected showSpeedMenu: boolean = false;
	protected player!: HTMLMediaElement;
	protected reactivePlayerTime: number = 0;
	protected showStt: boolean = false;
	private fullscreenActive: boolean = false;

	private allowedStt: boolean = false;
	private allowedVideoEdit: boolean = false;

	private isPlaying: boolean = false;
	private previousSecond: number = 0;
	private wave!: Wavesurfer;
	private waveElements!: {
		canvas: HTMLElement;
		cursor: HTMLElement;
		playhead: HTMLElement;
		ref: HTMLElement;
		wave: HTMLElement;
	};
	private waveColor: string = 'rgba(200, 200, 200, .2)';
	private wsRegions: Map<string, WavesurferRegion> = new Map();
	private wsRegionsBuffer: Map<string, VideoCut> = new Map();
	private wsMarkers: Map<string, WavesurferRegion> = new Map();
	private registerNextRegion: boolean | 'ignore' = false;
	private createdRegionsAfterReset: number = -1;
	private keyboardEvents!: Map<string, { callback: (...args: any) => void }>;
	private newRegionMarker: WavesurferRegion | undefined;
	private resizeObs!: ResizeObserver;
	private readonly MIN_WIDTH: number = 500;

	private debounceTogglePlaying: (isPlaying: boolean) => void = _.debounce(
		(isPlaying: boolean): void => {
			if (isPlaying) this.play();
			else this.pause();
		},
		Js.defaultDebounceDelay
	);

	public startNewRegion(): void {
		this.regionsActive = true;
		if (!this.newRegionMarker) {
			const icon: Element = document.createElement('i');
			icon.className = 'icon carret up';
			this.registerNextRegion = 'ignore';
			this.newRegionMarker = this.wsAddRegion(
				'newRegion',
				this.reactivePlayerTime,
				this.reactivePlayerTime + 0.05,
				false,
				undefined,
				false
			);
			this.newRegionMarker.element.className = 'wavesurfer-newregion';
			this.newRegionMarker.element.appendChild(icon);
		}
	}

	public endNewRegion(): void {
		this.regionsActive = true;
		if (this.newRegionMarker) {
			this.registerNextRegion = true;
			this.wsAddRegion(
				undefined,
				this.newRegionMarker.start,
				this.reactivePlayerTime
			);

			this.newRegionMarker.remove();
			this.newRegionMarker = undefined;
		}
	}

	public addKeyboardShortcut(
		key: string,
		callback: (...args: any) => void,
		modifiers?: {
			alt?: boolean;
			ctrl?: boolean;
			meta?: boolean;
			shift?: boolean;
		}
	): void {
		if (modifiers)
			key = `${modifiers.alt ? 'Alt' : ''}${
				modifiers.ctrl ? 'Ctrl' : ''
			}${modifiers.meta ? 'Meta' : ''}${
				modifiers.shift ? 'Shift' : ''
			}${key}`;
		this.keyboardEvents.set(key, { callback });
	}

	public addNewRegion(
		start: number,
		end: number,
		id: string,
		drag?: boolean,
		resize?: boolean
	): void {
		this.registerNextRegion = true;
		const region: WavesurferRegion = this.wsAddRegion(
			id,
			start,
			end,
			undefined,
			drag,
			resize
		);
	}

	public addNewMarker(time: number, id?: string): void {
		this.registerNextRegion = 'ignore';
		const region: WavesurferRegion = this.wsAddRegion(
			id,
			time,
			time + 0.05,
			false,
			false,
			false
		);
		region.element.className = 'wavesurfer-marker';
		this.registerNewMarker(region);
	}

	public playRegion(id: string): void {
		const region: WavesurferRegion | undefined = this.wsRegions.get(id);
		if (!region) return;
		this.seekTo(region.start);
		this.play();
		this.isPlaying = true;
	}

	public playFromMarker(id: string): void {
		const marker: WavesurferRegion | undefined = this.wsMarkers.get(id);
		if (!marker) return;
		this.seekTo(marker.start);
		this.play();
		this.isPlaying = true;
	}

	public play(): void {
		this.player.play();
		this.wave.play();
	}

	public pause(): void {
		this.player.pause();
		this.wave.pause();
	}

	public togglePlaying(): void {
		this.isPlaying = !this.isPlaying;
		this.debounceTogglePlaying(this.isPlaying);
	}

	public toggleMuted(): void {
		this.muted = !this.muted;
		this.player.muted = this.muted;
	}

	public toggleFullscreen(): void {
		if (!document.fullscreenElement) {
			this.$el
				.requestFullscreen()
				.then((): void => {
					this.fullscreenActive = true;
				})
				.catch((err: any): void => {
					Logger.error('Could not enter fullscreen: ', err);
				});
		} else {
			document.exitFullscreen();
			this.fullscreenActive = false;
		}
	}

	public seekTo(time: number): void {
		if (this.player.duration === 0) return;

		this.player.currentTime = time;
		this.wave.seekTo(time / this.player.duration);
	}

	public setProgress(progress: number): void {
		this.player.currentTime = this.player.duration * progress;
		this.wave.seekTo(progress);
	}

	public rewind(): void {
		const time: number = Math.max(0, this.player.currentTime - Math.abs(5));
		this.seekTo(time);
		this.previousSecond = time;
	}

	public fastForward(): void {
		const time: number = Math.min(
			this.player.duration,
			this.player.currentTime + Math.abs(5)
		);
		this.seekTo(time);
		this.previousSecond = time;
	}

	public setPlaybackRate(rate: number): void {
		this.playbackRate = rate;
		this.player.playbackRate = Math.abs(rate);
		this.wave.setPlaybackRate(Math.abs(rate));
	}

	public getVideoDuration(): number {
		return this.player.duration;
	}

	public updateCut(cut: VideoCut): void {
		this.wsRegions.get(cut.id)?.update({
			...cut,
			loop: false,
			drag: true,
			resize: true,
		});
	}

	public deleteCut(id: string): void {
		const cut: WavesurferRegion | undefined = this.wsRegions.get(id);
		if (cut) {
			cut.remove();
			this.wsRegions.delete(id);
			this.wsRegionsBuffer.delete(id);
		}
	}

	public lastMarkerBefore(timeStamp: number): string {
		let id: string = '';

		for (const marker of this.wsMarkers) {
			if (marker[1].start < timeStamp) id = marker[0];
			else return id;
		}
		return id;
	}

	public firstMarkerAfter(timeStamp: number): string {
		let id: string = '';

		for (const marker of this.wsMarkers) {
			id = marker[0];
			if (marker[1].start > timeStamp) return marker[0];
		}
		return id;
	}

	public focusRegion(id: string): void {
		const region: WavesurferRegion | undefined = this.wsRegions.get(id);
		if (region) {
			if (!region.element.classList.contains('focused'))
				region.element.classList.add('focused');
			this.wsRegions.forEach((other: WavesurferRegion): void => {
				if (
					other.id !== id &&
					!other.element.classList.contains('blurred')
				)
					other.element.classList.add('blurred');
			});
		}
	}

	public scrollRegionIntoView(id: string): void {
		const region: WavesurferRegion | undefined = this.wsRegions.get(id);
		if (region)
			region.element.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'nearest',
			});
	}

	public resetFocusedRegion(): void {
		this.wsRegions.forEach((region: WavesurferRegion): void => {
			region.element.classList.remove('focused');
			region.element.classList.remove('blurred');
		});
	}

	public resetAllRegions(): void {
		if (!this.wave) return;

		this.wsRegions = new Map();
		this.wsRegionsBuffer = new Map();
		this.wsMarkers = new Map();
		this.wave.clearRegions();
		if (this.cuts && this.cuts.length) {
			this.createdRegionsAfterReset = 0;
			this.$emit('cutsreset:start');
			this.cuts.forEach((cut: VideoCut): void => {
				this.addNewRegion(cut.start, cut.end, cut.id);
			});
		}
		if (this.markers && this.markers.length)
			this.markers.forEach((marker: VideoMarker): void => {
				this.addNewMarker(marker.timeStamp, `${marker.id}`);
			});
	}

	@Watch('cuts', { immediate: true })
	protected onCutsChange(): void {
		if (this.createdRegionsAfterReset === -1) this.resetAllRegions();
	}

	@Watch('markers', { immediate: true })
	protected onMarkersChange(): void {
		if (this.createdRegionsAfterReset === -1) this.resetAllRegions();
	}

	protected toggleRegions(): void {
		this.regionsActive = !this.regionsActive;
		if (this.regionsActive) this.wave.enableDragSelection({});
		else this.wave.disableDragSelection();
	}

	protected initPlayer(): void {
		this.durationLabel = Js.formatTime(this.player.duration);
	}

	protected downloadSrc(): void {
		window.location.href = this.src;
	}

	protected updateCurrentTime(throttle: boolean): void {
		const time: number = Math.trunc(this.player.currentTime);

		this.$emit('timeupdate', this.player.currentTime);
		this.reactivePlayerTime = this.player.currentTime;
		if (!throttle || time > this.previousSecond) {
			this.currentTimeLabel = Js.formatTime(time);
			this.previousSecond = time;
		}
	}

	protected onKeyUp(event: KeyboardEvent): void {
		const key: string = `${event.altKey ? 'Alt' : ''}${
			event.ctrlKey ? 'Ctrl' : ''
		}${event.metaKey ? 'Meta' : ''}${event.shiftKey ? 'Shift' : ''}${
			event.key
		}`;
		this.keyboardEvents.get(key)?.callback();
	}

	protected handleSttControl(): void {
		if (!this.showStt && !this.regionsActive && this.allowedVideoEdit)
			this.toggleRegions();
		this.showStt = !this.showStt;
	}

	private registerNewRegion(region: WavesurferRegion): void {
		this.registerNextRegion = false;

		region.isMarker = false;
		region.isRegion = true;
		this.wsRegions.set(region.id, region);
		this.wsRegionsBuffer.set(region.id, {
			id: region.id,
			start: region.start,
			end: region.end,
		});
		this.$emit('cut:created', {
			id: region.id,
			start: region.start,
			end: region.end,
		} as VideoCut);
		if (
			this.createdRegionsAfterReset >= 0 &&
			this.createdRegionsAfterReset++ === this.cuts.length - 1
		) {
			this.createdRegionsAfterReset = -1;
			this.$emit('cutsreset:end');
		}
	}

	private registerNewMarker(region: WavesurferRegion): void {
		this.registerNextRegion = false;

		region.isMarker = true;
		region.isRegion = false;
		this.wsMarkers.set(region.id, region);
		this.$emit('marker:created', {
			id: region.id,
			timeStamp: region.start,
		} as VideoMarker);
	}

	private bindWaveSurferRegionsEvts(): void {
		this.wave.on('ready', (): void => {
			if (
				this.waveElements.ref.getBoundingClientRect().width <=
				this.MIN_WIDTH
			) {
				this.waveElements.wave.style.width = `${this.MIN_WIDTH}px`;
				this.waveElements.wave.style.setProperty(
					'overflow',
					'auto hidden'
				);
			}
			try {
				this.resizeObs = new ResizeObserver(
					(entries: ResizeObserverEntry[]): void => {
						const cutRegions: NodeListOf<Element> =
							this.waveElements.wave.querySelectorAll(
								'.wavesurfer-region'
							);
						this.setWavePaddinMargin();

						if (entries[0].contentRect.width > this.MIN_WIDTH) {
							cutRegions.forEach((region: Element): void => {
								region.classList.remove('offset');
							});
							(this.wave as any).drawer.fireEvent('redraw');
							this.waveElements.wave.style.setProperty(
								'overflow',
								'hidden'
							);
						} else {
							this.waveElements.wave.style.setProperty(
								'overflow',
								'auto hidden'
							);

							cutRegions.forEach((region: Element): void => {
								region.classList.add('offset');
							});
						}
					}
				);
				this.resizeObs.observe(this.waveElements.ref);
			} catch (err) {
				Logger.warn('ResizeObserver not supported.', err);
				this.waveElements.ref.style.setProperty(
					'max-width',
					this.waveElements.canvas.style.width
				);
			}
			this.waveReady = true;
			if (this.reactivePlayerTime > 0 && this.player.duration > 0)
				this.wave.seekTo(
					this.reactivePlayerTime / this.player.duration
				);
		});

		this.wave.on('region-created', (region: WavesurferRegion): void => {
			if (this.registerNextRegion === 'ignore') {
				if (this.newRegionMarker && region.isRegion) region.remove();
				else return;
			}
			if (this.registerNextRegion) this.registerNewRegion(region);
			else this.registerNextRegion = true;
		});

		this.wave.on('seek', (progress: number): void => {
			this.player.currentTime = this.player.duration * progress;
			this.updateCurrentTime(false);
			if (this.showStt)
				(this.$refs['stt'] as SpeechToText).resetReader(
					this.reactivePlayerTime
				);
			this.$emit('seek', this.player.currentTime);
		});

		this.wave.on('region-in', (region: WavesurferRegion): void => {
			if (region.isMarker && this.wsMarkers.has(region.id))
				this.$emit('marker:reached', region.id);
		});

		this.wave.on('region-update-end', (region: WavesurferRegion): void => {
			if (this.registerNextRegion === true) {
				this.registerNewRegion(region);
			} else {
				this.$emit('cut:updated', {
					oldCut: this.wsRegionsBuffer.get(region.id),
					cut: {
						id: region.id,
						start: region.start,
						end: region.end,
					} as VideoCut,
				});
				this.wsRegionsBuffer.set(region.id, {
					id: region.id,
					start: region.start,
					end: region.end,
				});
			}
		});

		this.wave.on(
			'region-click',
			(region: WavesurferRegion, event: Event): void => {
				event.stopPropagation(); // prevents wavesurfer from setting the playhead to the cursor location

				this.$emit(
					'cut:click',
					{
						id: region.id,
						start: region.start,
						end: region.end,
					},
					region.isMarker
				);
			}
		);
	}

	private bindKeyboardEvents(): void {
		this.keyboardEvents = new Map([
			[' ', { callback: this.togglePlaying }],
			['ArrowLeft', { callback: this.rewind }],
			['ArrowRight', { callback: this.fastForward }],
			['m', { callback: this.toggleMuted }],
			['i', { callback: this.startNewRegion }],
			['o', { callback: this.endNewRegion }],
			['f', { callback: this.toggleFullscreen }],
		]);
	}

	private setCanvasHeight(): void {
		/**
		 * Get canvas height after css is loaded + set playhead top to counter overflow hidden
		 */
		this.waveElements.wave.setAttribute('data-css', 'loaded');
		this.waveElements.canvas.setAttribute('data-css', 'loaded');
		const canvas: HTMLElement = this.waveElements.canvas;
		canvas.style.setProperty('height', `${canvas.clientHeight}px`);
		const childWave: HTMLElement = this.waveElements.wave.querySelector(
			'wave'
		) as HTMLElement;
		childWave.style.setProperty(
			'top',
			`calc(${canvas.clientHeight}px / 2 + ${
				window.getComputedStyle(canvas).marginTop
			})`
		);
		this.waveElements.canvas.removeAttribute('data-css');
	}

	private setWavePaddinMargin(): void {
		/**
		 * Set wave padding and margin to counter overflow hidden and display regions properly
		 * since their location is not customizable
		 */
		const regionsContainer: HTMLElement = document.querySelector(
			'.regions-container'
		) as HTMLElement;
		if (regionsContainer) {
			regionsContainer.setAttribute('data-css', 'loaded');
			const playerControlHeight: number = document.querySelector(
				'.player-controls'
			)?.clientHeight as number;
			this.waveElements.wave.style.setProperty(
				'padding-bottom',
				`${playerControlHeight}px`
			);
			this.waveElements.wave.style.setProperty(
				'margin-bottom',
				`${-playerControlHeight}px`
			);
			regionsContainer.removeAttribute('data-css');
			this.waveElements.wave.removeAttribute('data-css');
		}
	}

	private setCutTimelineWidth(): void {
		const cutTimeline: NodeListOf<Element> = document.querySelectorAll(
			'.cut-timeline'
		) as NodeListOf<Element>;
		const controlPanelLeft: HTMLElement = document.querySelector(
			'.control-panel.left'
		) as HTMLElement;
		cutTimeline.forEach((element: Element): void => {
			element.setAttribute(
				'style',
				`width: ${controlPanelLeft.clientWidth}px;`
			);
		});
	}

	private mounted(): void {
		this.bindKeyboardEvents();
		this.player = this.$refs['videoPlayer'] as HTMLMediaElement;

		this.wave = Wavesurfer.create({
			container: this.$refs['wavesurfer'] as HTMLElement,
			waveColor: this.waveColor,
			progressColor: this.waveColor,
			mediaType: 'video',
			plugins: [
				WavesurferRegions.create({}),
				WavesurferCursor.create({
					showTime: true,
					formatTimeCallback: Js.formatTime,
				}),
			],
		});

		this.waveElements = {
			ref: this.$refs['wavesurfer'] as HTMLElement,
			canvas: (this.$refs['wavesurfer'] as HTMLElement).querySelector(
				'canvas'
			) as HTMLElement,
			cursor: (this.$refs['wavesurfer'] as HTMLElement).querySelector(
				'cursor'
			) as HTMLElement,
			playhead: (this.$refs['wavesurfer'] as HTMLElement).querySelector(
				'wave > wave'
			) as HTMLElement,
			wave: (this.$refs['wavesurfer'] as HTMLElement).querySelector(
				'wave'
			) as HTMLElement,
		};

		this.setCanvasHeight();

		// Fixing this f*cking shitty plugin (doesn't even check if the progress has a correct value)
		this.wave.drawer.handlers.click[0] = (
			e: Event,
			progress: number
		): void => {
			setTimeout(
				(): void => this.wave.seekTo(_.clamp(progress, 0, 1)),
				0
			);
		};

		this.wave.load(this.src);
		this.wave.setMute(true);
		this.bindWaveSurferRegionsEvts();
		this.resetAllRegions();

		this.$emit('videoPlayerMounted');
	}

	private wsAddRegion(
		id?: string,
		start?: number,
		end?: number,
		loop?: boolean,
		drag?: boolean,
		resize?: boolean
	): WavesurferRegion {
		return this.wave.addRegion({
			id,
			start,
			end,
			loop,
			drag,
			resize,
		});
	}

	private async created(): Promise<void> {
		this.allowedStt = await UserUtils.instance.currentUserHasPermission(
			'result/workboard/video/sub'
		);

		this.allowedVideoEdit =
			await UserUtils.instance.currentUserHasPermission(
				'result/workboard/video/edit'
			);
		this.$nextTick().then(this.setCutTimelineWidth);
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.video-player {
	&:not(:fullscreen) {
        video {
            max-height: 70vh;
        }
    }

    &:fullscreen {
        video {
            max-height: 100vh;
        }

        .player-controls {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            opacity: .3;
            z-index: 2;

            &:hover {
                opacity: 1;
            }
        }
    }

	.media-container {
		position: relative;

		.overlay {
			cursor: pointer;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		video {
			display: block;
			width: 100%;
			background: black;
		}
	}

	.player-controls {
		$controls-padding: math.div($padding, 3);

		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		background: $menu-background-color;
		padding: 0 $controls-padding;

		&:not(.regions-active) {
			.regions-container {
				display: none;
			}

			.wavesurfer-region {
				display: none;
			}

			.wavesurfer > wave {
				padding-bottom: 0px !important;
				margin-bottom: 0px !important;
			}
		}

		.cuts-button {
			border-left: 1px solid rgba($white, 0.2) !important;
			border-right: 1px solid rgba($white, 0.2) !important;
			padding-left: math.div($padding, 2);
			padding-right: math.div($padding, 2);
		}

		.separator  {
			height: 100%;
			border-right: 1px solid rgba($white, 0.2);

			&:not(:last-child) {
				margin-right: math.div($padding, 2);
			}
		}

		.control-panel {
			display: flex;
			align-items: center;
			justify-content: space-between;

			&.left,
			&.right {
				padding: $controls-padding 0;
			}

			&.center {
				flex-grow: 1;
				justify-content: center;

				&.invisible {
					visibility: hidden;
					overflow: hidden;
				}

				.time-tracker {
					color: $white;
					padding: math.div($padding, 2.5) math.div($padding, 1.5);
				}

				.wavesurfer {
					$cursor-size: 5px;
					$marker-size: 3px;

					flex-grow: 1;
					height: 100%;
					position: relative;
					cursor: pointer;

					&::after {
						content: '';
						display: block;
						position: absolute;
						left: 0;
						top: 50%;
						width: 100%;
						outline: 1px solid
							scale-color(
								$menu-background-color,
								$lightness: 20%
							);
					}

					cursor {
						border: none !important;
						opacity: unset !important;

						&::before {
							content: '';
							display: block;
							position: absolute;
							right: -$cursor-size;
							top: calc(50% - #{$cursor-size});
							border: $cursor-size solid rgba($white, 0.3);
							border-radius: 50%;
						}
					}

					showtitle {
						bottom: unset !important;
						top: -100% !important;
						opacity: unset !important;
						height: unset !important;
						color: white;
						padding: math.div($padding, 4);
						border-radius: 1rem;
						background: rgba(black, 0.5);
						transform: translateX(-50%);
					}

					> wave {
						$scrollbar-width: 6px;

						height: 100% !important;
						scrollbar-width: thin;

						&::-webkit-scrollbar {
							height: $scrollbar-width;
							background: $light-grey;
						}

						&::-webkit-scrollbar-thumb {
							border-radius: 4px;
							background: rgba(0, 0, 0, 0.5);
							box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
						}

						&[data-css='loaded'] {
							overflow: hidden !important;
						}

						> canvas[data-css='loaded'] {
							height: calc(
								100% - #{$controls-padding * 2}
							) !important;
						}

						> canvas {
							margin-top: $controls-padding;
							background: rgba($white, 0.06);
							border-radius: $radius;
						}

						> wave {
							border-right: none !important;
							overflow: visible !important;
							height: 0;
							outline: 1px solid $white;
							transition: width 0.1s;

							&::after {
								content: '';
								display: block;
								position: absolute;
								right: -$cursor-size;
								top: calc(50% - #{$cursor-size});
								border: $cursor-size solid $white;
								box-shadow: 0 0 0 $cursor-size
									rgba($white, 0.18);
								border-radius: 50%;
							}
						}

						> .wavesurfer-region {
							top: unset !important;
							height: 2 * $cursor-size !important;
							border-radius: 1rem;
							opacity: 0.6;
							bottom: calc(#{$controls-padding} * 1.5);
							// top: calc(#{$padding} * 3) !important;

							&:not(.focused):not(.blurred) {
								background: $primary-color !important;
							}

							&.focused {
								background: $warning !important;
							}

							&.blurred {
								background: $secondary-color !important;
							}

							&:hover,
							&.focused {
								opacity: 1;
								z-index: 4 !important;
							}

							&.offset {
								bottom: #{$scrollbar-width};
							}

							.wavesurfer-handle {
								width: 8% !important;
								max-width: unset !important;
								background: unset !important;
							}
						}

						> .wavesurfer-marker {
							top: calc(#{$controls-padding} * 2) !important;
							width: 1px !important;
							height: 1px !important;
							background: $white !important;
							border: $marker-size - 1px solid $white;
							box-shadow: 0 0 0 $marker-size
								rgba($white, 0.18);
							border-radius: 50%;
						}

						> .wavesurfer-newregion {
							top: 50% !important;
							width: unset !important;
							height: unset !important;
							background: unset !important;

							i.icon {
								position: relative;
								left: -50%;
								color: $white;
							}
						}
					}
				}
			}

			#stt-button {
				margin-right: 0.75rem;
			}

			#volume-controls {
				position: relative;

				.range-input {
					position: absolute;
					top: 0;
					left: calc(50% - #{math.div($padding, 4)});
					width: 0;
					height: 0;
					overflow: visible;
					z-index: 2;

					.field-container {
						background: $menu-background-color;
						transform: translateX(-50%) translateY(-50%)
							rotate(-90deg) translateX(50%);
						width: max-content;
					}
				}
			}

			#speed-controls {
				position: relative;
				z-index: 2;

				#menu {
					background: $menu-background-color;
					position: absolute;
					bottom: calc(100% + #{math.div($padding, 3)});

					.button {
						width: 100%;
						display: block;
						border-radius: 0;
						text-align: left;
					}
				}
			}

			.button.control {
				border: none;
				background: none;
				opacity: 0.7;
				border-radius: 0;

				&:hover,
				&.active {
					box-shadow: none;
					opacity: 1;
				}

				&.active {
					background: $primary-color;
				}

				i.icon {
					font-size: 1.6rem;
				}
			}
		}

		.regions-container {
			flex-basis: 100%;
			flex-direction: column;
			align-items: start;
			color: $white;
			font-size: 0.7rem;
			font-style: italic;

			&[data-css='loaded'] {
				display: flex;
			}

			.cut-timeline {
				display: flex;
				justify-content: space-between;
				padding: $controls-padding 0px;

				span {
					margin-right: math.div($padding, 2);
					margin-left: auto;
				}
			}

			.horizontal-separator {
				width: 100%;
				border-top: 1px solid rgba($white, 0.2);
			}
		}
	}
}

@-moz-document url-prefix() { // handle weird offset on Firefox
	.wavesurfer-region.offset {
		bottom: 12px !important;
	}
}
</style>
