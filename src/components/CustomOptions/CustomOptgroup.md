Example of custom optgroup

```vue
<template>
	<div>
		<custom-datalist placeholder="Click to select a value" v-model="value">
			<custom-optgroup label="Group A">
				<custom-option>Option 1</custom-option>
				<custom-option>Option 2</custom-option>
			</custom-optgroup>
			<custom-optgroup label="Group B">
				<custom-option>Option 3</custom-option>
				<custom-option>Option 4</custom-option>
			</custom-optgroup>
			<custom-optgroup label="Disabled group" :disabled="true">
				<custom-option>Option 5</custom-option>
				<custom-option>Option 6</custom-option>
			</custom-optgroup>
			<custom-option>Option 7</custom-option>
			<custom-option>Option 8</custom-option>
		</custom-datalist>
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
