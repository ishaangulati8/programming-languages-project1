const Utils = require('./generators/Utils');
const SQLGenerator = require('./generators/SQLGenerator');
const DSLGenerator = require('./generators/DSLGenerator');


function validateData(userId, buyStocks, sellStocks, cancel) {
    if (!userId) {
        throw new Error("User Id is required to process the request.")
    }
    if (!buyStocks.length && !sellStocks.length && !cancel) {
        throw new Error('\"buy\" or \"sell\" or \"cancel\" should be present to process the request.');
    }
}

const generateResult = (stocks, filePath) => {
    const userId = stocks["user id"];
    const { buy: buyStocks = [], sell: sellStocks = [], cancel: cancelStocks = [] } = stocks;
    let sqlString = '';
    let dslString = '';
    let cancelString = '';
    validateData(userId, buyStocks, sellStocks, cancelStocks);
    for (const stock of buyStocks) {
        const sqlGenerator = new SQLGenerator(userId, stock);
        const dslGenerator = new DSLGenerator(userId, stock);
        sqlString += sqlGenerator.buyRequest();
        dslString += dslGenerator.buyRequest();
    }

    for (const stock of sellStocks) {
        const sqlGenerator = new SQLGenerator(userId, stock);
        const dslGenerator = new DSLGenerator(userId, stock);
        sqlString += sqlGenerator.sellRequest();
        dslString += dslGenerator.sellRequest();
    }

    if (cancelStocks && cancelStocks.length) {
        const sqlCancelStatement = SQLGenerator.cancelRequest(userId, cancelStocks);
        const dslCancelStatement = DSLGenerator.cancelRequest(userId, cancelStocks);
        sqlString += sqlCancelStatement;
        cancelString += dslCancelStatement;
    }

    const fileName = Utils.getFileName(filePath);
    if (sqlString && (dslString || cancelString)) {
        //write sql file.
        Utils.writeFile(`${fileName}.sql`, sqlString);
        //write dsl file.
        dslString = DSLGenerator.formatDSL(dslString, userId); // formatting dsl
        Utils.writeFile(`${fileName}.dsl`, `${dslString}${cancelString}`);
    }
}

try {
    const filePath = process.argv[2];
    if (!filePath || !filePath.length) {
        console.error('File is required.')
    }
    const stocks = Utils.readJsonFile(filePath);
    generateResult(stocks, filePath);
} catch (error) {
    console.log("******Error******");
    console.error(error.message);
}
