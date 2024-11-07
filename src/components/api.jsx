import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5005/api", // URL cơ sở cho các yêu cầu
  // baseURL: "https://ipays.vn/api", // URL cơ sở cho các yêu cầu
});

// Thêm request interceptor để ghi lại thời gian bắt đầu
api.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() }; // Ghi lại thời gian bắt đầu
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm response interceptor để ghi lại thời gian kết thúc và tính toán thời gian xử lý
api.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime; // Tính thời gian xử lý
    console.log(`Request to ${response.config.url} took ${duration} ms`);
    return response;
  },
  (error) => {
    const endTime = new Date();
    const duration = endTime - error.config.metadata.startTime; // Tính thời gian xử lý
    console.error(`Request to ${error.config.url} fails took ${duration} ms`);
    return Promise.reject(error);
  }
);

// Hàm GET kèm theo token
const get = async (url, token) => {
  try {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};
// Hàm GET kèm theo token
const gets = async (url, headers) => {
  try {
    const response = await api.get(url, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

// Hàm POST kèm theo token
const post = async (url, data, token) => {
  try {
    const response = await api.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};

// Hàm PATCH kèm theo token
const patch = async (url, data, token) => {
  try {
    const response = await api.patch(url, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error patching data", error);
    throw error;
  }
};

// Hàm DELETE kèm theo token
const deleteRequest = async (url, token) => {
  try {
    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting data", error);
    throw error;
  }
};

const random = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
// Xuất các phương thức
export default {
  get,
  gets,
  post,
  patch,
  delete: deleteRequest,
  random: random,
};
