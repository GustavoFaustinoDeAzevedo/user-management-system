import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      const res = await axios.post('http://localhost:3000/users/refresh', {
        refreshToken,
      });

      const newToken = res.data.accessToken;

      setAccessToken(newToken);

      error.config.headers.Authorization = `Bearer ${newToken}`;

      return axios(error.config);
    }

    return Promise.reject(error);
  },
);
