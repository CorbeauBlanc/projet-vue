<template>
	<div class="six wide column">
		<div class="segments stretched">
			<div class="segment header">Testez Testapic !</div>
			<div class="segment">
				<p>
					Nous menons régulièrement des tests sur notre outil pour
					l'améliorer. Voici les tests en cours auxquels vous pouvez
					répondre :
				</p>
				<ul class="links icon rocket">
					<li>
						<a>Tri de carte sur les rubriques du menu principal</a>
					</li>
					<li>
						<a>Manipulation des graphiques</a>
					</li>
					<li>
						<a>Evaluation de la page "ciblage"</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class HomeTestapicTests extends Vue {}
</script>
