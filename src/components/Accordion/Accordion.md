```vue
<template>
	<accordion :autoclose="collapsed" :level="[
				{ title: 'LVL 1 - a' },
				{ title: 'LVL 1 - b' },
				{
					title: 'LVL 1 - c',
					nextLevels: [
						{ title: 'LVL 2 - a' },
						{
							title: 'LVL 2 - b',
							nextLevels: [
								{ title: 'LVL 3 - a' },
								{ title: 'LVL 3 - b' },
							],
						},
						{
							title: 'LVL 2 - c',
							nextLevels: [
								{ title: 'LVL 3 - a' },
								{ title: 'LVL 3 - b' },
							],
						},
					],
				},
			]" :root="true"></accordion>
</template>

<script>
import Vue from 'vue';
import { Accordion } from '@/components/Accordion/Accordion.vue';

export default {
	components: {
		Accordion,
	},
	data: () => {
		return {
			collapsed: false,
			accordionLevels: [
				{ title: 'LVL 1 - a' },
				{ title: 'LVL 1 - b' },
				{
					title: 'LVL 1 - c',
					nextLevels: [
						{ title: 'LVL 2 - a' },
						{
							title: 'LVL 2 - b',
							nextLevels: [
								{ title: 'LVL 3 - a' },
								{ title: 'LVL 3 - b' },
							],
						},
						{
							title: 'LVL 2 - c',
							nextLevels: [
								{ title: 'LVL 3 - a' },
								{ title: 'LVL 3 - b' },
							],
						},
					],
				},
			],
		};
	},
};
</script>
```
