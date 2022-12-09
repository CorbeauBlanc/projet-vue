```vue
<template>
	<div>
		<custom-table
			ref="table"
			class="data"
			:data="list"
			:config="{}"
			:labels="[ 'Col 1', 'Col 2', 'Col 3', 'Col 4' ]"
		/>
		<button class="button" @click="toggle">Click to toggle the subtable</button>
	</div>
</template>

<script>
import Vue from 'vue';

export default {
	methods: {
		toggle: function() {
			this.$refs['table'].toggleSubTable(0);
		},
	},
	data: () => {
		return {
			table: {},
			list: {
				data: [
					{
						col1: 'row 1',
						col2: 'http://www.account2.testapic.com',
						col3: {
							content: {
								value: '',
								type: 4,
								class: 'sub',
								table: {
									config: {},
									labels: ['Col a', 'Col b', 'Col C'],
									data: {
										data: [
											{
												colA: 'subtable row 1',
												colB: 'subtable row 1',
												colC: 'subtable row 1',
											},
										],
									},
								},
							},
						},
						col4: {
							content: {
								type: 0,
								value: 'colspan 2',
							},
							colspan: 2,
						},
					},
					{
						col1: 'row 2',
						col2: 'http://www.account2.testapic.com',
						col3: 'no subtable',
						col4: {
							content: {
								type: 0,
								value: 'colspan 1',
							},
							colspan: 1,
						},
					},
				],
			},
		};
	},
};
</script>

<style>
tr td {
	border-right: 1px solid #7a7a97;
}

.ct-cell-col2 {
	text-align: center;
}
</style>
```
