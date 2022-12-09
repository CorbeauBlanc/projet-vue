Example of a default tooltip toggled by hover
```vue
<template>
	<button style="position: relative;">
		<tooltip class="top">Tooltip</tooltip>
		Hover me
	</button>
</template>
```


Example of a default tooltip toggled by 1 button
```vue
<template>
	<button style="position: relative;" @click="toggle">
		<tooltip ref="tooltip" class="top">Tooltip</tooltip>
		Click me
	</button>
</template>
<script>
import Vue from 'vue';

export default {
	methods: {
		toggle: function () {
			this.$refs['tooltip'].toggle();
		}
	}
}
</script>
```


Example of a default tooltip toggled by 2 buttons
```vue
<template>
	<div style="position: relative;">
		<tooltip ref="tooltip" class="top">Tooltip</tooltip>
		<button @click="show">Show tooltip</button>
		<button @click="hide">Hide tooltip</button>
	</div>
</template>
<script>
import Vue from 'vue';

export default {
	methods: {
		hide: function () {
			this.$refs['tooltip'].hide();
		},
		show: function () {
			this.$refs['tooltip'].show();
		}
	}
}
</script>
```
