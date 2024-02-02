const jwt = require('jsonwebtoken')

const verifyToken1 = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)
    try {
        console.log("token", token)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            console.log(err, data)
            if (err) { res.send({ message: "not logging" }) }
            res.locals.users = data.payload
            next()
        })
    } catch (error) {
        console.log(error)
        return res.send({ message: "can not login" })
    }
}
module.exports = verifyToken1
