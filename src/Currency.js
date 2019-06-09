export default class Currency {
    constructor(name,rate) {
        this.name = name;
        this.rate = rate
    }

    exchange(amount, other) {
        let result = (amount / this.rate) * other.rate
        return result
    }
}