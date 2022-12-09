Example of tabs switching between components:

```vue
<template>
	<div class="tabs navigation secondary">
		<div class="menu">
			<tab name="tab1" v-master="currentTab">
				Tab 1
			</tab>
			<tab name="tab2" v-master="currentTab">
				Tab 2
			</tab>
			<tab name="tab3" v-master="currentTab">
				Tab 3
			</tab>
			<tab name="tab4" v-master="currentTab">
				Tab 4
			</tab>
		</div>
		<p>
			Current tab: {{ currentTab }}
		</p>
		<p>
			Corresponding Component: {{ tabs.get(currentTab) }}
		</p>
	</div>
</template>

<script>
import Vue from 'vue';

export default {
	data: () => {
		return {
			currentTab: '',
			tabs: new Map([
				['tab1', 'Component1'],
				['tab2', 'Component2'],
				['tab3', 'Component3'],
				['tab4', 'Component4'],
			]),
		}
	},
}
</script>

<style>
p {
	color: white;
}
</style>
```

Example of tabs that can be toggled on and off:

```vue
<template>
	<div class="tabs navigation secondary">
		<div class="menu">
			<tab name="tab1" v-master="currentTab" togglemode>
				Tab 1
			</tab>
			<tab name="tab2" v-master="currentTab" togglemode>
				Tab 2
			</tab>
			<tab name="tab3" v-master="currentTab" togglemode>
				Tab 3
			</tab>
			<tab name="tab4" v-master="currentTab" togglemode>
				Tab 4
			</tab>
		</div>
		<p>
			Current tab: {{ currentTab }}
		</p>
		<p>
			Corresponding Component: {{ tabs.get(currentTab) }}
		</p>
	</div>
</template>

<script>
import Vue from 'vue';

export default {
	data: () => {
		return {
			currentTab: 'tab1',
			tabs: new Map([
				['tab1', 'Component1'],
				['tab2', 'Component2'],
				['tab3', 'Component3'],
				['tab4', 'Component4'],
			]),
		}
	},
}
</script>

<style>
p {
	color: white;
}
</style>
```
