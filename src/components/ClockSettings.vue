<template>
	<div class="flex flex-col h-full">
		<h4 class="section-header border-nt-yellow-light flex flex-row items-center justify-between">
			<span>Affichage</span>
		</h4>
		<div class="px-6 py-3">
			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700">Afficher les graduations</span>
				<ToggleButton v-model="uiShowClockGraduations" class="bg-nt-yellow-light" />
			</div>
			<p class="text-xs text-gray-400 mt-1">Désactiver cette option pour épurer le design de l'horloge.</p>

			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700">Afficher la légende</span>
				<ToggleButton v-model="uiShowClockTitle" class="bg-nt-yellow-light" />
			</div>
			<p class="text-xs text-gray-400 mt-1">Désactiver pour enlever le titre en bas de l'horloge et ne laisser que celle-ci au centre de l'écran.</p>
		</div>
		<h4 class="section-header border-nt-yellow-light flex flex-row items-center justify-between">
			<span>Performances</span>
		</h4>
		<div class="px-6 py-3">
			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700">Afficher les animations</span>
				<ToggleButton v-model="uiShowClockAnimations" class="bg-nt-yellow-light" />
			</div>
			<p class="text-xs text-gray-400 mt-1">Désactiver cette option si l'appareil a des performances d'affichage limitées.</p>
		</div>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/stores/configStore';
import ToggleButton from '@/components/ToggleButton.vue';

const configStore = useConfigStore();
const { uiShowClockGraduations, uiShowClockAnimations, uiShowClockTitle } = storeToRefs(configStore);
</script>