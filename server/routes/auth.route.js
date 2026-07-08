import express from "express";
import passport from "passport";
import {registerUser,loginUser, handleLogout} from "../controllers/auth.controller.js";
// import {googleAuthsuccess} from "../controllers/auth.controller.js";
// import {googleAuthFailure} from "../controllers/auth.controller.js";
import {handleUserSignIn,handleGoogleAuth,handleGoogleCallback} from "../controllers/auth.controller.js";


const router = express.Router();


router.post("/register", registerUser);
router.post("/login",loginUser);
router.post("/logout",handleLogout);


router.get("/sign-in",handleUserSignIn);

router.get(
    "/auth/google",
    handleGoogleAuth   
);
// explain above route

router.get(
    "/auth/google/callback",
   handleGoogleCallback
);


// router.get("/google/failure", googleAuthFailure);


export default router;