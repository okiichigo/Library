const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)
    try {
        console.log("token", token)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            console.log(err, data)
            if (err) res.sendStatus(403)
            res.locals.user = data.payload
            next()
        })

        //const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //console.log(decoded.RoleID)
        //return (decoded.RoleID)
    } catch (error) {
        console.log(error)
        return res.sendStatus(403)
    }
}
module.exports = verifyToken
