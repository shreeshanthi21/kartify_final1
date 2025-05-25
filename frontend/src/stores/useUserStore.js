import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

let refreshPromise = null;
let lastAuthCheck = 0;
const AUTH_CHECK_INTERVAL = 5000; // 5 seconds

// Initialize user from localStorage
const getStoredUser = () => {
	try {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	} catch (error) {
		console.error('Error reading from localStorage:', error);
		return null;
	}
};

export const useUserStore = create((set, get) => ({
	user: getStoredUser(),
	loading: false,
	checkingAuth: false,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });
		try {
			if (password !== confirmPassword) {
				throw new Error("Passwords do not match");
			}
			const res = await axios.post("/auth/signup", { name, email, password });
			const userData = res.data;
			localStorage.setItem('user', JSON.stringify(userData));
			set({ user: userData, loading: false });
			toast.success("Account created successfully!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || error.message || "An error occurred");
		}
	},

	login: async (email, password) => {
		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/login", { email, password });
			const userData = response.data;
			localStorage.setItem('user', JSON.stringify(userData));
			set({ user: userData, checkingAuth: false });
			toast.success("Logged in successfully!");
			return userData;
		} catch (error) {
			set({ checkingAuth: false });
			throw error;
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			localStorage.removeItem('user');
			set({ user: null });
		}
	},

	checkAuth: async () => {
		const currentState = get();
		if (currentState.checkingAuth) return;

		const now = Date.now();
		// Only prevent checks if we have a user and checked recently
		if (currentState.user && now - lastAuthCheck < AUTH_CHECK_INTERVAL) {
			return;
		}
		lastAuthCheck = now;

		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			const userData = response.data;
			localStorage.setItem('user', JSON.stringify(userData));
			set({ user: userData, checkingAuth: false });
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.removeItem('user');
				set({ user: null });
			}
			set({ checkingAuth: false });
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;
		set({ checkingAuth: true });

		if (refreshPromise) {
			return refreshPromise;
		}

		try {
			refreshPromise = axios.post("/auth/refresh-token");
			const response = await refreshPromise;
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			console.error("Token refresh error:", error);
			localStorage.removeItem('user');
			set({ user: null, checkingAuth: false });
			throw error;
		} finally {
			refreshPromise = null;
		}
	}
}));