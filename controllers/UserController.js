const User = require("../models/User");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const { findById } = require("../models/User");

const jwtSecret = process.env.JWT_SECRET

const generateToken = (id) =>{
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    } )
}

const getCurrentUser = async (req, res) =>{
    const user = req.user
    res.status(200).json(user)
}

const register = async(req, res) =>{
    const {name, email, password} = req.body

    const user = await User.findOne({email})

    if (user) {
        res.status(422).json({errors: ['Esse e-mail ja esta em utilização']})
        return
    }
    const salt = await bcrypt.genSalt()
    const passwordhashed = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        name,
        email,
        password: passwordhashed
    })
    if (!newUser) {
        res.status(422).json({errors: ["Houve um erro em nossos servidores, tente mais tarde"]})
        return
    }
    res.status(200).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })
}
const login = async(req,res) =>{
    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
        res.status(404).json({errors: ['Esse e-mail não existe']})
        return
    }
    if (!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({errors: ['Senha ta errada']})
        return
    }
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })

}
const update = async (req, res) =>{
    const {name, password, bio, profileImage} = req.body

    let profile = null

    if (profileImage) {
        profile = profileImage
    }

    const reqUser = req.user

    const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select("-password")

    if (name) {
        user.name = name
    }
    
    if (password) {
        user.password = password
    }

    if (profile) {
        user.profileImage = profileImage;
      }
    
    if (bio) {
        user.bio = bio
    }

    await user.save()

    res.status(200).json(user)
}
const getUserById = async (req, res) =>{
    const {id} = req.params

    try {
        const user = await User.findById(mongoose.Types.ObjectId(id)).select("-password")
        
        if (!user) {
            res.status(404).json({erros: ['usuario não encontrado']})
            return
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({erros: ['usuario não encontrado']})
        return
    }
}
module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById
}