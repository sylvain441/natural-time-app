<template>
	<div class="flex flex-col h-full">
		<h4 class="section-header border-nt-yellow-light flex flex-row items-center justify-between">
			<span>Paramètres d'affichage</span>
		</h4>
		<div class="px-6 py-3">
			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700">Afficher les graduations</span>
				<ToggleButton v-model="clockShowGraduations" class="bg-nt-yellow-light" />
			</div>
			<p class="text-xs text-gray-400 mt-1">Désactiver cette option pour épurer le design du cadran.</p>

			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700">Afficher le nom du lieu</span>
				<ToggleButton v-model="clockShowTitle" class="bg-nt-yellow-light" />
			</div>
			<p class="text-xs text-gray-400 mt-1">Désactiver pour masquer le titre en bas de l'horloge.</p>
		</div>
		<h4 class="section-header border-nt-yellow-light flex flex-row items-center justify-between">
			<span>Performances</span>
		</h4>
		<div class="px-6 py-3">
			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700">Afficher les animations</span>
				<ToggleButton v-model="clockShowAnimations" class="bg-nt-yellow-light" />
			</div>
			<p class="text-xs text-gray-400 mt-1">Désactiver cette option retire certains éléments de l'interface pour améliorer les performances d'affichage (lune, soleil, animations).</p>
		</div>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/stores/configStore';
import ToggleButton from '@/components/ToggleButton.vue';

const configStore = useConfigStore();
const { clockShowGraduations, clockShowAnimations, clockShowTitle } = storeToRefs(configStore);
</script>