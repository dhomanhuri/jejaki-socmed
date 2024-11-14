var CryptoJS = require("crypto-js");

// Encrypt
const basedecrypt = (data) => {
    var bytes = CryptoJS.AES.decrypt(data, process.env.PWD_SECRET);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

module.exports = { basedecrypt };
