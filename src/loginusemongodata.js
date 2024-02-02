const connection2 = require('../src/mongodata')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const gennerateToken = payload => {
    delete payload.username
    delete payload.password
    delete payload.refreshtoken

    console.log("generate token payload", payload)
    const accessToken = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET)
    const refreshToken = jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET)
    return { accessToken, refreshToken }
}
const updateRefeshToken = async (user, refreshtoken) => {
    let myquery = { _id: user._id }
    let newvalues = { $set: { refreshtoken: refreshtoken } }
    await connection2.collection("people").updateOne(myquery, newvalues)
}

const PostLoginUser1 = async (req, res) => {
    let query = {
        username: req.body.username,
        password: req.body.password
    }
    let user = await connection2.collection('people').find(query).toArray()
    if (user && user.length > 0) {
        user = user[0]
    }
    else {
        res.send({ message: "not id" })
    }
    if (user._id) {
        let tokens = gennerateToken(user)
        updateRefeshToken(user, tokens.refreshToken)
        res.json({ tokens })
        //create jwt
    } else {
        return res.send({ message: 'error' })
    }
}
const RouterToken1 = async (req, res) => {
    let query = {
        refreshtoken: req.body.refreshtoken
    }
    let user = await connection2.collection('people').find(query).toArray()
    if (user && user.length > 0) {
        user = user[0]
        console.log("user:", user)
    }
    else {
        res.send({ message: "not id" })
    }
    if (user._id) {
        try {
            console.log("verifying")
            jwt.verify(user.refreshtoken, process.env.REFRESH_TOKEN_SECRET)
            const tokens = gennerateToken(user)
            updateRefeshToken(user, tokens.refreshToken)
            res.send({ tokens })
        } catch (error) {
            console.log(error)
            res.send({ message: "can not" })
        }
    } else {
        res.send({ message: "id undified" })
    }
}

const LogoutToken1 = (req, res) => {
    let user = res.locals.users
    console.log("user", res.locals.users)
    if (user._id) {
        updateRefeshToken(user, null)
        res.send({ message: "logout" })
    } else res.send({ message: "you can not logout" })
}


module.exports = { PostLoginUser1, RouterToken1, LogoutToken1 }