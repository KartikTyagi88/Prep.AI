import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
    
export const signup = async(req, res)=>{
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "password must be atleast 6 characters"})
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
            })
        }
        else{
            res.status(400).json({message: "Invalid User data"});
        }

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
};

export const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid Credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        generateToken(user._id, res);
        return res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
        });
    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const logout = (req,res) => {
    try {
        res.cookie("jwt","", {maxAge:0});
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const updateName = async (req, res) => {
  try {
    const { fullName } = req.body;

    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({ message: "Full name is required" });
    }

    // req.user is provided by your protectRoute middleware
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName: fullName.trim() },
      { new: true } // This tells Mongoose to return the updated document
    ).select("-password"); // Ensure we don't send the password back

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateName controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async(req,res)=>{
    try {
        res.status(200).json({user:req.user});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
}