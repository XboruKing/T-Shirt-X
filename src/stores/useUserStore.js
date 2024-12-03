import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
import { useCartStore } from "./useCartStore";

export const useUserStore = create((set , get) => ({
    user: null,
    orders: null,
    loading:false,
    checkingAuth:true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword){
            set({ loading: false });
           return toast.error("Passwords do not match");
        }

        try {
             const res = await axios.post("/auth/signup", { name, email, password });
             set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");

        }
    },
    login: async ({ email, password }) => {
        set({ loading: true });

        try {
             const res = await axios.post("/auth/login", {  email, password });
             set({ user: res.data, loading: false });
             useCartStore.getState().getCartItems();
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");

        }
    },
    logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},
    // checkAuth: async () => {
	// 	set({ checkingAuth: true });
	// 	try {
	// 		const response = await axios.get("/auth/profile");
	// 		set({ user: response.data, checkingAuth: false });
	// 	} catch (error) {
	// 		console.log(error.message);
	// 		set({ checkingAuth: false, user: null });
	// 	}
	// },
    getOrders: async () => {
		set({loading: true});
		try {
			const response = await axios.get("/auth/orders");
			set({ orders: response.data.orders , loading: false });
		} catch (error) {
			console.log(error.message);
			set({ loading: false });
		}
	},
    updateImage: async ({image}) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/auth/update-image-user`, { image });
            set({ message: response.data.message, loading: false });
            toast.success(response.data.message || "Success");
            return response.data; // Return the entire response data
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error updating image";
            set({
                loading: false,
            });
            toast.error(errorMessage || "An error occurred");
            console.error('Error in updateImage:', error.response?.data || error.message);
            throw new Error(errorMessage);
        }
    },
    UpdateProfileUser: async ({ name , email }) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/auth/UpdateProfileUser`, { name , email });
            set({ message: response.data.message, loading: false });
            toast.success(response.data.message || "Success");
            return response.data; // Return the entire response data
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error updating image";
            set({
                loading: false,
            });
            toast.error(errorMessage || "An error occurred");
            console.error('Error in updateImage:', error.response?.data || error.message);
            throw new Error(errorMessage);
        }
    },
    checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

 


// Axios interceptor for token refresh
let isRefreshing = false;
let refreshSubscribers = [];

const addRefreshSubscriber = (callback) => {
	refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
};

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					addRefreshSubscriber((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						resolve(axios(originalRequest));
					});
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const newToken = await useUserStore.getState().refreshToken();
				onRefreshed(newToken);
				return axios(originalRequest);
			} catch (refreshError) {
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(error);
	}
);

