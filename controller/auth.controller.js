const userModel = require("../models/userModel")

class User {

    static login = async (req, res) => {
        try {
            // const user = await userModel.login(req.body.email, req.body.password, {
            //     userType: req.params.userType,
            //      })
            const user = await userModel.login(req.body.email, req.body.password)
            const token = await user.generateToken()
            res.status(200).send({
                apiStatues: true,
                data: { token, user },
                message: "user loggedin",
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "cannot login ",
            });
        }
    };
    static getAll = async (req, res) => {
        try {
            const users = await userModel.find().select('name _id')
            res.send({
                apiStatues: true,
                data: users,
                message: "data featched successfully"
            })
        }
        catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "error fetching user"
            })
        }
    }
    static getSingle = async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id)
            res.send({
                apiStatues: true,
                data: user,
                message: "data featched successfully"
            })
        }
        catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "error fetching user"
            })
        }
    }

    static deleteUser = async (req, res) => {
        const _id = req.params.id

        try {
            const deleteUser = await userModel.findByIdAndDelete(_id)

            res.status(200).send({
                apiStatues: true,
                deleteUser,
                message: "Delete User"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't delete User",
            });
        }
    }
}



module.exports = User








