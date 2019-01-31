const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const config = require("../configs/mainConfigs");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
      session: false // Bug - In here "session: false" don't work as documentation specify. Add it to where authentication happen. Ex: "passport.authenticacte(local, {session: false })".
    },
    (req, username, password, done) => {
      // IMPORTANT : For now we don't do any authentication check here. (Like checking user's username/password in database)
      // So for now any user with any username/passwrd combiation get authenticated.

      // Generating JWT Token
      const token = jwt.sign({ id: username }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES
      });

      // Authentication successful. This populate "req.user" with this details.
      return done(null, {
        token,
        username
      });
    }
  )
);

// JWT Token Authentication

const extractOptionsForJWT = {
  jwtFromRequest: extractJWT.fromExtractors([
    extractJWT.fromAuthHeaderAsBearerToken(),
    extractJWT.fromBodyField("token"),
    extractJWT.fromUrlQueryParameter("token")
  ]),
  secretOrKey: config.JWT_SECRET
};

passport.use(
  new JWTStrategy(extractOptionsForJWT, (jwtPayload, done) => {
    if (!jwtPayload.id) {
      return done(null, false, "Invalid Token.");
    }

    // IMPORTANT : For now here also we don't do any authentication check. (Like checking user's exist in database and sending that user data into next middleware.)
    // So for now any user with valid token get authenticated and just get username and other token payload attributes.

    // Authentication successful. This populate "req.user" with full token payload.
    return done(null, jwtPayload);
  })
);
