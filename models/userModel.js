const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 20,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("invalid email")
        }
    },
    password: {
        type: String,
        trim: true,
        minLength: 6,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    role:{
        type: String,
        default: 'Doctor'
    }
})

// userSchema.methods.toJSON = function () {
//     const user = this.toObject()
//     return user
// }

// userSchema.pre("save", async function () {
//     if (this.isModified("password"))
//         this.password = await bcrypt.hash(this.password, parseInt(process.env.salt))
// })

userSchema.statics.login = async (email, password) => {
    const userData = await user.findOne({ email, password })
    if (!userData) throw new Error("invalid email or password")
    // const isValid = await bcrypt.compare(password, userData.password)
    // if(!isValid) throw new Error("invalid password")
    return userData
}

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id ,role: user.role}, process.env.JWTKEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
const user = mongoose.model("User", userSchema)
module.exports = user

