Examples of custom options

```vue
<template>
	<div>
		<custom-select placeholder="Click to select a value" v-model="value">
			<custom-option>No attributes</custom-option>
			<custom-option label="Label attribute"></custom-option>
			<custom-option value="value">Value attribute</custom-option>
			<custom-option label="Label and value attributes" value="label + value"></custom-option>
			<custom-option :disabled="true">Disabled option</custom-option>
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
