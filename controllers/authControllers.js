const jwt = require("jsonwebtoken");
// const model = require()
const model = require("../models/index");

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
const signinpost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ id: user.id }, "your-secret-key", { expiresIn: "1h" });
        res.cookie("token", token); // Simpan token di cookie
        res.redirect("/");
    } catch (err) {
        res.status(500).json({ error: "Error logging in user" });
    }
};
const signup = (req, res) => {
    res.render("auth/signup", { title: "Sign In" });
};
const signuppost = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, process.env.JWT_SECRET);
        const user = await model.User.create({ username, email, password: hash });
        res.redirect("/login");
    } catch (err) {
        res.status(500).json({ error: "Error registering user" });
    }
};

module.exports = { login, isLogin, signin, signinpost, signup, signuppost };
