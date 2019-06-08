export default class Currency {
    constructor(name,rate) {
        this.name = name;
        this.rate = rate
    }

    exchange(amount, other) {
        return (amount / this.rate) * other.rate
    }
}