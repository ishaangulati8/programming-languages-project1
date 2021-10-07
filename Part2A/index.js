const Utils = require('./Utils');
const typeValidation = require('./typeValidations');
const SQLGenerator = require('./generators/SQLGenerator');
const DSLGenerator = require('./generators/DSLGenerator');


const generateResult = (stocks, filePath) => {
    typeValidation(stocks);
    const { 'user id': userId, buy: buyStocks = [], sell: sellStocks = [] } = stocks;
    let sqlString = '';
    let dslString = '';
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

    const fileName = Utils.getFileName(filePath);
    if (sqlString && dslString) {
        //write sql file.
        Utils.writeFile(`${fileName}.sql`, sqlString);
        //write dsl file.
        dslString = DSLGenerator.formatDSL(dslString, userId); // formatting dsl
        Utils.writeFile(`${fileName}.dsl`, `${dslString}`);
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
