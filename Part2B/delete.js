const Utils = require('./Utils');

try {
    const filePath = process.argv[2];
    if (!filePath || !filePath.length) {
        console.error('File is required.')
    }
    Utils.deleteFile(filePath);
} catch (error) {
    console.log("******Error******");
    console.error(error.message);
}
