const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization.includes(" ")) {
            token = req.headers.authorization.split(" ")[1];
        } else {
            token = req.headers.authorization;
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            status: false,
            message: "access unauthorized",
        });
    }
};
const auth_asguest = (req, res, next) => {
    try {
        const token = req.cookies.token;

        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        console.log("notlogin");
        console.log(error);

        res.clearCookie("token");
        next();
    }
};
const auth_asuser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/auth/signin");
    }
};
const auth_asuser_api = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie("token");

        res.status(401).json({ error: "unautorized" });
    }
};
function isAuthenticated(req, res, next) {
    // console.log(req);
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/auth/signin");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.redirect("/auth/signin");
    }
}

module.exports = { auth, isAuthenticated, auth_asguest, auth_asuser, auth_asuser_api };
