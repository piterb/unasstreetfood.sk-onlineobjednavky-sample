function initNotification() {
  return {
    key: null,
    type: null,
    message: null,
    timeout: null,
    icon: null,
    top: null
  }
}

export default {
  namespaced: true,
  state: {
    notification: initNotification(),
    cleared: []
  },
  mutations: {
    SET(state, notification) {
      state.notification = notification
    },
    CLEAR(state) {
      state.notification = initNotification()
    },
    PERSIST(state) {
      let notificationIndex = -1
      if (
        (notificationIndex =
          state.cleared.findIndex(n => n.key == state.notification.key) == -1)
      ) {
        state.cleared.push(state.notification)
      } else {
        state.cleared[notificationIndex] = state.notification
      }
    }
  },
  actions: {
    success({ dispatch }, options) {
      options = typeof options === 'string' ? { message: options } : options
      dispatch('create', {
        ...options,
        type: 'success',
        icon: 'mdi-check-circle'
      })
    },
    info({ dispatch }, options) {
      options = typeof options === 'string' ? { message: options } : options
      dispatch('create', {
        ...options,
        type: 'info',
        icon: 'mdi-information'
      })
    },
    warning({ dispatch }, options) {
      options = typeof options === 'string' ? { message: options } : options
      dispatch('create', {
        ...options,
        type: 'warning',
        icon: 'mdi-exclamation'
      })
    },
    error({ dispatch }, options) {
      options = typeof options === 'string' ? { message: options } : options
      dispatch('create', {
        ...options,
        type: 'error',
        icon: 'mdi-alert'
      })
    },
    create(
      { state, commit },
      { type, icon, message, top = false, key = null, timeout = 30000 }
    ) {
      if (state.notification.key) {
        commit('PERSIST')
      }
      commit('SET', {
        key: key,
        type: type,
        message: message,
        timeout: timeout,
        icon: icon,
        top: top
      })
    },
    clear({ state, commit }) {
      if (state.notification.key) {
        commit('PERSIST')
      }
      commit('CLEAR')
    }
  },
  getters: {
    notification: state => {
      return state.notification
    },
    appeared: state => key => {
      return state.notification.key === key
        ? state.notification
        : state.cleared.find(n => n.key === key)
    }
  }
}
