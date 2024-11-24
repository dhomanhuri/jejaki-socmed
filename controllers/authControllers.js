const jwt = require("jsonwebtoken");
// const model = require()
const model = require("../models/index");
const { transporter } = require("../utils/mailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sequelize = require("sequelize");
const Op = sequelize.Op;
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
        const token = jwt.sign(user, process.env.bcrypt_length, { expiresIn: "1h" });
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
    const message = req.flash("message");
    res.render("auth/signin", { title: "Sign In", message });
};
const signinpost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await model.User.findOne({ where: { email } });
        if (!user) {
            throw "Username and Password not match";
        }
        if (!user.isVerified) {
            const verificationToken = crypto.randomBytes(32).toString("hex");
            const info = await transporter.sendMail({
                from: `noreply@jejaki.id`,
                to: email,
                subject: "Hello ✔, Verify your jejaki account",
                text: "Is it you?",
                html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <p>Is it you?</p>
                    <a href="https://jaksos.jejaki.id/api/verify-email?token=${verificationToken}" 
                        style="display: inline-block; padding: 12px 24px; margin-top: 10px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                        Verify Your Account
                    </a>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `,
            });
            console.log(info);

            user.verificationToken = verificationToken;
            await user.save();
            return res.status(404).json({ error: "User not verified check mail" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw "Username and Password not match";
        }
        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token); // Simpan token di cookie
        res.redirect("/threads");
    } catch (err) {
        console.log(err);

        req.flash("message", err);
        res.redirect("/auth/signin");

        // res.render("auth/signin", { title: "home" });
        // res.status(500).json({ error: "Error logging in user" });
    }
};
const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        res.clearCookie("token");
        res.redirect("/threads");
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Error logging in user" });
    }
};
const signup = (req, res) => {
    const message = req.flash("message");
    return res.render("auth/signup", { title: "Sign In", message });
};
const signuppost = async (req, res) => {
    const { email, password, username } = req.body;
    console.log(username);
    console.log(email);
    console.log(password);

    try {
        const hash = await bcrypt.hash(password, 10);
        const existingUser = await model.User.findOne({
            where: {
                [Op.or]: [{ email }, { username }],
            },
        });
        if (existingUser) {
            if (existingUser.email === email) {
                // return res.status(400).json({ message: "Email is already taken." });
                throw "Email is already taken";
            }
            if (existingUser.username === username) {
                // return res.status(400).json({ message: "Username is already taken." });
                throw "Username is already taken";
            }
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await model.User.create({ username, email, password: hash, verificationToken });
        const info = await transporter.sendMail({
            from: `noreply@jejaki.id`,
            to: email,
            subject: "Hello ✔, Verify your jejaki account",
            text: "Is it you?",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <p>Is it you?</p>
                    <a href="https://jaksos.jejaki.id/api/verify-email?token=${verificationToken}"
                        style="display: inline-block; padding: 12px 24px; margin-top: 10px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                        Verify Your Account
                    </a>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `,
        });

        return res.redirect("/auth/signin");
    } catch (err) {
        console.log(err);
        try {
            req.flash("message", err);
        } catch (error) {
            req.flash("message", "something wrong");
        }
        return res.redirect("/auth/signup");

        // res.status(500).json({ error: "Error registering user" });
    }
};

const verified_mail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await model.User.findOne({ where: { verificationToken: token } });
        console.log(user);

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = null; // Hapus token setelah verifikasi
        await user.save();

        res.json({ message: "Email verified successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error verifying email" });
    }
};
module.exports = { verified_mail, login, isLogin, signin, signinpost, signup, signuppost, logout };
