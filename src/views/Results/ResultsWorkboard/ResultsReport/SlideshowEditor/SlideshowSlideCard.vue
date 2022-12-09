<template>
	<div v-if="add" class="slide-card add">
		<slot></slot>
		<div class="new card" @click="emitClick">
			<div>
				<icon add />
			</div>
			<div>Ajouter une slide</div>
		</div>
	</div>
	<drag-target
		v-else
		class="slide-card"
		:drag-element="dragIcon"
		:drag-data="{ data: index, type: 'text/plain' }"
		@dragging="emitDragging"
	>
		<div class="draggable card">
			<div class="header">
				<div class="left items">
					<icon
						link
						arrows
						slide-dnd-icon
						ref="dnd"
						draggable="true"
					/>
					<span>{{ index + 1 }} / {{ total }}</span>
				</div>
				<div class="right items">
					<icon link play slides />
					<icon link hide />
					<icon link edit />
					<icon link red delete @click="emitDelete" />
				</div>
			</div>
			<div class="main" v-html="cardContent"></div>
			<div class="footer title">
				<span>{{ data.title }}</span>
			</div>
		</div>
	</drag-target>
</template>

<script lang="ts">
import DragTarget from '@/components/DragAndDrop/DragTarget.vue';
// import sanitizeHtml from 'sanitize-html';
import ComponentsUtils from '@/services/ComponentsUtils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SlideshowSlideData } from './SlideshowTypes';

@Component({
	components: {
		DragTarget,
	},
})
export default class SlideshowSlideCard extends Vue {
	@Prop() public readonly index!: number;
	@Prop() public readonly total!: number;
	@Prop() public readonly data!: SlideshowSlideData;
	@Prop() public readonly add!: boolean;

	protected cardContent: string = '';
	protected dragIcon: HTMLElement | null = null;
	protected dragging: boolean = false;

	protected emitDragging(value: boolean): void {
		this.dragging = value;
		this.$emit('dragging', value);
	}

	protected emitDelete(): void {
		this.$emit('delete');
	}

	protected emitClick(event: MouseEvent): void {
		this.$emit('click', event);
	}

	private mounted(): void {
		this.dragIcon = this.$refs['dnd'] as HTMLElement;
	}

	private created(): void {
		if (!this.add) {
			this.cardContent = this.data.html;
			/*sanitizeHtml(
				this.data.html,
				ComponentsUtils.defaultSanitizerOptions
			)*/
		}
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.slide-card {
	margin: 1%;
	width: 18%;
	min-height: 150px;

	&.add {
		display: flex;
		justify-content: center;

		.slide-drop-target {
			height: 100%;
			margin: 0;
		}

		&.dragging {

			.slide-drop-target.active {
				width: 100%;
				margin: 0;
			}

			.new.card {
				display: none;
			}
		}
	}

	.drag-content {
		height: 100%;
	}

	.card {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: center;
		align-items: center;
		background: $white;
		height: 100%;

		&.disabled {
			background: rgba($menu-background-color, .4);
		}

		&.new {
			width: 100%;
			cursor: pointer;
			justify-content: center;
			background: none;
			box-shadow: none;
			border: $border-width solid $border-color;
			color: $grey;
			font-size: 1rem;

			&:hover {
				color: $white;
				border-color: $primary-color;
			}

			i.icon {
				margin-bottom: math.div($padding, 2);
			}
		}

		&.draggable {

			&.dragging {
				outline: 1px solid $white;
			}

			.header {
				display: flex;
				flex: 0 0 auto;
				align-self: stretch;
				justify-content: space-between;
				flex-direction: row;
				padding: math.div($padding, 3);
				background: $white;

				.items {
					align-self: center;
					display: flex;

					> div {
						align-self: center;
					}

					i.icon {
						cursor: pointer;

						&:not(:last-child) {
							margin-right: math.div($padding, 2);
						}
					}

					.slide-dnd-icon {
						z-index: 42069;
					}
				}
			}

			.main {
				flex: 1 0 auto;
				padding: 0;
				max-height: 137px;
				overflow: auto;
				@include scrollbar;

				&.title.only {
					display: flex;
					width: 100%;
					justify-content: center;
					text-align: center;
					font-size: .7rem;
					font-weight: 700;
					background: $light-grey;
				}

				&.custom {
					padding: math.div($padding, 4);
					justify-content: flex-start;
				}

				&.observation {
					justify-content: flex-start;
					padding: math.div($padding, 4);

					.title {
						margin-bottom: math.div($padding, 4);
					}
				}

				.image {
					.first, .second {
						border-radius: 0;
						max-height: none;
						box-shadow: none;

						.button {
							margin: 0;
						}

						i.icon {
							margin-right: math.div($padding, 4);
						}
					}
				}

				img {
					flex: 1;
				}
			}

			.footer {
				width: 100%;
				background: $white;
				padding: math.div($padding, 3);
				border-top: $border-width solid $border-color;
				position: relative;
				display: flex;
				justify-content: space-between;
				flex-direction: row;
				margin: 0;

				&.title {
					justify-content: center;
				}

				.group {
					i.icon {
						font-size: .8rem;
					}
				}
			}
		}
	}
}
</style>
