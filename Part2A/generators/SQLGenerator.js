const Generator = require('./Generator');

class SQLGenerator extends Generator {
    sellRequest() {
        const statement = `INSERT INTO "SellRequests" ("NumShares", "Symbol", "MinPrice", "AccountID")` +
            ` VALUES ('${this.numberOfShares}', '${this.stockSymbol}', '${this.atMinValue}', '${this.userId}');\n`;
        return statement;

    }

    buyRequest() {
        const statement = `INSERT INTO "BuyRequests" ("NumShares", "Symbol", "MaxPrice", "AccountID")` +
            ` VALUES ('${this.numberOfShares}', '${this.stockSymbol}', '${this.atMaxValue}', '${this.userId}'); \n`;
        return statement;
    }

    static cancelRequest(userId, cancelledStocks) {
        // Updating "CancelledAt" to the current timestamp. now() would take current timestamp value for the postgres server.
        const statement = `UPDATE "SellRequests" SET "CancelledAt" = now() where "AccountID" = '${userId}' and "Symbol" in (${cancelledStocks.map((i) => (`'${i}'`))}); \n` +
            `UPDATE "BuyRequests" SET "CancelledAt" = now() where "AccountID" = '${userId}' and "Symbol" in (${cancelledStocks.map((i) => (`'${i}'`))}); \n`;
        return statement;
    }
}

module.exports = SQLGenerator;
