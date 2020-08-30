class Cache {
    constructor(name) {
        this.data = {}
        this.self = this
        this.logger = console
        this.name = name || 'default'
    }

    create(name) {
        return new Cache(name)
    }

    log(...args) {
        // eslint-disable-next-line no-console
        this.logger.log(this.name)
        this.logger.log(args)
    }

    setLogger(logger) {
        this.logger = logger
        return this
    }

    get(key) {
        const now = Date.now()
        this.log(`Accessing '${key}' content at ${now}`)
        const content = this.data[key]
        if (!content) {
            return null
        }
        this.log({ content })
        const isInfinity = content.expireAt === -1
        const expired = content.expireAt < now
        const shouldDelete = (!isInfinity) && expired
        if (shouldDelete) {
            this.log(`Removing property '${key}' expired at ${content.expireAt} - now ${now}`)
            this.remove(key)
            return null
        }
        return {
            value: JSON.parse(content.value),
            expireAt: content.expireAt,
            createdAt: content.createdAt,
        }
    }

    remove(key) {
        delete this.data[key]
        return this
    }

    createValue(stringValue, options) {
        return {
            value: stringValue,
            expireAt: options.expireAt || -1,
            createdAt: Date.now(),
        }
    }

    set(key, value, options = {}) {
        const stringValue = JSON.stringify(value)
        this.log(`Setting key: ${key} value: ${stringValue}`)
        this.log(options)
        this.data[key] = this.createValue(stringValue, options)
        return this
    }

    cleanAll() {
        this.log('Cleaning all data from cache')
        this.data = {}
        return this
    }
}

export default new Cache()