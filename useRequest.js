import {useState, useCallback} from 'react';

export function useRequest() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const request = useCallback(async (endpoint, options = {}, additionalHeaders = {}) => {

		try {
			setLoading(true);

			const headers = new Headers({
				'App-Version': '1.0',
				'Content-Type': 'application/json', ...additionalHeaders
			});
			options = {...options, mode: 'cors', timeout: options.timeout || 10000, headers};

			await new Promise((resolve, reject) => setTimeout(() => resolve(), 500));
			let response = await timeoutPromise(options.timeout, fetch('https://poloniex.com' + endpoint, options));

			if (!response.ok) {
				throw new Error('Strange server error');
			}

			let result;
			try {
				result = await response.json();
			} catch (e) {
				throw new Error('Invalid server response (invalid json)');
			}

			return result;
		} catch (e) {
			console.warn(e);
			setError(false);
			throw e;
		} finally {
			setLoading(false);
		}
	}, []);

	return {loading, error, request}
}

export function timeoutPromise(ms, promise) {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(new Error("Сервер не отвечает"))
		}, ms);
		promise.then(
			(res) => {
				clearTimeout(timeoutId);
				resolve(res);
			},
			(err) => {
				clearTimeout(timeoutId);
				reject(err);
			}
		);
	})
}
