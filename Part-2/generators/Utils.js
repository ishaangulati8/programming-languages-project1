const fs = require('fs');

class Utils {

    static writeFile(fileName, stream) {
        fs.appendFile(`${fileName}`, `\n${stream}\n`, err => {
            if (err) {
                console.error(err)
                return
            }
        });
    }

    static readJsonFile(filePath) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }

    static formatDSL(dslSubString, userId) {
        let dslString = dslSubString.substring(0, dslSubString.length - 1);
        return `${dslString}) for account "${userId}".`;
    }

}

module.exports = Utils;
