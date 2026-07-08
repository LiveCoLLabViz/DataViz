import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import passport from "passport";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

         const token = generateToken(user._id);
          
         
        

        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            user,
            token
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Login User
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials."
            });
        }

        const token = generateToken(user._id);

              
     

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// logout function

export const handleLogout =async (req,res) => {
    return res.status(200).json({
        success: true,
        message: "Logout Successful"
    });
};
// export const googleAuthSuccess = async (req, res) => {
//    if(!req.user) {
//         return res.status(401).json({
//             message: "Authentication failed"
//         });
//     }
//     return res.status(200).json({
//         message: "Google Authentication Successful",
//         user: req.user
//     });
// }

// export const googleAuthFailure = (req, res) => {
//     return res.status(401).json({
//         message: "Google Authentication Failed"
//     });
// }


// export const handleGoogleAuth = async (req, res) => {
//    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);

// }

// export const handleGoogleAuthCallback = async (req, res) => {
//     passport.authenticate('google', { failureRedirect: '/auth/google/failure' })(req, res, () => {
//         // Successful authentication, redirect or respond with user info
//         res.status(200).json({
//             message: "Google Authentication Successful",
//             user: req.user
//         });
//     } 
//     const secretKey = process.env.JWT_SECRET;
//     const token=jwt.signing({ id: req.user._id }, secretKey, { expiresIn: '1h' });
//     res.status(200).json({
//         message: "Google Authentication Successful",
   // open signin page when want to signin with google     
export const handleUserSignIn=async(req,res)=>{
    const html=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Sign In</h1>
    <a href="/auth/google">
        sign in with google
    </a>
</body>
</html>`
   res.send(html);
}

export const handleGoogleAuth=async(req,res,next)=>{
     passport.authenticate('google', { scope: ['email','profile'] })(req,res,next); //(req,res,next) is important to execute the middleware function immediately
     //(req,res) is important to execute the middleware function immediately, otherwise it will not work and the user will not be redirected to google.com for authentication.
     //why is this important? because passport.authenticate() returns a middleware function that needs to be executed to perform the authentication process. If we don't execute it immediately, it will not work and the user will not be redirected to google.com for authentication.
     // Use passport.authenticate() as route middleware to authenticate the
     // request. The first step in Google authentication will involve redirecting
     // the user to google.com. After authorization, Google will redirect the user
     // back to this application at /auth/google/callback
}

export const handleGoogleCallback=async(req,res,next)=>{
     passport.authenticate('google', { failureRedirect: '/login' },
  (err, user)=> {
    if (err) {
        return next(err);
    }

    if (!user) {
        return res.redirect('/login');
    }

    // Successful authentication, redirect home.
    console.log("I have received the user==>",user);

    const secretKey=process.env.JWT_SECRET;

    const token=jwt.sign({
        id: user._id,
        email: user.email
    },
    secretKey,
    {
        expiresIn:'1h'
    }
    
    );

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

   res.redirect("http://localhost:5173/sign-in");
  })(req,res,next) //(req,res,next) is important to execute the middleware function immediately
}

// export const handleUserAuthentication=async(req,res)=>{
//     const query=req.query?.token;

//     res.send(query);
// }
