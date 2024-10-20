const model = require("../models/index");
const jwt = require("jsonwebtoken");

const index = (req, res) => {
    try {
        res.render("index", { title: "Home Page" });
        // let data = model.Todo.findAll();
        // if (!data) {
        //     throw "data kosong";
        // }
        // res.status(200).send({
        //     data: data,
        //     message: "success",
        // });
    } catch (error) {
        console.log(error);
    }
};
module.exports = { index };
