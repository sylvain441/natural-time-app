export default ({delay = 400, interval = 50}) => ({
  beforeMount(el, binding, vNode, prevVnode) 
  {
    if (typeof binding.value !== 'function') {
      const compName = vNode.context.name
      let warn = `[longclick:] provided expression '${binding.expression}' is not a function, but has to be`
      if (compName) { warn += `Found in component '${compName}' ` }
      console.warn(warn) // eslint-disable-line
    }

    let pressTimer = null
    let pressInterval = null

    // Run Function
    const handler = (e) => {
      binding.value(e)
    }

    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }

      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          if (interval && interval > 0) {
            pressInterval = setInterval(() => {
              handler(e)
            }, interval)
          }
          handler(e)
        }, delay)
      }
    }

    // Cancel Timeout
    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
      if (pressInterval) {
        clearInterval(pressInterval)
        pressInterval = null
      }
    }

    ;['mousedown', 'touchstart'].forEach(e => {
      el.addEventListener(e, start, { passive: true })
    })

    ;['click', 'mouseout', 'touchend', 'touchcancel'].forEach(e => {
      el.addEventListener(e, cancel, { passive: true })
    })
    
    // Store references for cleanup
    el.__longclick__ = { start, cancel }
  }
  ,
  created() {}, // new
  mounted() {},
  beforeUpdate() {}, // new
  updated() {},
  beforeUnmount(el) {
    // Ensure timers are cleared if the element unmounts mid-press
    try { el.__longclick__?.cancel?.() } catch (e) {}
  }, // new
  unmounted(el) {
    // Remove all listeners to avoid leaks
    if (el && el.__longclick__) {
      const { start, cancel } = el.__longclick__
      ;['mousedown', 'touchstart'].forEach(e => {
        el.removeEventListener(e, start)
      })
      ;['click', 'mouseout', 'touchend', 'touchcancel'].forEach(e => {
        el.removeEventListener(e, cancel)
      })
      delete el.__longclick__
    }
  }
})
