const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    try {
        //statement when authorized
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
        // statement when unauthorized
        // ignore clear cookie if use express backend only
        // res.clearCookie("token");
        res.status(401).send({
            status: false,
            message: "access unauthorized",
        });
    }
};
const auth_asguest = (req, res, next) => {
    try {
        //statement when authorized
        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        // statement when unauthorized
        // ignore clear cookie if use express backend only
        res.clearCookie("token");
        next();
        // res.status(401).send({
        //     status: false,
        //     message: "access unauthorized",
        // });
    }
};
const auth_asuser = (req, res, next) => {
    try {
        //statement when authorized
        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        // statement when unauthorized
        // ignore clear cookie if use express backend only
        res.clearCookie("token");
        return res.redirect("/threads");
        // res.status(401).send({
        //     status: false,
        //     message: "access unauthorized",
        // });
    }
};
// middlewares/auth.js
function isAuthenticated(req, res, next) {
    console.log(req);
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/auth/signin"); // Jika tidak ada token, redirect ke halaman login
    }

    try {
        // Verifikasi token menggunakan secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan data user yang terdecode di req.user
        req.user = decoded;
        next(); // Lanjut ke route berikutnya
    } catch (err) {
        console.error(err);
        return res.redirect("/auth/signin"); // Jika tidak ada token, redirect ke halaman login
        //   return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { auth, isAuthenticated, auth_asguest, auth_asuser };
