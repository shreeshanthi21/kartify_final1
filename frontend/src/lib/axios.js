import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:5000/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000, // 5 second timeout
});

// To prevent race conditions during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

// List of URLs that should not trigger token refresh
const noRefreshUrls = [
	'/auth/refresh-token',
	'/auth/login',
	'/auth/signup',
	'/auth/logout'
];

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Don't attempt refresh if:
		// 1. Not a 401 error
		// 2. Request has already been retried
		// 3. URL is in the noRefresh list
		// 4. No response from server (network error)
		if (
			error.response?.status !== 401 ||
			originalRequest._retry ||
			noRefreshUrls.some(url => originalRequest.url.includes(url)) ||
			!error.response
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		if (isRefreshing) {
			try {
				await new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				});
				return instance(originalRequest);
			} catch (err) {
				return Promise.reject(err);
			}
		}

		isRefreshing = true;

		try {
			await instance.post("/auth/refresh-token");
			processQueue(null);
			return instance(originalRequest);
		} catch (refreshError) {
			processQueue(refreshError);
			// Only redirect to login for auth errors on refresh
			if (refreshError.response?.status === 401) {
				window.location.href = "/login";
			}
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	}
);

export default instance;
