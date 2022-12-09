<template>
	<caption>
		<div class="pagination">
			<span
				class="link"
				:class="{ disabled: index <= 0 }"
				@click="changePage(index - 1)"
			>
				<icon arrow long left />
			</span>
			<span
				class="link"
				:class="{ disabled: index <= 0 }"
				@click="changePage(0)"
			>
				{{ translate ? $t('1ère page') : '1ère page' }}
			</span>

			<div class="pages">
				<span
					class="link page"
					v-for="page in pages"
					:key="page.index"
					:class="{ active: index === page.index }"
					@click="changePage(page.index)"
					>{{ page.index + 1 }}</span
				>
			</div>

			<span
				class="link"
				:class="{ disabled: index >= calcTotalPages - 1 }"
				@click="changePage(calcTotalPages - 1)"
			>
				{{ translate ? $t('Dernière page') : 'Dernière page' }}
			</span>
			<span
				class="link"
				:class="{ disabled: index >= calcTotalPages - 1 }"
				@click="changePage(index + 1)"
			>
				<icon arrow long right />
			</span>
		</div>
	</caption>
</template>

<script lang="ts">
import { Master } from '@/decorators';
import { Component, Vision } from '@/optician';
import Logger from '@/services/LoggerService';
import { Prop } from 'vue-property-decorator';

type Page = {
	index: number;
	rowOffset: number;
};

/**
 * Component used to render the pagination of the table
 */
@Component({})
export default class CustomTablePagination extends Vision {
	/**
	 * The expected total number of entries in the table
	 */
	@Prop(Number) public readonly totalCount!: number;
	/**
	 * The number of entries per page
	 */
	@Prop(Number) public readonly limitPerPage!: number;
	@Prop(Number) public readonly totalPages!: number;
	@Prop(Number) public readonly maxNavLinks!: number;
	@Prop() public readonly translate!: boolean;

	/**
	 * The current index of the table
	 * @model
	 */
	@Master('change:index') public readonly index: number = 0;
	@Master('change:offset') public readonly rowOffset!: number | undefined;

	private pPages: Page[] = [];
	private navLinkOffset: number = 0;

	protected get calcLimitPerPage(): number {
		return this.limitPerPage || this.totalPages
			? this.totalCount / this.totalPages
			: 1;
	}

	protected get calcTotalPages(): number {
		return Math.abs(
			this.totalPages !== undefined
				? this.totalPages
				: this.totalCount / this.limitPerPage
		);
	}

	/**
	 * Automatically reset the pages to display if the total number of pages has changed
	 */
	protected get pages(): Page[] {
		if (this.forceUpdate) this.forceUpdate = false;
		if (this.maxNavLinks)
			return this.pPages.slice(
				this.navLinkOffset * this.maxNavLinks,
				(this.navLinkOffset + 1) * this.maxNavLinks
			);
		return this.pPages;
	}

	/**
	 * Emit an event when the page is changed
	 * @public
	 */
	protected changePage(index: number): void {
		if (index < 0 || index >= this.calcTotalPages || index === this.index)
			return Logger.dbgLog(
				'CustomTablePagination: changePage: index is less than 0, more or equal to this.calcTotalPages, or equal to this.index',
				this
			);

		if (
			this.maxNavLinks &&
			(index >= (this.navLinkOffset + 1) * this.maxNavLinks ||
				index < this.navLinkOffset * this.maxNavLinks)
		)
			this.navLinkOffset = Math.trunc(index / this.maxNavLinks);
		if (this.rowOffset !== undefined)
			/**
			 * Emit the new offset
			 * @type {number}
			 */
			this.$emit('change:offset', this.pPages[index].rowOffset);
		/**
		 * Emit the change of the current index
		 * @type {number}
		 */
		this.$emit('change:index', index);
	}

	private resetPages(): void {
		this.pPages = [];
		for (
			let index: number = 0, rowOffset: number = 0;
			index < this.calcTotalPages;
			index++, rowOffset += this.calcLimitPerPage
		)
			this.pPages.push({ index, rowOffset });
		this.changePage(0);
		this.forceUpdate = true;
	}

	private created(): void {
		['totalCount', 'limitPerPage', 'totalPages', 'maxNavLinks'].forEach(
			(prop: string): void => {
				this.$watch(prop, this.resetPages, { immediate: true });
			}
		);
		if (this.index === undefined) this.$emit('change:index', 0);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';

caption {
	caption-side: bottom;
	color: $text-color;

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		padding: $padding 0;

		.link {
			padding: math.div($padding, 2);
			border-radius: $rounded;
			text-align: center;
			align-self: center;
			white-space: nowrap;

			&.active {
				font-weight: 700;
				background: scale-color($default-color, $lightness: 90%);
			}
		}


		.pages {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;

			.page {
				width: $padding * 2;

				&:not(:last-child) {
					margin-right: math.div($padding, 6);
				}
			}

		}
	}
}
</style>
