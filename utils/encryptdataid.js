const { baseencrypt } = require("./baseencrypt");

const encryptdataid = (data) => {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        data[index].dataValues.data = baseencrypt(element.id);
    }
    return data;
};

module.exports = { encryptdataid };
