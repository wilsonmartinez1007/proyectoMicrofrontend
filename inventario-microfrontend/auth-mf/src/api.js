import axios from "axios";

const API_URL = "http://localhost:8000";

// instancia para TODAS las peticiones que requieren token
const api = axios.create({
  baseURL: `${API_URL}/api`,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Login ----------
export async function login(username, password) {
  const response = await axios.post(`${API_URL}/api/token/`, {
    username,
    password,
  });
  return response.data;
}
// ---------- REGISTER ----------
export async function register(username, password) {
  const response = await axios.post(`${API_URL}/api/register/`, {
    username,
    password,
  });
  return response.data;
}

// ---------- COMPRAS ----------
export async function getCompras() {
  const response = await api.get("/compras/"); 
  return response.data;
}

export async function crearCompra(data) {
  const response = await api.post("/compras/", data);
  return response.data;
}

export async function actualizarCompra(id, data) {
  const response = await api.put(`/compras/${id}/`, data); 
  return response.data;
}

export async function eliminarCompra(id) {
  await api.delete(`/compras/${id}/`); 
}

export async function cambiarEstadoCompra(id, estado) {
  const response = await api.patch(`/compras/${id}/estado/`, { estado }); 
  return response.data;
}
