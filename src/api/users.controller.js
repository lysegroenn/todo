const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsersDAO = require('../dao/usersDAO');

const hashPassword = async password => await bcrypt.hash(password, 10);
//const SecretKey = 'lskdjfoijoi234lk234mndfg908d';
const SecretKey = process.env.SECRET_KEY;




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

module.exports = 
    class UserController {
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
            if (await UsersDAO.checkEmail(userFromBody.email) > 0) {
                errors.email = "An account with that email already exists."
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
    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email || typeof email !== "string") {
              res.status(400).json({ error: "Bad email format, expected string." })
              return
            }
            if (!password || typeof password !== "string") {
              res.status(400).json({ error: "Bad password format, expected string." })
              return
            }
            let userData = await UsersDAO.getUser(email)
            if (!userData) {
              res.status(401).json({ error: "Make sure your email is correct." })
              return
            }
            const user = new User(userData)
      
            if (!(await user.comparePassword(password))) {
              res.status(401).json({ error: "Make sure your password is correct." })
              return
            }
      
            const loginResponse = await UsersDAO.loginUser(user.email, user.encoded())
            if (!loginResponse.success) {
              res.status(500).json({ error: loginResponse.error })
              return
            }
            res.json({ auth_token: user.encoded(), info: user.toJson() })

          } catch (e) {
            res.status(400).json({ error: e })
            return
          }
    }
    static async logout(req, res) {
        try {
          const userJwt = req.get("Authorization").slice("Bearer ".length)
          console.log(`JWT: ${userJwt}`)
          const userObj = await User.decoded(userJwt)
          //console.log(`User: ${userObj.info}`)
          var { error } = userObj
          if (error) {
            res.status(401).json({ error })
            return
          }
          const logoutResult = await UsersDAO.logoutUser(userObj.email)
          var { error } = logoutResult
          if (error) {
            res.status(500).json({ error })
            return
          }
          res.json(logoutResult)
        } catch (e) {
          res.status(500).json(e)
        }
      }
      static async getLoginStatus(req, res) {
          try {
              const userJwt = req.get("Authorization").slice("Bearer ".length)
              console.log(`Token: ${userJwt}`)
              const isLoggedIn = await UsersDAO.checkLoginStatus(userJwt)
              if (isLoggedIn) {
                  res.json({isLoggedIn: true})
                  return
              }
              res.json({isLoggedIn: false})
          } catch (error) {
              res.status(500).json({msg: 'Server error.'})
          }
      }
}
module.exports.User = User;
