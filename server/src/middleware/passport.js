import passport from "../config/passport.js";

const initializePassport = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
};

export default initializePassport;
