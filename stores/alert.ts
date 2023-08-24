import { defineStore } from 'pinia'

export interface Alert {
  text: string,
  severity: string
}

const ALERT_TIMEOUT = 5000

export const useAlertStore = defineStore('alert', () => {
  const alert = ref<Alert | null>(null)

  const showAlert = (newAlert: Alert) => {
    alert.value = newAlert;
    setTimeout(() => {
      alert.value = null;
    }, ALERT_TIMEOUT);
  }

  return {
    alert,
    showAlert
  }
})
