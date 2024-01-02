const connection = require('../config/database')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const CreateBooks = async (req, res) => {
    let title = req.body.Title
    let writer = req.body.Writer
    let categoryid = req.body.CategoryID
    let summery = req.body.Summery
    let user = res.locals.user

    if (user.RoleID == 4) { res.sendStatus(404) }
    else
        try {
            await connection.query(
                `INSERT INTO Books (Title,Writer,CategoryID,Summery)
           VALUES (?,?,?,?)`, [title, writer, categoryid, summery])
            let [results, fields] = await connection.query("SELECT * FROM Books WHERE  Title =? ", [title]);
            res.send({ newBook: results })
        }
        catch (error) {
            console.log(error)
            res.send({ message: "book already exist" })
        }
}

const UpdateBook = async (req, res) => {
    let title = req.body.Title
    let writer = req.body.Writer
    let categoryid = req.body.CategoryID
    let summery = req.body.Summery
    let bookid = req.body.BookID
    let user = res.locals.user

    if (user.RoleID == 4) { res.sendStatus(404) }
    else {
        let [results, fields] = await connection.query('select *from Books Where BookID= ?', [bookid])
        if (results && results.length > 0) {
            await connection.query(
                `UPDATE Books SET Title = ?,Writer =? ,CategoryID= ?, Summery = ?
                     WHERE BookID = ?`, [title, writer, categoryid, summery, bookid])
            res.send({ message: "updated" })
        }
        else { res.send({ message: "not book" }) }
    }
}
const deleteBook = async (req, res) => {
    let
}

module.exports = { CreateBooks, UpdateBook }