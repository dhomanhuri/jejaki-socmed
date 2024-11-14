var CryptoJS = require("crypto-js");

// Encrypt
const baseencrypt = (data) => {
    var encrypted = CryptoJS.AES.encrypt(data.toString(), process.env.PWD_SECRET).toString();
    var encoded = encodeURIComponent(encrypted);
    return encoded;
};

module.exports = { baseencrypt };
