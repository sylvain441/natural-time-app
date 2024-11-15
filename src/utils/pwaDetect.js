export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone || // for iOS
    document.referrer.includes('android-app://')
  )
}
