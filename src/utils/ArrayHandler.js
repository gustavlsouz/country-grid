export default class ArrayHandler {
    static distinct(array) {
        const group = array
            .reduce((objGroup, element) => {
                objGroup[element] = null
                return objGroup
            }, {})
        return Object.keys(group)
    }
}
