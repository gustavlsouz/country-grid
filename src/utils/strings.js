const onlyChars = (string, regex = /[0-9a-z ]+/gi, join = "", options) => {

    const defaultOptions = {
        onNull: ""
    }

    options = Object.assign({}, defaultOptions, options)

    if (typeof string === "string") {

        const result = string.match(regex)

        if (result !== null) {
            string = result.join(join)
        } else {
            string = options.onNull
        }
    }

    return string;
}

const capitalize = string => {
    if (typeof string === "string") {
        string = string.replace(/\b\w/g, l => l.toUpperCase())
    }
    return string
}

export {
    onlyChars
    , capitalize
}
