<template>
	<div id="mail-template">
		<div class="container">
			<div class="heading secondary">
				<h3 class="title">
					<a><icon long arrow left />Campagnes</a>
					- Templates des emails
				</h3>
				<button class="button ghost">Prévisualiser</button>
			</div>
		</div>
		<div class="container">
			<div class="segments">
				<div class="segment">
					<div class="flag country-fr"></div>
					<span>Français</span>
				</div>
				<div class="segment tabs alt navigation tertiary">
					<div class="menu">
						<tab> 1er mail </tab>
						<tab> Relance </tab>
					</div>
				</div>
				<div class="segment">
					<text-input :config="subjectConfig" />
					<wysiwyg-input :config="bodyConfig" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { InputConfig } from '@/components/Inputs/InputsTypes';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import WysiwygInput from '@/components/Inputs/WysiwygInput/WysiwygInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		TextInput,
		WysiwygInput,
	},
})
export default class MailTemplate extends Vue {
	protected subjectConfig: InputConfig = {
		label: 'Objet du mail',
		multiple: false,
	};

	protected bodyConfig: InputConfig = {
		label: 'Corps du mail',
	};
}
</script>

<style lang="scss" scoped>

</style>
