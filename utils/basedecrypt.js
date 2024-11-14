var CryptoJS = require("crypto-js");

// Encrypt
const basedecrypt = (data) => {
    var decodeduri = decodeURIComponent(data);
    console.log({ decodeduri });

    var bytes = CryptoJS.AES.decrypt(decodeduri, process.env.PWD_SECRET);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

module.exports = { basedecrypt };
