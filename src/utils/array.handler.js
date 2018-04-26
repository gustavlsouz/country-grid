const distinct = array => {
    const objGroup = {}

    array.forEach(element => {
        objGroup[element] = null
    })

    return Object.keys(objGroup)
}

exports.distinct = distinct