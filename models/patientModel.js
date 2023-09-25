const mongoose = require('mongoose')
const validator = require('validator')
const mongooseTypePhone = require('mongoose-type-phone')
const jwt = require("jsonwebtoken")

const patientSchema = mongoose.Schema({
    PatientName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    PhoneNumber: {
        type: mongoose.SchemaTypes.Phone,
        defaultRegion: 'EG'
    },
    BirthDate: {
        type: String
    },
    Height: {
        type: Number
    },
    Gender: {
        type: String,
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
    role: {
        type: String,
        default: 'Patient'
    }
})

patientSchema.statics.login = async (PatientName, PhoneNumber) => {
    console.log(PatientName);
    console.log(PhoneNumber);
    const userData = await Patient.findOne({ PatientName, PhoneNumber })
    console.log(userData);
    if (!userData) throw new Error("invalid PatientName or PhoneNumber")
    return userData
}

patientSchema.methods.generateToken = async function () {
    const Patient = this
    const token = jwt.sign({ _id: Patient._id, role: Patient.role }, process.env.JWTKEY)
    Patient.tokens = Patient.tokens.concat({ token })
    await Patient.save()
    return token
}
const Patient = mongoose.model("Patient", patientSchema)

module.exports = Patient