<template lang="pug">
	#results-videos-user.container.fluid
		p.h4
			span.emoticon
			strong
				| {{ user.gender ? (user.gender === "Homme" ? '👨' : '👩') : '' }} {{ user.firstName || '' }} {{ user.lastName || '' }}
			span.id
				| {{ user.id }}
			router-link(
				id="edit-link"
				:to="{ name: 'tester edition', params: { id: userId } }"
				v-if="allowedTesterEdit"
			)
				icon(edit)
		.grid
			.column
				h5
					| {{ $t('Informations testeur') }}
				div
					| {{ $t('Genre') }} :
					strong
						| {{ ` ${user.gender || '?'}` }}
				div
					| {{ $t('Âge') }} :
					strong
						| {{ ` ${user.age || '?'}` }} {{ $t('ans') }} ({{ getBirthYear(user.age) || '?' }})
			.column
				h5
					| {{ $t('User agent') }}
				div
					| {{ $t('Navigateur') }} :
					strong
						| {{ ` ${getBrowserInfos() || $t('information indisponible')}` }}
				div
					| {{ $t('Appareil') }} :
					strong
						| {{ ` ${getDeviceInfos() || $t('information indisponible')}` }}
				div
					| {{ $t('Machine') }} :
					strong
						| {{ ` ${getEngineInfos() || $t('information indisponible')}` }}
				div
					| {{ $t('OS') }} :
					strong
						| {{ ` ${getOsInfos() || $t('information indisponible')}` }}
</template>

<script lang="ts">
import UserUtils from '@/services/UserUtils';
import {
	RetrievedUser,
	RetrievedUserAgent,
} from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosDetailTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ResultsVideosUser extends Vue {
	@Prop() private user!: RetrievedUser;
	@Prop() private userAgent!: RetrievedUserAgent;

	private userId: string = '';
	private allowedTesterEdit: boolean = false;

	private getBirthYear(age: number): number {
		const currentYear: number = new Date().getFullYear();
		return currentYear - age;
	}

	private getBrowserInfos(): string | undefined {
		if (!this.userAgent.browser) return undefined;

		if (this.userAgent.browser.name) {
			return `${this.userAgent.browser.name} ${
				this.userAgent.browser.version || ''
			}`;
		}
	}

	private getDeviceInfos(): string | undefined {
		if (!this.userAgent.device) return undefined;

		if (this.userAgent.device.manufacturer) {
			return `${this.userAgent.device.manufacturer} ${
				this.userAgent.device.model || ''
			}  ${this.userAgent.device.subtype || ''} ${
				this.userAgent.device.type || ''
			}`;
		}
	}

	private getEngineInfos(): string | undefined {
		if (!this.userAgent.engine) return undefined;

		if (this.userAgent.engine.name) {
			return `${this.userAgent.engine.name} ${
				this.userAgent.engine.version || ''
			}`;
		}
	}

	private getOsInfos(): string | undefined {
		if (!this.userAgent.os) return undefined;

		if (this.userAgent.os.name) {
			let osVersion: string | undefined;

			if (this.userAgent.os.version)
				if (this.userAgent.os.version.hasOwnProperty('value'))
					osVersion = `${
						(
							this.userAgent.os.version as {
								value: string;
							}
						).value
					}`;
				else osVersion = this.userAgent.os.version as string;

			return `${this.userAgent.os.name} ${osVersion || ''} ${
				this.userAgent.os.alias || ''
			}`;
		}
	}

	private async created(): Promise<void> {
		this.allowedTesterEdit =
			await UserUtils.instance.currentUserHasPermission(
				'result/workboard/usertesting/edit'
			);

		this.userId = this.user.id.toString();
	}
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.h4 {
	#edit-link {
		vertical-align: bottom;

		i.icon.edit {
			font-size: .9em;
		}
	}
}
</style>
