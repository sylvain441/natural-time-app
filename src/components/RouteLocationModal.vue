<template>
	<transition name="fade">
		<div v-if="contextStore.routeLocationChanged"
			class="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div class="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
				<div class="p-5">
					<p class="text-base font-bold text-gray-900 mb-2">
						{{ $t(`${i18nNamespace}.title`) }}
					</p>
					<p class="text-sm text-gray-700 mb-4">
						{{ $t(`${i18nNamespace}.description`) }}
					</p>
					<div class="space-y-3 mb-4">
						<div :class="['rounded-md border p-3', highlightClasses]">
							<p class="text-xs font-bold uppercase text-slate-500 mb-1">
								{{ $t(`${i18nNamespace}.linkLabel`) }}
							</p>
							<p class="text-sm text-gray-900">
								<span class="font-semibold">{{ routeLocationLabel }}</span>
								<span class="text-slate-500 ml-1">({{ routeLocationLongitudeString }})</span>
							</p>
						</div>
						<div class="rounded-md border border-slate-200 bg-slate-50 p-3">
							<p class="text-xs font-bold uppercase text-slate-500 mb-1">
								{{ $t(`${i18nNamespace}.savedLabel`) }}
							</p>
							<p class="text-sm text-gray-900">
								<span class="font-semibold">{{ storedLocationLabel }}</span>
								<span v-if="storedLocationLongitudeString" class="text-slate-500 ml-1">({{ storedLocationLongitudeString }})</span>
							</p>
						</div>
					</div>
					<div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
						<button @click="keepStoredRouteLocation"
							class="bg-slate-100 text-black text-xs py-2 px-3 rounded transition duration-200 ease-in-out hover:bg-slate-200">
							{{ $t(`${i18nNamespace}.keepSavedButton`) }}
						</button>
						<button @click="saveRouteLocation"
							:class="['text-black text-xs font-bold py-2 px-3 rounded transition duration-200 ease-in-out', acceptButtonClasses]">
							{{ $t(`${i18nNamespace}.updateButton`) }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NaturalDate } from 'natural-time-js';
import { useContextStore } from '../stores/contextStore';

const props = defineProps({
	// i18n key prefix for this modal's strings (e.g. 'clock.notifications.routeLocation')
	i18nNamespace: { type: String, required: true },
	// Tailwind classes for the highlighted "link location" card border/background
	highlightClasses: { type: String, default: 'border-nt-yellow-light bg-nt-yellow-light/20' },
	// Tailwind classes for the primary "accept" button background
	acceptButtonClasses: { type: String, default: 'bg-nt-yellow-light hover:bg-nt-yellow-lighter' },
});

const contextStore = useContextStore();
const route = useRoute();
const router = useRouter();

const LOCATION_QUERY_KEYS = ['lat', 'latitude', 'lon', 'lng', 'long', 'longitude', 'location', 'place'];

const formatCoordinates = (latitude, longitude) =>
	`lat: ${Number(latitude).toFixed(2)} long: ${Number(longitude).toFixed(2)}`;

const routeLocationLabel = computed(() =>
	contextStore.routeLocation || formatCoordinates(contextStore.routeLatitude, contextStore.routeLongitude)
);

const routeLocationLongitudeString = computed(() => {
	if (contextStore.routeLongitude == null) return '';
	return new NaturalDate(Date.now(), contextStore.routeLongitude).toLongitudeString();
});

const hasStoredLocation = computed(() =>
	contextStore.storedLatitude != null && contextStore.storedLongitude != null
);

const storedLocationLabel = computed(() =>
	contextStore.storedLocation || formatCoordinates(contextStore.storedLatitude, contextStore.storedLongitude)
);

const storedLocationLongitudeString = computed(() => {
	if (!hasStoredLocation.value) return '';
	return new NaturalDate(Date.now(), contextStore.storedLongitude).toLongitudeString();
});

const stripLocationQuery = () => {
	const query = { ...route.query };
	for (const key of LOCATION_QUERY_KEYS) delete query[key];
	router.replace({ query });
};

const saveRouteLocation = () => {
	contextStore.acceptRouteLocation();
	stripLocationQuery();
};

const keepStoredRouteLocation = () => {
	contextStore.clearRouteLocation();
	stripLocationQuery();
};
</script>
