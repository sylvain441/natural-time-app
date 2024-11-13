<template>
	<div class="flex flex-col h-full">
		<h4 class="section-header border-nt-cyan-light flex flex-row items-center justify-between">
			<span>Affichage</span>
		</h4>
		<div class="px-6 py-3">
			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700">Afficher les graduations</span>
				<ToggleButton v-model="spiralShowDaysNumber" class="bg-nt-cyan-light" />
			</div>
			<p class="text-xs text-gray-400 mt-1">Affiche les numéros des jours sur la spirale (sur tablette et ordinateur seulement).</p>

			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700">Afficher la légende</span>
				<ToggleButton v-model="spiralShowTitle" class="bg-nt-cyan-light" />
			</div>
			<p class="text-xs text-gray-400 mt-1">Affiche le nom du lieu et le temps naturel en bas de l'écran.</p>
		</div>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/stores/configStore';
import ToggleButton from '@/components/ToggleButton.vue';

const configStore = useConfigStore();
const { spiralShowTitle, spiralShowDaysNumber } = storeToRefs(configStore);
</script>