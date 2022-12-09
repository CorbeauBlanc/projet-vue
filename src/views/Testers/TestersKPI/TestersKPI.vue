<template>
	<div class="container">
		<div class="stackable grid">
			<div class="six wide column">
				<div class="segments">
					<div class="header segment">Activité</div>
					<div class="segment">
						<custom-table :data="list" :config="{}" />
					</div>
				</div>
			</div>
			<div class="six wide column">
				<div class="segments">
					<div class="header segment">Affectations</div>
					<div class="segment">
						<p>GRAPHS</p>
					</div>
				</div>
				<div class="segments">
					<div class="header segment">Notes</div>
					<div class="segment">
						<p>GRAPHS</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import {
	CustomTableConfig,
	CustomTableDataGenericInput,
} from '@/components/CustomTable/CustomTableTypes';
import Axios, { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		CustomTable,
	},
})
export default class TestersKpi extends Vue {
	protected list: CustomTableDataGenericInput = { data: [] };

	private created(): void {
		Axios.get(
			'http://localhost/testapic/testers_kpi/example_data.php'
		).then((result: AxiosResponse<any>): void => {
			this.list = { data: result.data };
		});
	}
}
</script>

<style lang="scss" scoped>

</style>
