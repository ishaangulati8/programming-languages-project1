const Generator = require('./Generator');

class DSLGenerator extends Generator {

    buyRequest() {
        const statement = `${this.numberOfShares} ${this.stockSymbol} shares buy at max ${this.atMaxValue},`;
        return statement;
    }

    sellRequest() {
        const statement = `${this.numberOfShares} ${this.stockSymbol} shares sell at min ${this.atMinValue},`;
        return statement;

    }

    static cancelRequest(userId, cancelledStocks) {
        const statement = `\nCancel (${cancelledStocks.map((i) => (`${i}`))}) trade for account "${userId}".`;
        return statement;
    }

    static formatDSL(dslSubString, userId) {
        let dslString = dslSubString.substring(0, dslSubString.length - 1);
        return `(${dslString}) for account "${userId}".\n`;
    }
}

module.exports = DSLGenerator;
