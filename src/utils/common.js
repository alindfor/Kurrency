export default {
    truncateValue(value, significantDigits) {
        let result = parseFloat(value).toFixed(significantDigits)
        //Trims trailing zeroes
        result = parseFloat(result)
        return result
    }
}