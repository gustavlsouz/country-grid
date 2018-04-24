import axios from 'axios'

const defaultOptions = {
	baseURL: `https://restcountries.eu/rest/v2`,
	timeout: 5000,
	headers: {}
}

const requests = (options) => {

	options = Object.assign({}, defaultOptions, options)

	const axiosInstance = axios.create(options);
	
	return axiosInstance
}

export default requests