const connection = require('../config/database')
const connection2 = require('../mongodata')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const CreateBooks = async (req, res) => {
    let title = req.body.Title
    let writer = req.body.Writer
    let categoryid = req.body.CategoryID
    let summery = req.body.Summery
    let user = res.locals.user

    if (title == "" || writer == "" || categoryid == "") {
        res.send({ message: "not enough information " })
    }
    else {
        if (user.RoleID == 4) { res.send({ message: "you can't create new book " }) }
        else {
            try {
                book = await connection.query(
                    `INSERT INTO Books (Title,Writer,CategoryID,Summery,Active)
           VALUES (?,?,?,?,?)`, [title, writer, categoryid, summery, 1])
                console.log("book", book)
                let [results, fields] = await connection.query("SELECT * FROM Books WHERE  Title =? ", [title]);
                res.send({ newBook: results[0] })
            }
            catch (error) {
                console.log(error)
                res.send({ message: "book already exist" })
            }
        }
    }
}

const UpdateBook = async (req, res) => {
    let title = req.body.Title
    let bookid = req.body.BookID
    let writer = req.body.Writer
    let categoryid = req.body.CategoryID
    let summery = req.body.Summery
    let user = res.locals.user
    console.log("write:", bookid)

    if (user.RoleID == 4) { res.send({ message: "you can't update book" }) }
    else {
        let [results, fields] = await connection.query('select *from Books Where BookID= ?', [bookid])
        if (results && results.length > 0) {
            let book = results[0]
            console.log("write:", book)
            if (title && title.length > 0) {
                book.Title = title
            }
            if (writer && writer.length > 0) {
                book.Writer = writer
            }
            if (categoryid && categoryid.length > 0) {
                book.CategoryID = categoryid
            }
            if (summery && summery.length > 0) {
                book.Summery = summery
            }

            await connection.query(
                `UPDATE Books SET Title = ? ,Writer = ? ,CategoryID = ? ,Summery = ?
                     WHERE BookID = ?`, [book.Title, book.Writer, book.CategoryID, book.Summery, bookid])
            res.send({ message: "updated book" })
        }
        else { res.send({ message: "not book" }) }
    }
}


const deleteBook = async (req, res) => {
    let bookid = req.body.BookID
    let user = res.locals.user

    if (user.RoleID == 4) { res.send({ message: "you can't delete book" }) }
    else {
        let [results, fields] = await connection.query('select *from Books Where BookID= ?', [bookid])
        if (results && results.length > 0) {
            await connection.query(
                `UPDATE Books SET Active
                 = ? WHERE BookID = ?`, [0, bookid])
            res.send({ message: "DELETED" })
        }
        else { res.send({ message: "not book" }) }
    }
}

const bookList = async (req, res) => {
    //const docs = await connection2.collection('books').countDocuments()

    var query = { name: "fere" };
    const docs = await connection2.collection('people').findOne(query)

    res.send({ totalbooks: docs })
}

module.exports = { CreateBooks, deleteBook, UpdateBook, bookList }