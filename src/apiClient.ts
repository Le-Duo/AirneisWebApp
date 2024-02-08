import axios from 'axios'

const apiClient = axios.create({
  // Explicitly set baseURL for testing purposes. Remember to adjust this before deploying to production.
  baseURL: 'https://airneisservices.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    if (localStorage.getItem('userInfo'))
      config.headers.Authorization = `Bearer ${
        JSON.parse(localStorage.getItem('userInfo')!).token
      }`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient
