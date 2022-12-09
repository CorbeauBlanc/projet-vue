Example of default custom select

```vue
<template>
	<div>
		<custom-select placeholder="Click to select a value" v-model="value">
			<custom-option>Option 1</custom-option>
			<custom-option>Option 2</custom-option>
			<custom-option>Option 3</custom-option>
		</custom-select>
		<p>
			Selected value: {{ value }}
		</p>
	</div>
</template>

<script>
export default {
	data: () => {
		return {
			value: '',
		};
	},
};
</script>

<style>
p {
	color: white;
}

.option {
	background: white;
}
</style>
```
