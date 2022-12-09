<template lang="pug">
	#home-page
		h1 Hello World!
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";


@Component({})
export default class HomePage extends Vue {}
</script>

<style scoped lang="scss">
#home-page {
	text-align: center;
}
</style>