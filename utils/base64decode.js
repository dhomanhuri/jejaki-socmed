const base64decode = (data) => {
    var encodedStringBtoA = btoa(data);
    return encodedStringBtoA;
};

module.exports = { base64decode };
