const connection2 = require('../src/mongodata')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const CreateClient1 = async (req, res, err) => {
    var name = req.body.name
    var lastname = req.body.lastname
    var password = req.body.password
    var username = req.body.username

    if (name == "" || lastname == "" || password == "" || username == "") {
        res.send({ message: "not enough information " })
    }
    let myobj = {
        name,
        lastname,
        roleid: 4,
        active: true,
        password,
        username,
        refreshtoken: null
    }
    try {
        await connection2.collection('people').insertOne(myobj)
        //connection2.people.createIndex({ password: 1 }, { unique: true }
        //await connection2.collection('people').createIndex({ password: 1 }, { unique: true })
        let user = await connection2.collection('people').find(myobj).toArray()
        console.log("user:", user)
        if (user && user.length > 0) {
            user = user[0]
            res.send({ user: user })
            console.log("user:", user)
        }
        else {
            res.send({ message: "not id" })
        }
    }
    catch (err) { res.send({ message: "username already exist" }) }
}

const CreateUser1 = async (req, res) => {
    let name = req.body.name
    let lastname = req.body.lastname
    let roleid = req.body.roleid
    let password = req.body.password
    let username = req.body.username
    let user = res.locals.users
    if (name == "" || lastname == "" || roleid == "" || password == "" || username == "") {
        res.send({ message: "not enough information " })
        return
    }
    let myobj = {
        name,
        lastname,
        roleid,
        active: true,
        password,
        username,
        refreshtoken: null
    }

    if (user.roleid == 1) {
        if (roleid == 1) {
            res.send({ message: "you can not create admin as an admin" })
        }
        else if (roleid == 2) {
            try {
                await connection2.collection('people').insertOne(myobj)
                let user = await connection2.collection('people').find(myobj).toArray()
                if (user && user.length > 0) { res.send({ user: user[0] }) }
                else { res.send({ message: "not id" }) }
            }
            catch { res.send({ message: "username already exist" }) }
        }
        else if (roleid == 3) {
            try {
                await connection2.collection('people').insertOne(myobj)
                let user = await connection2.collection('people').find(myobj).toArray()
                if (user && user.length > 0) { res.send({ user: user[0] }) }
                else { res.send({ message: "not id" }) }
            }
            catch { res.send({ message: "username already exist" }) }
        }

        else if (roleid == 4) {
            try {
                await connection2.collection('people').insertOne(myobj)
                let user = await connection2.collection('people').find(myobj).toArray()
                if (user && user.length > 0) { res.send({ user: user[0] }) }
                else { res.send({ message: "not id" }) }
            }
            catch { res.send({ message: "username already exist" }) }

        }
    }

    else if (user.roleid == 2) {
        if (roleid == 1) { res.send({ message: "you can not" }) }
        else if (roleid == 2) { res.send({ message: "you can not" }) }
        else if (roleid == 3) {
            try {
                await connection2.collection('people').insertOne(myobj)
                let user = await connection2.collection('people').find(myobj).toArray()
                if (user && user.length > 0) { res.send({ user: user[0] }) }
                else { res.send({ message: "not id" }) }
            }
            catch { res.send({ message: "username already exist" }) }
        }
        else if (roleid == 4) {
            try {
                await connection2.collection('people').insertOne(myobj)
                let user = await connection2.collection('people').find(myobj).toArray()
                if (user && user.length > 0) { res.send({ user: user[0] }) }
                else { res.send({ message: "not id" }) }
            }
            catch { res.send({ message: "username already exist" }) }
        }
    }

    else if (user.roleid == 3) {
        if (roleid == 1) { res.send({ message: "you not admin" }) }
        else if (roleid == 2) { res.send({ message: "you not leader" }) }
        else if (roleid == 3) { res.send({ message: "You cannot create a new account" }) }
        else if (roleid == 4) {
            try {
                await connection2.collection('people').insertOne(myobj)
                let user = await connection2.collection('people').find(myobj).toArray()
                if (user && user.length > 0) { res.send({ user: user[0] }) }
                else { res.send({ message: "not id" }) }
            }
            catch { res.send({ message: "username already exist" }) }
        }
    }
    else if (user.roleid == 4) {
        if (roleid == 1) { res.send({ message: "you not admin" }) }
        else if (roleid == 2) { res.send({ message: "you not leader" }) }
        else if (roleid == 3) { res.send({ message: "you not staff" }) }
        else if (roleid == 4) { res.send({ message: "You cannot create a new account" }) }
    }
}

module.exports = { CreateClient1, CreateUser1 }