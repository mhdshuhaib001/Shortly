import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  auth: {
    async login(googleToken) {
      try {
        const response = await api.post("/api/auth/google", {
          token: googleToken
        });
        console.log(response);
        localStorage.setItem("token", response.data.token);
        return response;
      } catch (error) {
        throw error.response?.data?.error || "Login failed";
      }
    },

    async verifyToken() {
      try {
        const response = await api.get("/api/auth/verify");

        return response.data;
      } catch (error) {
        throw error.response?.data?.error || "Veryify failed";
      }
    },
    logout() {
      localStorage.removeItem("token");
    }
  },

  urls: {
    async create({ longUrl, customAlias, topic }) {
      try {
        const response = await api.post("/api/url/shorten", {
          longUrl,
          customAlias,
          topic
        });
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || "Failed to create short URL";
      }
    },
    async getStats(urlId) {
      try {
        const response = await api.get(`/api/url/stats/${urlId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || "Failed to get URL stats";
      }
    },

    async getList({ page = 1, limit = 10 }) {
      try {
        const response = await api.get(
          `/api/url/list?page=${page}$limit=${limit}`
        );
        console.log("Response:", response);
        return {
          data: response.data.data,
          pagination: response.data.pagination
        };
      } catch (error) {
        throw error.response?.data?.error || "Failed to fetch URLs";
      }
    },
    async getStats(urlId) {
      try {
        const response = await api.get(`/api/url/stats/${urlId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || "Failed to get URL stats";
      }
    },
    async getList({ page = 1, limit = 10 }) {
      try {
        const response = await api.get(
          `/api/url/list?page=${page}&limit=${limit}`
        );
        return {
          data: response.data.data,
          pagination: response.data.pagination
        };
      } catch (error) {
        throw error.response?.data?.error || "Failed to fetch URLs";
      }
    }
  },
  analytics: {
    async getOverall() {
      try {
        const response = await api.get("/api/analytics/overall");
        return response;
      } catch (error) {
        throw (
          error.response?.data?.error || "Failed to fetch overall analytics"
        );
      }
    }
  }
};

export default apiService;
