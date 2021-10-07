const fs = require('fs');

class Utils {

    static writeFile(fileName, stream) {
        fs.appendFile(`${fileName}`, `${stream}`, err => {
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


    static getFileName(filePath) {
        // split the filepath on '/' character
        const filePathSplit = filePath.split('/');
        const fileNameWithExtension = filePathSplit[filePathSplit.length - 1];
        return (fileNameWithExtension.split('.'))[0];
    }

    static getDirectoryPath(filePath) {
        // return the direc
        const filePathSplit = filePath.split('/');
        let path = '';
        for (let i = 0; i < filePathSplit.length - 1; i++) {
            path = `${path}/${filePathSplit[i]}`;
        }
        return path;
    }

    static deleteFile(filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err)
                return
            }
        });
    }

}

module.exports = Utils;
