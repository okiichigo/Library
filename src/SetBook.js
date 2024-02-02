console.log('abc');
const { ObjectId } = require('mongodb')
const connection2 = require('./mongodata')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const CreateBooks1 = async (req, res) => {
    let title = req.body.title
    let writer = req.body.writer
    let categoryid = req.body.categoryid
    let summary = req.body.summary
    let user = res.locals.users

    if (title == "" || writer == "" || categoryid == "") {
        res.send({ message: "not enough information " })
    }
    else {
        if (user.roleid == 4) { res.send({ message: "you can't create new book " }) }
        else {
            let myobj = {
                title,
                writer,
                categoryid,
                summary,
                active: true,
                borrowed: false,
            }
            try {
                await connection2.collection('books').insertOne(myobj)
                let user = await connection2.collection('books').find(myobj).toArray()
                res.send({ newbook: user[0] })
            }
            catch (error) {
                console.log(error)
                res.send({ message: "book already exist" })
            }
        }
    }
}

const UpdateBook1 = async (req, res) => {

    let title = req.body.title
    let bookid = req.body._id
    let writer = req.body.writer
    let categoryid = req.body.categoryid
    let summary = req.body.summary
    let user = res.locals.users

    console.log("write:", bookid)
    if (user.roleid == 4) { res.send({ message: "you can't update book" }) }
    else {
        let user = await connection2.collection('books').find({ _id: new ObjectId(bookid) }).toArray()
        if (user && user.length > 0) {
            let book = user[0]
            console.log("write:", book)
            if (title && title.length > 0) {
                book.title = title
            }
            if (writer && writer.length > 0) {
                book.writer = writer
            }
            if (categoryid && categoryid.length > 0) {
                book.categoryid = categoryid
            }
            if (summary && summary.length > 0) {
                book.summary = summary
            }
            let newvalues = {
                $set: {
                    title: book.title,
                    writer: book.writer,
                    categoryid: book.categoryid,
                    summary: book.summary

                }
            }
            await connection2.collection("books").updateOne({ _id: new ObjectId(bookid) }, newvalues)
            res.send({ messege: "updated" })
        }
        else { res.send({ message: "not book" }) }
    }
}

const deleteBook1 = async (req, res) => {
    let bookid = req.body._id
    let user = res.locals.users

    if (user.RoleID == 4) { res.send({ message: "you can't delete book" }) }
    else {
        let user = await connection2.collection('books').find({ _id: new ObjectId(bookid) }).toArray()
        if (user && user.length > 0) {
            let newvalues = {
                $set: {
                    active: false
                }
            }
            await connection2.collection("books").updateOne({ _id: new ObjectId(bookid) }, newvalues)
            res.send({ message: "DELETED" })
        }
        else { res.send({ message: "not book" }) }
    }
}
module.exports = { CreateBooks1, UpdateBook1, deleteBook1 }