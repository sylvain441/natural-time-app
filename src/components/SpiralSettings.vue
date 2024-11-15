<template>
	<div class="flex flex-col h-full">
		<h4 class="section-header border-nt-cyan-light flex flex-row items-center justify-between dark:border-nt-cyan-dark">
			<span class="dark:text-white">Affichage</span>
		</h4>
		<div class="px-6 py-3">
			<div class="flex items-center justify-between mt-4">
				<span class="text-sm font-medium text-gray-700 dark:text-gray-200">Afficher le nom du lieu</span>
				<ToggleButton v-model="spiralShowTitle" class="bg-nt-cyan-light dark:bg-nt-cyan-dark" />
			</div>
			<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Affiche le nom du lieu et le temps naturel en bas de l'écran.</p>
		</div>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/stores/configStore';
import ToggleButton from '@/components/ToggleButton.vue';

const configStore = useConfigStore();
const { spiralShowTitle } = storeToRefs(configStore);
</script>