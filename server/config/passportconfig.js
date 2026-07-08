
import "dotenv/config";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";

import User from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET,
      callbackURL:"http://localhost:5173/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({ googleId: profile.id });
        if(!existingUser){
          existingUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value || "",
            password: profile.id,
          });
        }
        return done(null, existingUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieve user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

