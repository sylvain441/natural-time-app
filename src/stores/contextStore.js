import { defineStore } from 'pinia'

export const useContextStore = defineStore('context', {
  state: () => ({
    storedLatitude: parseFloat(localStorage.latitude),
    storedLongitude: parseFloat(localStorage.longitude),
    storedLocation: localStorage.location,
    currentTime: new Date(),
    timer: null,
  }),
  
  getters: {
    isEmpty: (state) => !state.storedLatitude || !state.storedLongitude,
    latitude: (state) => state.storedLatitude || 42.42,
    longitude: (state) => state.storedLongitude || 0,
    location: (state) => state.storedLocation || '',
  },
  
  actions: {
    init() {
      this.timer = setInterval(() =>  this.currentTime = new Date(), 2400);
    },
    update(latitude, longitude, location) {
      localStorage.latitude = this.storedLatitude = Math.max(-90, Math.min(90, parseFloat(latitude))).toFixed(2);
      localStorage.longitude = this.storedLongitude = (((parseFloat(longitude) + 180) % 360) - 180).toFixed(2);
      localStorage.location = this.storedLocation = location;
    },
  },
})