<template>
	<view-root>
		<template #heading>
			<h2 class="title">
				<router-link :to="{ name: 'results' }">
					<icon long arrow left />Résultats
				</router-link>
				<span class="separator">
					<icon chevron right />
				</span>
				<span class="last"
					>{{ editMode ? 'Éditer' : 'Créer' }} un groupe de
					résultats</span
				>
			</h2>
		</template>
		<template #content>
			<div class="text container">
				<div class="segments">
					<div class="segment">
						<div class="grid stackable">
							<text-input
								class="twelve wide column required"
								:config="groupNameInput"
							/>
							<datalist-input
								class="twelve wide column required"
								:config="testsInput"
								v-model="tests"
							/>
							<radios-input
								class="twelve wide column required"
								:config="statusInput"
								v-model="statusValue"
							/>
						</div>
					</div>
					<div class="segment">
						<div class="tabs">
							<div class="menu">
								<tab name="first" v-master="currentTab"
									>Problématique</tab
								>
								<tab name="second" v-master="currentTab"
									>Objectifs</tab
								>
							</div>
							<div class="tab" v-show="currentTab === 'first'">
								<!-- <ckeditor
									:editor="defaultTabEditor.editor"
									:config="defaultTabEditor.config"
									v-model="firstTabEditorContent"
								/> -->
							</div>
							<div class="tab" v-show="currentTab === 'second'">
								<!-- <ckeditor
									:editor="defaultTabEditor.editor"
									:config="defaultTabEditor.config"
									v-model="secondTabEditorContent"
								/> -->
							</div>
						</div>
					</div>
					<div class="segment">
						<button class="button">
							{{ editMode ? 'Enregistrer' : 'Créer' }}
						</button>
					</div>
				</div>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Tab from '@/components/Tab/Tab.vue';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
/* import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/fr';
import CKEditor from '@ckeditor/ckeditor5-vue'; */
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		TextInput,
		DatalistInput,
		RadiosInput,
		Tab,
	},
})
export default class ResultsGroup extends Vue {
	protected editMode: boolean = false;
	protected groupId: string = '';

	/* protected defaultTabEditor: any = {
		editor: ClassicEditor,
		config: {
			removePlugins: ['Heading', 'ImageUpload', 'MediaEmbed'],
			toolbar: [
				'bold',
				'italic',
				'|',
				'bulletedList',
				'numberedList',
				'|',
				'link',
				'blockQuote',
				'insertTable',
				'|',
				'undo',
				'redo',
			],
			language: 'fr',
		},
	}; */

	protected firstTabEditorContent: string = '';
	protected secondTabEditorContent: string = '';

	protected groupNameInput: InputConfig = {
		placeholder: 'Ex: comparatif à j+30',
		label: 'Nom du groupe de résultats',
	};

	protected testsInput: InputConfig = {
		multiple: true,
		label: 'Tests associés',
		options: [
			{
				text: 'test1',
				value: '1',
			},
			{
				text: 'test2',
				value: '2',
			},
			{
				text: 'test3',
				value: '3',
			},
		],
	};
	protected tests: InputOption[] = [];

	protected statusInput: InputConfig = {
		label: 'Statut',
		options: [
			{
				text: 'En cours',
				value: '1',
			},
			{
				text: 'Terminé',
				value: '2',
			},
			{
				text: 'Abandonné',
				value: '3',
			},
		],
	};
	protected statusValue: string = '';

	protected currentTab: string = 'first';

	private created(): void {
		if (this.$route.params['id']) {
			this.groupId = this.$route.params['id'];
			this.editMode = true;
		}
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

//DEMO
.ck.ck-editor__main>.ck-editor__editable {
	height: 300px;
}

.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused),
.ck .ck-toolbar {
	border-color: $border-color;
	transition: all $normal-speed;
}

.ck.ck-editor__main>.ck-editor__editable.ck-focused {
	border-color: $default-color;
	box-shadow: 0 0 0 $border-width-focused scale-color($default-color, $lightness: 25%);
	transition: all $normal-speed;
}

.ck.ck-toolbar__separator {
	background: $border-color;
}
</style>
