import { firstLetters } from './regex'
const onlyChars = (string, regex = /[0-9a-z ]+/gi, join = "", options) => {

    const defaultOptions = {
        onNull: ""
    }

    options = Object.assign({}, defaultOptions, options)

    if (string && string.__proto__ === String.prototype) {

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
    if (string && string.__proto__ === String.prototype) {
        string = string.replace(firstLetters, l => l.toUpperCase())
    }
    return string
}

export {
    onlyChars
    , capitalize
}
