const jwt = require("jsonwebtoken");

const login = (req, res) => {
    try {
        const { username, password } = req.body;
        const user = {
            username: "dhomanhuri",
            password: "yourpassword",
        };
        if (password != user.password) {
            throw "salah";
        }
        delete user.password;
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.send({
            status: true,
            message: "successfully login",
            data: {
                token: token,
            },
        });
        //use express view
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     // secure:true,
        //     // maxAge:1000000,
        //     // signed:true
        // });
        // return res.redirect("welcome");
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            status: false,
            message: "unauthorize",
        });
    }
};

const isLogin = (req, res) => {
    res.send({
        status: true,
    });
};

const signin = (req, res) => {
    res.render("auth/signin", { title: "Sign In" });
};
const signinpost = (req, res) => {
    const { email, password } = req.body;

    //logic
    res.redirect("/");
};
const signup = (req, res) => {
    res.render("auth/signup", { title: "Sign In" });
};
const signuppost = (req, res) => {
    const { email, password } = req.body;
    //logic

    res.redirect("/");
};

module.exports = { login, isLogin, signin, signinpost, signup, signuppost };
