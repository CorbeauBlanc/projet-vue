Example of default custom datalist

```vue
<template>
	<div>
		<custom-datalist placeholder="Click to select a value" v-model="value">
			<custom-option>Option 1</custom-option>
			<custom-option>Option 2</custom-option>
			<custom-option>Option 3</custom-option>
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


Example of lazy custom datalist

```vue
<template>
	<div>
		<custom-datalist placeholder="Click to select a value" v-model="value" :lazy="true">
			<custom-option>Option 1</custom-option>
			<custom-option>Option 2</custom-option>
			<custom-option>Option 3</custom-option>
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
