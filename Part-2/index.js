const Utils = require('./generators/Utils');
const SQLGenerator = require('./generators/SQLGenerator');
const DSLGenerator = require('./generators/DSLGenerator');

const generateResult = () => {
    const userId = stocks["user id"];
    const { buy: buyStocks, sell: sellStocks, cancel: cancelStocks } = stocks;
    let sqlString = '';
    let dslString = '(';
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

    dslString = Utils.formatDSL(dslString, userId);

    if (cancelStocks && cancelStocks.length) {
        const sqlCancelStatement = SQLGenerator.cancelRequest(userId, cancelStocks);
        const dslCancelStatement = DSLGenerator.cancelRequest(userId, cancelStocks);
        sqlString += sqlCancelStatement;
        dslString += dslCancelStatement;
    }

    const fileName = (filePath.split('.'))[0];
    //write sql file.
    Utils.writeFile(`${fileName}.sql`, sqlString);
    //write dsl file.
    Utils.writeFile(`${fileName}.dsl`, dslString);

}

try {
    const filePath = process.argv[2];
    if (!filePath || !filePath.length) {
        console.error('File is required.')
    }
    const stocks = Utils.readJsonFile(filePath);
    generateResult();
} catch (error) {
    console.log("******Error******");
    console.error(error.message);
}
