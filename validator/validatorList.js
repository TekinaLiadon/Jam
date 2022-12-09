var text = require('../enums/validatorText')

function validatorList(data, code) {
    const validatorCodeList = {
        number: [],
        string: [],
    }[typeof data]?.find(code) || false
    if (!validatorCodeList) return {
        text: text.failType,
        type: 'error',
    }
    const result = {

    }[validatorCodeList] || false
    if (!result) return {
        text: text.noValidator,
        type: 'error',
    }
    else return result

}

module.exports = validatorList