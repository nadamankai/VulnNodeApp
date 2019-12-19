var passport = require('passport');
var UsersController = require('../../controllers/usersController');


module.exports = {
    authenticate: function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return res.render("index", { message: err });
            } else if (!user) {
                return res.render("index", { message: "Invalid username or password!!" });
            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        return res.render("index", { message: "Invalid username or password!!" });
                    }
                    req.session.ROLE = user.role_id;
                    return renderDashboard(req, res);
                });
            }
        })(req, res, next);
    },
    renderDashboard: function (req, res, next) {
        return renderDashboard(req, res);
    },
    ErrorBasedSqli: function (req, res, next) {
        getUser(req.query.id)
            .then((user) => {
                if (user != undefined) {
                    return res.render('../views/error-based-sqli', { id: req.user.id, fullName: req.user.fullname, errorMessage: "", userDetails: user });
                } else {
                    return res.render('../views/error-based-sqli', { id: req.user.id, fullName: req.user.fullname, errorMessage: "", userDetails: undefined });
                }
            }).catch((err) => {
                return res.send(err);
            });
    },
    updateProfile: function (req, res, next) {
        const usersController = new UsersController();
        console.log("user.id : " + req.query.id);
        usersController.updateUserById(req.body, req.query.id)
            .then(() => {
                res.redirect("/error-based-sqli?id=" + req.query.id)
            }).catch((err) => {
                return res.send(err);
            });
    },
}

function renderDashboard(req, res) {
    return res.render('../views/dashboard', { id: req.user.id, fullName: req.user.fullname });
}

function getUser(id) {
    const usersController = new UsersController();
    return usersController.findUserById(id);
}