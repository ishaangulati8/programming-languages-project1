class Generator {
    constructor(userId, stock) {
        this.userId = userId;
        this.stock = stock;
    }

    get numberOfShares() {
        const numShares = this.stock["shares"];
        return numShares;
    }

    get stockSymbol() {
        const symbol = this.stock["stock symbol"];
        return symbol;
    }

    get atMaxValue() {
        const atMax = this.stock["at max"];
        return atMax;
    }

    get atMinValue() {
        const atMin = this.stock["at min"];
        return atMin;
    }

    sellRequest() {
        // Method will be overridden by the child class.
        throw new Error('NOT_IMPLEMENTED_IN_GENERATOR_CLASS');
    }

    buyRequest() {
        // Method will be overridden by the child class.
        throw new Error('NOT_IMPLEMENTED_IN_GENERATOR_CLASS');
    }

}

module.exports = Generator;
