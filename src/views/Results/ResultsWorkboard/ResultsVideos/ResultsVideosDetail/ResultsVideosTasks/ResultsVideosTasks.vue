<template lang="pug">
	.container.fluid#results-videos-tasks
		.segments
			.segment.header
				| {{ $t('Scénario test') }} :
				span.normal
					| {{ '\xa0' }}{{ getUserInfoData('usertitle') }}
					span.id
						|{{ test.id }}
			.segment(v-html="getUserInfoData('scenario')")
		.segments(
			v-for="task in tasks"
			:key="task.id"
		)
			.segment.header
				| {{ $t('Consigne') }} {{ tasks.indexOf(task) + 1 }} -
				span(:class="['normal', 'text', task.success ? 'green' : 'red']")
					| {{ '\xa0' }}{{ task.success ? $t('Réussite') : $t('Échec') }}
				span.normal
					| - {{ $t('Durée') }} : {{ getTaskData(task, 'duration') }}
			.segment(v-html="getTaskData(task, 'instruction')")
</template>

<script lang="ts">
import Languages from '@/services/LanguagesService';
import { RetrievedUserInfo } from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosDetailTypes';
import {
	RetrievedTask,
	RetrievedTestInfos,
	TaskData,
} from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ResultsVideosTasks extends Vue {
	@Prop() private test!: RetrievedTestInfos;
	@Prop() private tasks!: RetrievedTask[];
	@Prop() private userInfo!: RetrievedUserInfo;

	private getUserInfoData(prop: string): string {
		return Languages.getLangData(this.userInfo, prop);
	}

	private getTaskData(task: RetrievedTask, prop: string): string {
		return TaskData.getTaskData(task, prop);
	}
}
</script>

<style lang="scss" scoped>
#results-videos-tasks {
	max-height: 40vh;
	overflow: auto;
}
</style>
