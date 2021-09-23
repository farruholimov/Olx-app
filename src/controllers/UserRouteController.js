const users = require("../models/UserModel")
const { createCrypt } = require("../modules/bcrypt")
const mail = require("../modules/email")
const { SignUpValidation } = require("../modules/validations")

module.exports = class UserRouteController {
    static async UserRegistrationGetController(req, res){
        res.render('register')
    }
    static async UserLoginGetController(req, res){
        res.render('login')
    }
    static async UserRegisterPostController(req, res){
        try {
            const {name, email, password} = await SignUpValidation(req.body)

            const user = await users.create({
                name, email, password: await createCrypt(password)
            })

            if(user){
                res.render('verify', {
                    message: `${user.name}, sizning ${user.email} pochtangizga emailni tasdiqlash uchun link jo'natildi. Davom etish uchun emailingizni tasdiqlang.`
                })
            }

            await mail(email, "Iltimos emailingizni tasdiqlang", "Tasdiqlash uchun link:", `<a href="http://localhost:7889/users/verify/${user._id}">Tasdiqlash</a>`)
            
        } catch (error) {
            res.render('register', {
                error: error.message
            })
        }
    }
}