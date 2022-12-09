<template>
	<div class="container">
		<div class="segment empty state">
			<icon affectations huge />
			<h4 class="h4 content">{{ $t('Accès non autorisé') }}</h4>
			<p class="content">
				{{
					$t(
						"Vous n'êtes pas habilité à accéder à cette page sans autorisation."
					)
				}}
			</p>
			<div class="content">
				<div>
					{{
						$t(
							"Pour étendre vos droits, merci de contactez l'équipe Testapic"
						)
					}}
				</div>
				<div>
					<a href="mailto:info@testapic.com">info@testapic.com</a> /
					+33 (0)1 47 00 92 86
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Error403 extends Vue {}
</script>
