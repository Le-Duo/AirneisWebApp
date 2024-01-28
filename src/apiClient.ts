import axios from 'axios'

const apiClient = axios.create({
  // baseURL sera préfixé à toute URL relative qui suit cette requête axios.get()
  // Si on est en mode développement, on fera des requêtes à 'http://localhost:4000/'
  // Sinon, on fera des requêtes au domaine actuel
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000/' : '/',
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
    Promise.reject(error)
  }
)

export default apiClient
