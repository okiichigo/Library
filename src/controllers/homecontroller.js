const connection = require('../config/database')
const { getAllLirbary } = require("../services/SRUDservice")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const getHomepage = async (req, res) => {
    let results = await getAllLirbary();
    return res.send({ Listusers: results })
}
const gennerateToken = payload => {
    delete payload.UserName
    delete payload.Password
    delete payload.refreshtoken

    console.log("generate token payload", payload)
    const accessToken = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET)
    const refreshToken = jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET)
    return { accessToken, refreshToken }
}
const updateRefeshToken = async (user, refreshtoken) => {
    await connection.query(
        'update People SET refreshtoken = ? WHERE ID =?  ',
        [refreshtoken, user.ID])
}
const PostLoginUser = async (req, res) => {
    let username = req.body.UserName
    let password = req.body.Password

    let [results, fields] = await connection.query(
        'select * from People where UserName =? AND Password =?',
        [username, password])
    if (results && results.length > 0) {
        user = results[0]
    } else {
        user = {}
    }
    if (user.ID) {
        let tokens = gennerateToken(user)
        updateRefeshToken(user, tokens.refreshToken)
        res.json({ tokens })
        //create jwt
    } else {
        return res.send({ message: 'error' })
    }
}
const RouterToken = async (req, res) => {
    const refreshtoken = req.body.refreshToken
    console.log("before sql")
    let [results, fields] = await connection.query(
        'select * from People where refreshtoken =? ',
        [refreshtoken])
    console.log("after sql", results)
    if (results && results.length > 0) {
        user = results[0]
    } else {
        user = {}
    }
    if (user.ID) {
        try {
            console.log("verifying")
            jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET)
            const tokens = gennerateToken(user)
            updateRefeshToken(user, tokens.refreshToken)
            res.json({ tokens })

        } catch (error) {
            console.log(error)
            res.sendStatus(403)
        }
    } else {
        res.sendStatus(403)
    }
}
const LogoutToken = (req, res) => {
    let user = res.locals.user
    console.log("user", res.locals.user)
    if (user.ID) {
        updateRefeshToken(user, null)
        res.sendStatus(200)
    } else res.sendStatus(204)
}
const CreareClient = async (req, res) => {
    let name = req.body.Name
    let lastname = req.body.LastName
    let password = req.body.Password
    let username = req.body.UserName

    if (name == "" || lastname == "" || password == "" || username == "") {
        res.send({ message: "not enough information " })
    }
    else {
        try {
            await connection.query(
                `INSERT INTO People (Name,LastName,RoleID,Active,Password,UserName,refreshtoken)
    VALUES (?,?,?,?,?,?,?)`, [name, lastname, 4, true, password, username, null])
            let [results, fields] = await connection.query("SELECT * FROM People WHERE UserName =? AND Password=?", [username, password]);
            res.send({ results: results })
        }
        catch { res.send({ message: "username already exist" }) }

    }
}

const CreateUser = async (req, res) => {
    let name = req.body.Name
    let lastname = req.body.LastName
    let roleid = req.body.RoleID
    let password = req.body.Password
    let username = req.body.UserName
    let user = res.locals.user

    if (name == "" || lastname == "" || roleid == "" || password == "" || username == "") {
        res.send({ message: "not enough information " })
        return
    }

    if (user.RoleID == 1) {
        if (roleid == 1) {
            res.send({ message: "you can not create admin as an admin" })
        }
        else if (roleid == 2) {
            try {
                await connection.query(
                    `INSERT INTO People (Name,LastName,RoleID,Active,Password,UserName,refreshtoken)
                   VALUES (?,?,?,?,?,?,?)`, [name, lastname, roleid, true, password, username, null])
                let [results, fields] = await connection.query("SELECT * FROM People WHERE UserName =? AND Password=?", [username, password]);
                res.send({ newuser: results[0] })
            }
            catch { res.send({ message: "username already exist" }) }
        }
        else if (roleid == 3) {
            try {
                await connection.query(
                    `INSERT INTO People (Name,LastName,RoleID,Active,Password,UserName,refreshtoken)
               VALUES (?,?,?,?,?,?,?)`, [name, lastname, roleid, true, password, username, null])
                let [results, fields] = await connection.query("SELECT * FROM People WHERE UserName =? AND Password=?", [username, password]);
                res.send({ newuser: results[0] })
            }
            catch { res.send({ message: "username already exist" }) }
        }
        else if (roleid == 4) {
            try {
                await connection.query(
                    `INSERT INTO People (Name,LastName,RoleID,Active,Password,UserName,refreshtoken)
                   VALUES (?,?,?,?,?,?,?)`, [name, lastname, roleid, true, password, username, null])
                let [results, fields] = await connection.query("SELECT * FROM People WHERE UserName =? AND Password=?", [username, password]);
                res.send({ newuser: results[0] })
            }
            catch { res.send({ message: "username already exist" }) }

        }
    }
    else if (user.RoleID == 2) {
        if (roleid == 1) { res.send({ message: "you can not" }) }
        else if (roleid == 2) { res.send({ message: "you can not" }) }
        else if (roleid == 3) {
            try {
                await connection.query(
                    `INSERT INTO People (Name,LastName,RoleID,Active,Password,UserName,refreshtoken)
           VALUES (?,?,?,?,?,?,?)`, [name, lastname, roleid, true, password, username, null])
                let [results, fields] = await connection.query("SELECT * FROM People WHERE UserName =? AND Password=?", [username, password]);
                res.send({ newuser: results[0] })
            }
            catch { res.send({ message: "username already exist" }) }
        }
        else if (roleid == 4) {
            try {
                await connection.query(
                    `INSERT INTO People (Name,LastName,RoleID,Active,Password,UserName,refreshtoken)
   VALUES (?,?,?,?,?,?,?)`, [name, lastname, roleid, true, password, username, null])
                let [results, fields] = await connection.query("SELECT * FROM People WHERE UserName =? AND Password=?", [username, password]);
                res.send({ newuser: results[0] })
            }
            catch { res.send({ message: "username already exist" }) }
        }
    }
    else if (user.RoleID == 3) {
        if (roleid == 1) { res.send({ message: "you not admin" }) }
        else if (roleid == 2) { res.send({ message: "you not leader" }) }
        else if (roleid == 3) { res.send({ message: "You cannot create a new account" }) }
        else if (roleid == 4) {
            try {
                await connection.query(
                    `INSERT INTO People (Name,LastName,RoleID,Active,Password,UserName,refreshtoken)
           VALUES (?,?,?,?,?,?,?)`, [name, lastname, roleid, true, password, username, null])
                let [results, fields] = await connection.query("SELECT * FROM People WHERE UserName =? AND Password=?", [username, password]);
                res.send({ newuser: results[0] })
            }
            catch { res.send({ message: "username already exist" }) }
        }
    }
    else if (user.RoleID == 4) {
        if (roleid == 1) { res.send({ message: "you not admin" }) }
        else if (roleid == 2) { res.send({ message: "you not leader" }) }
        else if (roleid == 3) { res.send({ message: "you not staff" }) }
        else if (roleid == 4) { res.send({ message: "You cannot create a new account" }) }
    }
}

module.exports = { getHomepage, PostLoginUser, RouterToken, LogoutToken, CreareClient, CreateUser }