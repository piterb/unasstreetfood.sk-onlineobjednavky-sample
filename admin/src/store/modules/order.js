import OrderService from '@/services/OrderService'

export default {
  namespaced: true,
  state: {
    orders: []
  },
  mutations: {
    SET_ORDERS(state, orders) {
      state.orders = orders
    }
  },
  actions: {
    fetchOrders({ commit }, period) {
      return OrderService.fetchAllByPeriod(period).then(response => {
        commit('SET_ORDERS', response.data)
      })
    }
  },
  getters: {
    orders: state => {
      return state.orders
    },
    total: state => {
      if (state.orders.length > 0) {
        return state.orders.reduce((total, order) => {
          return total + order.total
        }, 0)
      } else {
        return 0
      }
    },
    min: state => {
      return state.orders.length > 0
        ? Math.min(...state.orders.map(o => o.total))
        : 0
    },
    max: state => {
      return state.orders.length > 0
        ? Math.max(...state.orders.map(o => o.total))
        : 0
    },
    sortByTotal: state => {
      let sorted = JSON.parse(JSON.stringify(state.orders))
      sorted.sort((a, b) => {
        return a.total < b.total ? -1 : a.total > b.total ? 1 : 0
      })

      return sorted
    },
    top5orders: (state, getters) => {
      return getters.sortByTotal.reverse().slice(0, 5)
    },
    sortByTotalCumulative: state => {
      let orders = JSON.parse(JSON.stringify(state.orders))

      let countorders = []
      for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
        let order = orders[orderIndex]
        let countorder = countorders.find(
          o => o.userSnapshot.id == order.userSnapshot.id
        )
        if (countorder) {
          countorder.cumulative = countorder.cumulative + order.total
        } else {
          countorders.push({ ...order, cumulative: order.total })
        }
      }

      countorders.sort((a, b) => {
        return a.cumulative < b.cumulative
          ? -1
          : a.cumulative > b.cumulative
          ? 1
          : 0
      })

      return countorders
    },
    top5customers: (state, getters) => {
      return getters.sortByTotalCumulative.reverse().slice(0, 5)
    },
    sortByItemsCount: state => {
      let orders = JSON.parse(JSON.stringify(state.orders))
      let orderitems = orders.map(o => o.OrderItems).flat()

      let countitems = []
      for (
        let orderItemIndex = 0;
        orderItemIndex < orderitems.length;
        orderItemIndex++
      ) {
        let orderitem = orderitems[orderItemIndex]
        let countitem = countitems.find(
          ci => ci.productSnapshot.id == orderitem.productSnapshot.id
        )
        if (countitem) {
          countitem.count = countitem.count + orderitem.qty
        } else {
          countitems.push({ ...orderitem, count: orderitem.qty })
        }
      }

      countitems.sort((a, b) => {
        return a.count < b.count ? -1 : a.count > b.count ? 1 : 0
      })

      return countitems
    },
    top5items: (state, getters) => {
      return getters.sortByItemsCount.reverse().slice(0, 5)
    }
  }
}
