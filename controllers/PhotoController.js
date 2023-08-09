const mongoose = require("mongoose");
const Photo = require("../models/Photo");
const User = require("../models/User");

const insertPhoto = async (req, res) =>{
    const {title} = req.body
    const image = req.file.filename

    const reqUser = req.user

    const user = await User.findById(reqUser._id)

    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name
    })

    if (!newPhoto) {
        res.status(422).json({
            errors: ["Houve um problema tente novamente mais tarde"]
           
        })
        return
    }
    
    res.status(201).json(newPhoto)
}
const deletePhotos = async (req, res) =>{
    const {id} = req.params
    const reqUser = req.user
    try {
        const photo = await Photo.findById(mongoose.Types.ObjectId(id))
        if (!photo.userId.equals(reqUser._id)) {
            res.status(422).json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
            return;
        }

        await Photo.findByIdAndDelete(photo._id);

        res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso." });
    } catch (error) {
        res.status(404).json({ errors: ["foto não encontrada"] });
        console.log(error)
    }
}
const getAllPhotos = async (req, res) =>{
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec()

    return res.status(200).json(photos)
}
const getUserPhotos = async (req, res) =>{
    const {id} = req.params

    const photos = await Photo.find({userId: id}).sort([["createdAt", -1]]).exec()
    return res.status(200).json(photos)
}
const getPhotosById = async (req, res) =>{
    const {id} = req.params

    try {

        const photo = await Photo.findById(mongoose.Types.ObjectId(id))
        res.status(200).json(photo)

    } catch (error) {

        res.status(404).json({ errors: ["foto não encontrada"] });

    }
}
const updatePhotos = async (req, res) =>{
    const { id } = req.params;
    const { title } = req.body;

    let image;

    if (req.file) {
        image = req.file.filename;
    }

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    // Check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
        res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
        return;
    }

    if (title) {
        photo.title = title;
    }

    if (image) {
        photo.image = image;
    }

    await photo.save();

    res.status(200).json({photo});
}

const likePhoto = async (req, res) =>{
    const {id} = req.params

    const reqUser = req.user
    const photo = await Photo.findById(id)

    function index(element, index, array) {
        
        if (reqUser._id.equals(element)) {
            photo.likes.splice(index, 1)
        }
    }

    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    if (photo.likes.includes(reqUser._id)) {
        await photo.likes.forEach(index)
        await photo.save()
        const likesArray = photo.likes
        res.status(200).json({photoId: id, errors: 'Foto descurtida', likesArray})
        return
    }
    photo.likes.push(reqUser._id)

    await photo.save()
    const likesArray = photo.likes

    res.status(200).json({photoId: id, userId: reqUser._id, message: "A foto foi curtida", likesArray})
}
const commentPhoto = async (req, res) =>{
    const {id} = req.params
    const {comment} = req.body
    const reqUser = req.user
    
    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id)
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    const commentUser = {
        comment,
        userId : user._id,
        userName: user.name,
        userImage: user.profileImage
    }

    photo.comments.push(commentUser)

    await photo.save()

    res.status(200).json({comment: commentUser, message: "adicionamos seu comentario" })

}
const searchPhotos = async (req, res) => {
    const {q} = req.query

    const photos = await Photo.find({title: new RegExp(q, "i")}).exec()

    res.status(200).json(photos)
}
module.exports = {
    insertPhoto,
    deletePhotos,
    getAllPhotos,
    getUserPhotos,
    getPhotosById,
    updatePhotos,
    likePhoto,
    commentPhoto,
    searchPhotos
}