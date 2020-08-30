const axios = require('axios')

export default class HttpClient {
    constructor(properties = {}) {
        this.logger = properties.logger || console
        this.client = properties.client || axios
        this.baseURL = properties.baseURL
    }

    async get(url, config) {
        return await this.request({
            ...config,
            url,
            method: 'GET',
        })
    }

    async request(options = {}) {
        try {
            const baseURL = options.baseURL || this.baseURL
            this.logger.log('Http Request. ', baseURL, options.url)
            this.logger.log(options)
            const response = await this.client({
                baseURL,
                method: options.method,
                url: options.url,
                data: options.data,
                params: options.params,
            })
            this.logger.log('Http Request finished. ', options.url)
            const dataAsString = response.data
                && Object.is(response.data.__proto__, String.prototype)
            if (dataAsString) {
                this.logger.log(response.data.substring(0, 1000))
            } else {
                this.logger.log(response.data)
            }
            this.logger.log(response.status)
            this.logger.log(response.statusText)
            this.logger.log(response.headers)
            return response.data
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }
}