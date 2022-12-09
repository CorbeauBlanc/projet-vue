<template>
	<div class="six wide column">
		<div class="segments streched">
			<div class="segment header">TITRE</div>
			<div class="segment" v-html="newsContent"></div>
		</div>
	</div>
</template>

<script lang="ts">
// import sanitizeHtml from 'sanitize-html';
import ComponentsUtils from '@/services/ComponentsUtils';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class HomeNews extends Vue {
	protected newsContent: string = '<p>CONTENU</p>';
	/*sanitizeHtml(
		'<p>CONTENU</p><div onclick="alert(`test`)">test</div>',
		ComponentsUtils.defaultSanitizerOptions
	)*/
}
</script>
