import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
    baseURL: API_URL,
    headers:{
        'Content-Type': 'application/json'
    }
})

//Interceptor - Añade el token JWT automáticamente a cada petición
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


// Interceptor de respuesta — renueva el token automáticamente
api.interceptors.response.use(
  response => {
    // Renovar token si quedan menos de 10 minutos
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiresIn = payload.exp - Math.floor(Date.now() / 1000)
      if (expiresIn < 600) {
        api.post('/auth/refresh').then(res => {
          localStorage.setItem('token', res.data.access_token)
        }).catch(() => {})
      }
    }
    return response
  },
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)


//Auth
export const register = (email, password) =>
    api.post('/auth/register', {email, password })


export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', response.data.access_token)
    return response
}


export const logout = () => {
    localStorage.removeItem('token')
}


export const isAuthenticated = () => {
    return !!localStorage.getItem('token')
}


//CVs
export const getCVs = () =>
    api.get('/cv')


export const getCV = (id) =>
    api.get(`/cv/${id}`)


export const createCV = (data) =>
    api.post('/cv', data)


export const updateCV = (id, data) =>
    api.put(`/cv/${id}`)


export const deleteCV = (id) =>
    api.delete(`/cv/${id}`)


export const downloadPDF = async (id) => {
    const response = await api.get(`/cv/${id}/pdf`,{
        responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `cv_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

export default api