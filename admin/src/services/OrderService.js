import axios from 'axios'
import { loggedIn, token, logout } from '@/utils/auth.js'

export default {
  apiClient() {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    if (loggedIn()) {
      headers.Authorization = 'Bearer ' + token()
    }

    const apiClient = axios.create({
      baseURL: process.env.VUE_APP_BACKEND_BASE_URL,
      withCredentials: false, // This is the default
      headers: headers,
      timeout: process.env.VUE_APP_BACKEND_TIMEOUT
    })

    apiClient.interceptors.response.use(
      response => {
        return response
      },
      error => {
        if (error.response && error.response.status === 401) {
          logout()
        }

        return Promise.reject(error)
      }
    )

    return apiClient
  },
  fetchAllByPeriod(period) {
    return this.apiClient().get('/admin/orders/' + period)
  }
}
