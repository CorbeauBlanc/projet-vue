<template>
	<div class="progress-bar">
		<p v-if="$slots.default !== undefined">
			<slot></slot>
			<span class="value" v-if="!inlineValue">{{
				`${value || 0}%`
			}}</span>
		</p>
		<div class="progress" :class="{ finished: value === 100 }">
			<div class="bar" :style="{ width: `${value || 0}%` }">
				<div class="value" v-if="inlineValue">
					{{ `${value || 0}%` }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Attr } from '@/decorators';
import { Component, Model, Vue } from 'vue-property-decorator';

@Component({})
export default class ProgressBar extends Vue {
	@Model('change')
	public readonly value!: number;

	@Attr() public readonly inlineValue!: boolean;
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.progress-bar .bar {
	background: $primary-color;
	transition: width $normal-speed;
}

.progress-bar {
	&.inline {
		display: flex;
		align-items: baseline;

		&.big, &.huge {
			align-items: center;
		}

		p {
			margin-right: math.div($padding, 2);
		}

		.progress {
			flex-grow: 1;
		}
	}

	&.compact {
		p {
			margin-top: math.div($padding, 4);
			margin-bottom: math.div($padding, 4);
		}
	}

	&:not(.inline):not(.compact) {
		margin-bottom: math.div($padding, 2);
	}

	&.small {
		p {
			margin-bottom: 0;
		}
		.progress {
			height: .2rem;
		}
	}

	&.big {
		.progress {
			height: 1rem;
		}
	}

	&.huge {
		.progress {
			height: 1.5rem;
		}
	}

	&.success {
		.progress {
			background: $green;
		}

		.bar {
			background: $green;
		}
	}

	&.no-background {
		.progress {
			background: none;
		}
	}

	&.sended {
		.bar,
		.received,
		.opened {
			background: repeating-linear-gradient(45deg, $primary-color, $primary-color 10px, scale-color($primary-color, $lightness: 5%) 10px, scale-color($primary-color, $lightness: 5%) 20px);
		}
	}

	&.unaffected {
		.bar {
			background: $grey;
		}
	}

	&.unstarted {
		.bar {
			background: $orange;
		}
	}

	&.inprogress {
		.bar {
			background: $yellow;

			.value {
				color: $black;
			}
		}
	}

	&.red {
		.bar {
			background: $red;
		}
	}

	&.finished,
	&.green,
	&.main {
		.bar {
			background: $green;
		}
	}

	p {
		text-align: center;
		margin: math.div($padding, 2) 0;

		.value {
			font-weight: bold;
		}
	}

	.progress {
		background: scale-color($light-grey, $lightness: -7%);
		display: block;
		height: .5rem;
		border-radius: $rounded;

		.bar {
			height: 100%;
			border-radius: $rounded;

			.value {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				font-size: .8rem;
				color: $white;
				padding: 0 math.div($padding, 4);
				line-height: 1;
			}
		}
	}
}

</style>
