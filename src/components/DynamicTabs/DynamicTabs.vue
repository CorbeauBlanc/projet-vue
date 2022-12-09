<template>
	<div class="dynamic-tabs">
		<tab
			v-for="(tab, i) in tabs"
			v-master="current"
			:name="tab"
			:class="tab.class"
			:disabled="tab.disabled"
			:events-enabled="inactiveTab !== i"
			:key="`${tab.value || ''}${i}`"
		>
			<i :class="`icon ${tab.icon}`" v-if="tab.icon" />
			<div :class="`flag country-${tab.flag}`" v-if="tab.flag" />
			<span>
				{{ $t(tab.text || tab.toString()) }}
			</span>
			<icon
				class="text red"
				delete
				tabindex="0"
				v-if="!isCurrentTab(tab)"
				@blur="inactiveTab = -1"
				@focus="inactiveTab = i"
				@click="deleteTab(i)"
			/>
		</tab>
		<custom-select
			class="tab item"
			icon="add"
			v-model="newTab"
			@change="addNewTab"
			hide-input
		>
			<custom-option
				v-for="(opt, i) in config.tabOptions"
				:value="opt.value"
				:key="`${opt.value || ''}${i}`"
			>
				<i :class="`icon ${opt.icon}`" v-if="opt.icon" />
				<div :class="`flag country-${opt.flag}`" v-if="opt.flag" />
				{{ $t(opt.text || opt.toString()) }}
			</custom-option>
		</custom-select>
	</div>
</template>

<script lang="ts">
import CustomOption from '@/components/CustomOptions/CustomOption.vue';
import CustomSelect from '@/components/CustomOptions/CustomSelect.vue';
import { DynamicTabsConfig } from '@/components/DynamicTabs/DynamicTabsTypes';
import { InputOption } from '@/components/Inputs/InputsTypes';
import Tab from '@/components/Tab/Tab.vue';
import { Master } from '@/decorators';
import { Vision } from '@/optician';
import Logger from '@/services/LoggerService';
import { Component, Prop } from 'vue-property-decorator';

@Component({
	components: {
		Tab,
		CustomSelect,
		CustomOption,
	},
})
export default class DynamicTabs extends Vision {
	@Prop() protected readonly config!: DynamicTabsConfig;

	@Master('change:tabs') protected readonly tabs: (InputOption | string)[] =
		[];
	@Master('change:current') protected readonly current: InputOption | string =
		'';

	protected newTab: string | InputOption = '';
	protected inactiveTab: number = -1;

	protected addNewTab(): void {
		const newTab: string =
			typeof this.newTab === 'string' ? this.newTab : this.newTab.value;

		if (
			this.tabs.some(
				(option: string | InputOption): boolean =>
					(typeof option === 'string' ? option : option.value) ===
					newTab
			)
		)
			this.$emit('change:current', this.newTab);
		else {
			const availableTab: string | InputOption | undefined =
				this.config.tabOptions.find(
					(option: string | InputOption): boolean =>
						(typeof option === 'string' ? option : option.value) ===
						newTab
				);
			if (!availableTab)
				return Logger.dbgLog(
					'DynamicTabs: addNewTab: availableTab is undefined',
					this
				);

			this.tabs.push(availableTab);
			this.$emit('change:tabs', this.tabs);
			this.$emit('change:current', availableTab);
		}
	}

	protected deleteTab(index: number): void {
		if (this.config.deleteModal) {
			const tabToDelete: string | InputOption = this.tabs[index];
			this.config.deleteModal.onHideCallback = (
				confirm: boolean
			): void => {
				if (confirm) this.tabs.splice(index, 1);
			};
			this.config.deleteModal.show(
				typeof tabToDelete === 'string' ? tabToDelete : tabToDelete.text
			);
		} else this.tabs.splice(index, 1);
	}

	protected isCurrentTab(tab: string | InputOption): boolean {
		return (
			(typeof tab === 'string' ? tab : tab.value) ===
			(typeof this.current === 'string'
				? this.current
				: this.current.value)
		);
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.dynamic-tabs {
	.tab {
		i.icon.delete {
			margin-right: 0;
			margin-left: math.div($padding, 4);
			font-size: 1.2em;
		}
	}

	.select {
		position: relative;

		.cs-suggestions {
			width: max-content;
			max-height: unset;
			position: absolute;
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
			background: $white;
			border-radius: $radius;
			padding: math.div($padding, 4) math.div($padding, 3);
			box-shadow: $selected-shadow;
			text-align: left;
			opacity: initial;

			overflow: visible; // Used to display the arrow of the "tooltip". Disable it if the max height is reached.

			&::before {
				$arrow-size: 10px;

				content: '';
				display: block;
				position: absolute;
				left: 50%;
				bottom: 100%;
				transform: translateX(-50%);
				border-bottom: solid $arrow-size $white;
				border-left: solid $arrow-size transparent;
				border-right: solid $arrow-size transparent;
			}
		}
	}
}
</style>
