export default {
    truncateValue(value, significantDigits) {
        let result = parseFloat(value).toFixed(significantDigits)
        //Trims trailing zeroes
        result = parseFloat(result).toString()
        if (!isFinite(result)) {
            result = "Invalid number"
        }
        return result
    }
}