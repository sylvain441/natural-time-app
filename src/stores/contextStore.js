import { defineStore } from 'pinia'

export const useContextStore = defineStore('context', {
  state: () => ({
    latitude: null,
    longitude: null,
    location: '',
    currentTime: new Date(),
    timer: null,
  }),
  
  getters: {
    //coordinates: (state) => `${state.latitude},${state.longitude}`,
    //formattedTime: (state) => state.currentTime.toLocaleTimeString(),
    //formattedDate: (state) => state.currentTime.toLocaleDateString(),
  },
  
  actions: {
    setCoordinates(lat, lng) {
      localStorage.latitude = this.latitude = Math.max(-90, Math.min(90, parseFloat(lat)));
      localStorage.longitude = this.longitude = ((parseFloat(lng) + 180) % 360) - 180;
    },
    setLocation(location) {
      this.location = location;
      localStorage.location = location;
    },
    initialize() {
      // Get data from localStorage
      this.latitude = parseFloat(localStorage.latitude) || 42.42;
      this.longitude = parseFloat(localStorage.longitude) || 0;
      this.location = localStorage.location || '';
      // Update timer
      this.timer = setInterval(() =>  this.currentTime = new Date(), 1200)
    },
    terminate() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
})