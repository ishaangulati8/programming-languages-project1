const Generator = require('./Generator');

class DSLGenerator extends Generator {

    buyRequest() {
        const statement = `${this.numberOfShares} '${this.stockSymbol}' shares buy at max ${this.atMaxValue},`;
        return statement;
    }

    sellRequest() {
        const statement = `${this.numberOfShares} '${this.stockSymbol}' shares sell at min ${this.atMinValue},`;
        return statement;

    }

    static cancelRequest(userId, cancelledStocks) {
        const statement = `\ncancel (${cancelledStocks.map((i) => (`'${i}'`))}) trade for account "${userId}".`;
        return statement;

    }
}

module.exports = DSLGenerator;
