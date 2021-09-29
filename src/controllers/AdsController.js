const {
    isValidObjectId
} = require("mongoose")
const mongoose = require("mongoose")
const categories = require("../models/CategoryModel")
const users = require("../models/UserModel")
const {
    AddAdsValidation
} = require("../modules/validations")
const path = require("path")
const {
    ADDRGETNETWORKPARAMS
} = require("dns")
const ads = require("../models/AdsModel")
const { default: slugify } = require("slugify")

module.exports = class AdsRouteController {
    static async AdsGetController(req, res) {

        res.render('new_ad', {
            user: req.user,
            categoryList: await categories.find()
        })
    }

    static async AdsAddPostController(req, res) {
        try {
            const {
                title,
                location,
                currensy,
                price,
                description,
                category,
                placeholder,
                phone
            } = await AddAdsValidation(req.body)

            let photos = []
            let name

            if (req.files) {
                if (Array.isArray(req.files.photos)) {
                    req.files.photos.forEach(photo => {
                        name = photo.md5 + ".jpg"
                        photo.mv(path.join(__dirname, "..", "public", "uploads", name))
                        photos.push(name)
                    });
                } else {

                    name = req.files.photos.md5 + ".jpg"
                    req.files.photos.mv(path.join(__dirname, "..", "public", "uploads", name))
                    photos.push(name)
                }

                console.log(photos);
            }

            const slug = slugify(title, {lower: true, strict: true, trim: true, replacement: "_"}) + Date.now()

            const x = await ads.create({
                title,
                location,
                currensy,
                price,
                description,
                photos,
                placeholder,
                phone,
                category_id: mongoose.Types.ObjectId(String(category)),
                owner_id: req.user._id,
                slug
            })

            console.log(x);

            res.redirect("/ads/" + slug)

        } catch (error) {
            console.log(error);
            res.render('new_ad', {
                user: req.user,
                categoryList: await categories.find(),
                error: error
            })
        }
    }

    static async AdsOneGetController(req, res) {

        const adsOne = await ads.findOne(
            {
                slug: req.params.slug
            }
        )

        res.render('more', {
            user: req.user,
            adsOne
        })
    }
}