import CategoryService from '@/services/CategoryService'

export default {
  namespaced: true,
  state: {
    categories: []
  },
  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    }
  },
  actions: {
    fetchCategories({ commit }) {
      return CategoryService.fetchAll().then(response => {
        let categories = response.data
        for (
          let categoryIndex = 0;
          categoryIndex < categories.length;
          categoryIndex++
        ) {
          let category = categories[categoryIndex]
          for (
            let productIndex = 0;
            productIndex < category.Products.length;
            productIndex++
          ) {
            let product = category.Products[productIndex]
            product.instanceId = product.id
          }
        }

        commit('SET_CATEGORIES', response.data)

        return response
      })
    }
  },
  getters: {
    categories: state => {
      return state.categories
    }
  }
}
