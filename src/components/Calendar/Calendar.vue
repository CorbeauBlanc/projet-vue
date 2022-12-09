<template>
	<div class="calendar">
		<div class="year-month-selection">
			<button class="button icon flat" @click="previousMonth">
				<icon chevron left />
			</button>
			<select-input :config="selectYearConfig" v-model="selectedYear" />
			<select-input :config="selectMonthConfig" v-model="selectedMonth" />
			<button class="button icon flat" @click="nextMonth">
				<icon chevron right />
			</button>
		</div>
		<div>
			<table class="week">
				<thead>
					<tr>
						<th>{{ $t('Lun') }}</th>
						<th>{{ $t('Mar') }}</th>
						<th>{{ $t('Mer') }}</th>
						<th>{{ $t('Jeu') }}</th>
						<th>{{ $t('Ven') }}</th>
						<th>{{ $t('Sam') }}</th>
						<th>{{ $t('Dim') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(week, i) in weeks" :key="i">
						<td
							v-for="(day, j) in week"
							:key="`${i}${j}`"
							:class="{
								day: true,
								text: true,
								muted: isInSelectedMonth(day),
								today:
									today.toDateString() === day.toDateString(),
								selected: isSelected(
									getInputFormattedValue(day)
								),
							}"
						>
							<label>
								<input
									type="radio"
									name="calendar"
									:value="getInputFormattedValue(day)"
									v-model="inputSelectedDate"
									v-if="!multipleSelection"
								/>
								<input
									type="checkbox"
									:value="getInputFormattedValue(day)"
									v-model="inputSelectedDate"
									v-else
								/>
								{{ day.getDate() }}
							</label>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts">
import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import { Master } from '@/decorators';
import { Vision } from '@/optician';
import Languages from '@/services/LanguagesService';
import Logger from '@/services/LoggerService';
import { Component, Model, Prop, Watch } from 'vue-property-decorator';

/**
 * Component displaying the whole month of a calendar with the possibility
 * to change the current month and year, and to select one or multiple days
 */
@Component({
	components: {
		SelectInput,
	},
})
export default class Calendar extends Vision {
	/**
	 * The current year
	 */
	@Prop() public readonly year!: number;
	/**
	 * The current month
	 */
	@Prop() public readonly month!: number;
	/**
	 * Is it possible to select multiple days or not
	 */
	@Prop() public readonly multipleSelection!: boolean;

	/**
	 * v-model and v-master directives for the selected day(s)
	 */
	@Model('change') public readonly modelDate!: string | string[];
	@Master('change') protected get default(): string | string[] {
		return this.masterDate;
	}
	/**
	 * Every time the value changes, format it before use
	 * @public
	 */
	protected set default(val: string | string[]) {
		if (this.preventWatchFeedback) this.preventWatchFeedback = false;
		else {
			this.masterDate = val;
			if (val && val !== '') this.resetSelectedDate(this.masterDate);
			else {
				Logger.dbgLog(
					'Calendar: set default: val is undefined or empty string',
					this
				);
				this.inputSelectedDate = '';
			}
		}
	}
	protected masterDate: string | string[] = '';

	/**
	 * The date selected by the user
	 * @type {string | string[]}
	 */
	protected inputSelectedDate: string | string[] = [];
	/**
	 * The calculated weeks of the current month
	 */
	protected weeks: Date[][] = [];
	protected today: Date = new Date();
	/**
	 * The currently selected year
	 * @type {string | InputOption}
	 */
	protected selectedYear: string | InputOption = this.today
		.getFullYear()
		.toString();
	/**
	 * The currently selected month
	 * @type {string | InputOption}
	 */
	protected selectedMonth: string | InputOption = (
		this.today.getMonth() + 1
	).toString();

	/**
	 * Config for the SelectInput used to select the current month
	 */
	protected selectMonthConfig: InputConfig<InputType.SELECT> = {
		options: [],
	};
	/**
	 * Config for the SelectInput used to select the current year
	 */
	protected selectYearConfig: InputConfig = {
		options: (trigger?: 'top' | 'bottom'): InputOption[] => {
			const length: number = this.selectableYearList.length;
			const first: number = this.selectableYearList[0];
			const last: number = this.selectableYearList[length - 1];
			const year: number = this.getYearNumber();
			if (!trigger && !length)
				for (let i: number = year + 5; i > year - 5; i--)
					this.selectableYearList.push(i);
			else if (trigger === 'top')
				for (let i: number = first + 1; i < first + 11; i++)
					this.selectableYearList.unshift(i);
			else if (trigger === 'bottom')
				for (let i: number = last - 1; i > last - 11; i--)
					this.selectableYearList.push(i);
			return this.selectableYearList.map<InputOption>(
				(val: number): InputOption => ({
					text: val.toString(),
					value: val.toString(),
				})
			);
		},
	};

	/**
	 * List of all the 'loaded' years in the SelectInput for the current year
	 */
	private selectableYearList: number[] = [];

	/**
	 * Go to next month
	 * @public
	 */
	public nextMonth(): void {
		this.setYearAndMonth(this.getYearNumber(), this.getMonthNumber() + 1);
	}

	/**
	 * Go to previous month
	 * @public
	 */
	public previousMonth(): void {
		this.setYearAndMonth(this.getYearNumber(), this.getMonthNumber() - 1);
	}

	/**
	 * Set the current year and month
	 * @public
	 */
	public setYearAndMonth(year: number, month: number): void {
		if (month < 1) {
			year -= 1;
			month = 12;
		} else if (month > 12) {
			year += 1;
			month = 1;
		}
		if (year < 1)
			return Logger.dbgError(
				'Calendar: setYearAndMonth: year is less than 1',
				this
			);

		this.selectedYear = year.toString();
		this.selectedMonth = month.toString();
	}

	/**
	 * When the user select a date, emit a change event
	 * @public
	 */
	@Watch('inputSelectedDate')
	protected onTmpSelectedDateChange(): void {
		this.preventWatchFeedback = true;
		this.$emit(
			'change',
			Array.isArray(this.inputSelectedDate)
				? Object.assign({}, this.inputSelectedDate)
				: this.inputSelectedDate
		);
	}

	/**
	 * Every time the value changes, format it before use
	 * @public
	 */
	@Watch('modelDate', { immediate: true })
	protected onSelectedDateChange(): void {
		if (this.preventWatchFeedback) this.preventWatchFeedback = false;
		else if (this.modelDate && this.modelDate !== '')
			this.resetSelectedDate(this.modelDate);
	}

	/**
	 * Returns the value formatted like the value of an HTMLInputElement
	 * @public
	 */
	protected getInputFormattedValue(valDate: Date): string {
		const year: number = valDate.getFullYear();
		const month: number = valDate.getMonth() + 1;
		const date: number = valDate.getDate();

		return `${year}-${month < 10 ? '0' : ''}${month}-${
			date < 10 ? '0' : ''
		}${date}`;
	}

	/**
	 * Has a given date been selected by the user
	 * @public
	 */
	protected isSelected(date: string): boolean {
		return this.inputSelectedDate.includes(date);
	}

	/**
	 * Is a given date in the currently selected month
	 * @public
	 */
	protected isInSelectedMonth(date: Date): boolean {
		return (
			(date.getMonth() + 1).toString() !==
			(typeof this.selectedMonth === 'string'
				? this.selectedMonth
				: this.selectedMonth.value)
		);
	}

	/**
	 * Returns the day of the 1st week for a givent month and year.
	 * The number will be negative if the day belongs to the previous month
	 * See Zeller's congruence (more exactly Tøndering's variation of it)
	 * for details about the calculus: https://en.wikipedia.org/wiki/Zeller%27s_congruence
	 */
	private getMondaysDay(month: number, year: number): number {
		const mod: number = Math.floor((14 - month) / 12);
		const modifiedYear: number = year - mod;
		const modifiedMonth: number = month + 12 * mod;
		const weekDay: number =
			(1 +
				Math.floor((31 * (modifiedMonth - 2)) / 12) +
				modifiedYear +
				Math.floor(modifiedYear / 4) -
				Math.floor(modifiedYear / 100) +
				Math.floor(modifiedYear / 400)) %
			7;

		return 2 - weekDay;
	}

	private getMonthNumber(): number {
		return Number.parseInt(
			typeof this.selectedMonth !== 'string'
				? this.selectedMonth.value
				: this.selectedMonth
		);
	}

	private getYearNumber(): number {
		return Number.parseInt(
			typeof this.selectedYear !== 'string'
				? this.selectedYear.value
				: this.selectedYear
		);
	}

	/**
	 * Format the selected date
	 */
	private resetSelectedDate(value: string | string[]): void {
		const newDate: Date = new Date(Array.isArray(value) ? value[0] : value);
		this.selectedMonth = (newDate.getMonth() + 1).toString();
		this.selectedYear = newDate.getFullYear().toString();
		if (Array.isArray(value))
			this.inputSelectedDate = value.map((date: string): string =>
				this.getInputFormattedValue(new Date(date))
			);
		else this.inputSelectedDate = this.getInputFormattedValue(newDate);
	}

	/**
	 * Recalculate the weeks for the selected month and year
	 */
	private resetWeeks(): void {
		const year: number = this.getYearNumber();
		const month: number = this.getMonthNumber();
		let weekDay: number = this.getMondaysDay(month, year);
		let newDay: Date | undefined;
		let maxIterations: number = 42;
		this.weeks = [];

		while (
			maxIterations-- > 0 &&
			(!newDay ||
				(newDay.getMonth() <= month - 1 &&
					newDay.getFullYear() <= year))
		) {
			const newWeek: Date[] = [];
			for (let i: number = 0; i < 7; i++) {
				newDay = new Date(year, month - 1, weekDay);
				newWeek.push(newDay);
				weekDay++;
			}
			this.weeks.push(newWeek);
		}
	}

	private created(): void {
		[
			Languages.t('Janvier').toString(),
			Languages.t('Février').toString(),
			Languages.t('Mars').toString(),
			Languages.t('Avril').toString(),
			Languages.t('Mai').toString(),
			Languages.t('Juin').toString(),
			Languages.t('Juillet').toString(),
			Languages.t('Août').toString(),
			Languages.t('Septembre').toString(),
			Languages.t('Octobre').toString(),
			Languages.t('Novembre').toString(),
			Languages.t('Décembre').toString(),
		].forEach((val: string, index: number): void => {
			(this.selectMonthConfig.options as InputOption[]).push({
				text: val,
				value: (index + 1).toString(),
			});
		});

		this.selectedYear = (this.year || this.selectedYear).toString();
		this.selectedMonth = (this.month || this.selectedMonth).toString();
		this.resetWeeks();
		['selectedYear', 'selectedMonth'].forEach((val: string): void => {
			this.$watch(val, this.resetWeeks, { immediate: true });
		});
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

input[type="radio"], input[type="checkbox"] {
	display: none;
}

.year-month-selection {
	display: flex;
	justify-content: space-between;
	margin-bottom: math.div($padding, 2);
	padding-bottom: math.div($padding, 2);
	border-bottom: $border-width solid $border-color;
}

table.week {
	width: 100%;

	thead {
		margin-bottom: math.div($padding, 2);

		th {
			font-weight: normal;
		}
	}

	tbody td.day {
		label {
			display: block;
			width: 100%;
			height: 100%;
			padding: (math.div($padding, 3)) 0;
			text-align: center;
			font-weight: 200;
			font-size: 1.5rem;
			cursor: pointer;

			&:hover {
				color: $default-color;
				background: rgba($default-color, .1);
			}

			&:active, &:focus, &:visited, &.active {
				background: rgba($default-color, .2);
				border-color: transparent;
			}
		}

		&.today {
			background: linear-gradient(45deg, transparent, transparent 90%, $sea-green 90%, $sea-green);
		}

		&.selected {
			background: $default-color;
			border-radius: $radius;

			label {
				color: $white;
			}

			&.today {
				background: linear-gradient(45deg, $default-color, $default-color 90%, $sea-green 90%, $sea-green);
			}
		}
	}
}
</style>
