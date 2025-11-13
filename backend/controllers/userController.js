import User from '../models/usermodel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })


}
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ msg: "User already exists" })
        }
        if (password.length < 8) {
            return res.status(400).json({ msg: "Password must be strong or 8 characters" })

        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt)
        const user = await User.create({
            name,
            email,
            password: hashedpassword
        })
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })


    } catch (error) {
        res.status(400).json({ msg: "Some error occured" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(500).json({ message: "invalid email or password" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(500).json({ message: "Invalid password" })
        }
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(400).json({ msg: "Some error occured" })
    }
}

export const setUserProfile = async (req, res) => {
    try {
        // Use req.user._id since that's what's set in authMiddleware.js
        const user = await User.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }
        res.json(user)
    }
    catch (error) {
        console.error("Profile error:", error);
        res.status(400).json({ msg: "Some error occured", error: error.message })
    }
}
