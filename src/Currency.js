export default class Currency {
    constructor(symbol,name,rate,country) {
        this.symbol = symbol;
        this.name = name;
        this.rate = rate;
        this.country = country;
    }

    exchange(amount, other) {
        let result = (amount / this.rate) * other.rate
        return result
    }

    contains(filter) {

        if (this.symbol.includes(filter.toUpperCase())) {
            return true
        }
        if (this.country.toLowerCase().includes(filter.toLowerCase())) {
            return true
        }

        if (this.name.toLowerCase().includes(filter.toLowerCase())) {
            return true
        }

        return false
    }
}