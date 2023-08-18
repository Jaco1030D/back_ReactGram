const express = require("express")
const { insertPhoto, deletePhotos, getAllPhotos, getUserPhotos, getPhotosById, updatePhotos, likePhoto, commentPhoto, searchPhotos } = require("../controllers/PhotoController")
const router = express.Router()

const authGuard = require("../middlewares/authGuard")
const validate = require("../middlewares/handleValidator")
const { imageUpload } = require("../middlewares/imageUploads")
const { photoInsertValidation, photoUpdateValidation, commentValidation } = require("../middlewares/photoValidation")

router.post("/", authGuard, photoInsertValidation(), validate, insertPhoto)
router.delete("/:id", authGuard, deletePhotos)
router.get("/", authGuard, getAllPhotos)
router.get("/users/:id", authGuard, getUserPhotos)
router.get("/search", authGuard, searchPhotos)
router.get("/:id", authGuard, getPhotosById)
router.put(
    "/:id",
    authGuard,
    imageUpload.single("image"),
    photoUpdateValidation(),
    validate,
    updatePhotos
  );
router.put("/like/:id", authGuard, likePhoto)
router.put("/comment/:id", authGuard, commentValidation(), validate, commentPhoto)
module.exports = router