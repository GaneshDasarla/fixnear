import config from "../config";

const api = {
  getProviders: async () => {
    const response = await fetch(`${config.API_BASE}/providers`);
    return response.json();
  }
};

export default api;
