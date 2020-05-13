const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsersDAO = require('../dao/usersDAO');

const hashPassword = async password => await bcrypt.hash(password, 10);
const SecretKey = 'lskdjfoijoi234lk234mndfg908d';




class User {
        constructor( { name, email, password} = {}) {
            this.name = name
            this.email = email
            this.password = password
        }
        toJson() {
            return { name: this.name, email: this.email }
        }
        async comparePassword(plainText) {
            return await bcrypt.compare(plainText, this.password)
        }
        encoded() {
            return jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
                    ...this.toJson()
                },
               SecretKey
            )
        }
        static async decoded(userJwt) {
            return jwt.verify(userJwt, SecretKey, (error, res) => {
                if (error) {
                    return { error }
                }
                return new User(res)
            })
        }
    }

module.exports = class UserController {
    static async register(req, res) {
        try {
            const userFromBody = req.body
            let errors = {}
            if (userFromBody && userFromBody.password.length < 8) {
                errors.password = "Your password must be at least 8 characters."
            }
            if (userFromBody && userFromBody.name.length < 3) {
                errors.name = "You must specify a name of at least 3 characters."
            }

            if (Object.keys(errors).length > 0) {
                res.status(400).json(errors)
                return
            }

            const userInfo = {
                ...userFromBody,
                password: await hashPassword(userFromBody.password)
            }

            const insertResult = await UsersDAO.addUser(userInfo)
            if ( !insertResult.success) {
                errors.email = insertResult.error
            }
            const userFromDB = await UsersDAO.getUser(userFromBody.email)
            if (!userFromDB) {
                errors.general = "Internal error, please try again later."
            }

            if (Object.keys(errors).length > 0) {
                res.status(400).json(errors)
                return
            }

            const user = new User(userFromDB)

            res.json({
                auth_token: user.encoded(),
                info: user.toJson()
            })
        } catch (e) {
            res.status(500).json({ error: e + 'Hej'})
        }
    }
}

