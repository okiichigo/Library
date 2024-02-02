
const express = require('express')
const connection = require('../config/database')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const CreateReservationnumber = () => {
    let reservationnumber = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i, i = 0; i < 6; i++) {
        reservationnumber += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return reservationnumber
}
const CreateReservation = async (req, res) => {
    let clientid = req.body.ClientID
    let bookid = req.body.BookID
    let user = res.locals.user
    let Reservationnumber
    let reservationnumber
    let Active
    let Bookactive
    let bookactive = await connection.query('select * from Books where BookID =? ', [bookid])
    if (bookactive && bookactive.length > 0) {
        Bookactive = bookactive[0][0]
        if (Bookactive.Active == 1) {
            let [results, fields] = await connection.query('select * from Reservation where BookID = ? ', [bookid])
            if (results && results.length > 0) {
                Active = results[0]
                if (Active.Borrowed == 1) { res.send({ messege: 'you can not reservation' }) }
                else (res.send({ messege: "reservating" }))
            }
            else {
                do {
                    reservationnumber = CreateReservationnumber()
                    console.log("reservationnumber:", reservationnumber)
                    let [results, fields] = await connection.query('select ReservationNumber from Reservation where ReservationNumber = ? ', [reservationnumber])
                    Reservationnumber = results
                }
                while (Reservationnumber && Reservationnumber.length > 0)
                console.log("reservationnumber:", Reservationnumber)
                if (user.RoleID == 4) {
                    await connection.query(
                        `INSERT INTO Reservation (ReservationNumber,StaffID,ClientID,BookID,BorrowDay,ReturnDay,Borrowed,Returned)
                         VALUES (?,?,?,?,?,?,?,?)`, [reservationnumber, null, user.ID, bookid, null, null, false, false])
                    let [results, fields] = await connection.query("SELECT * FROM Reservation WHERE  ReservationNumber  =? ", [reservationnumber]);
                    res.send({ reservationBookbyClient: results[0] })
                }
                else {
                    await connection.query(
                        `INSERT INTO Reservation (ReservationNumber,StaffID,ClientID,BookID,BorrowDay,ReturnDay,Borrowed,Returned)
                         VALUES (?,?,?,?,?,?,?,?)`, [reservationnumber, user.ID, clientid, bookid, null, null, false, false])
                    let [results, fields] = await connection.query("SELECT * FROM Reservation WHERE  ReservationNumber  =? ", [reservationnumber]);
                    res.send({ reservationBookbyStaff: results[0] })
                }
            }
        }
        else { res.send({ messege: 'not book here' }) }
    }
    else { res.send({ messege: 'not here' }) }
}

const UpdateReservation = async (req, res) => {
    let reservationnumber = req.body.ReservationNumber
    let borrowed = req.body.Borrowed
    let returned = req.body.Returned
    let user = res.locals.user
    let Update

    if (user.RoleID == 4) { res.send({ messenge: "you can not update reservation" }) }
    else {
        let [results, fields] = await connection.query(
            `select * from Reservation where ReservationNumber = ?  `, [reservationnumber])
        if (results && results.length > 0) {
            let active = results[0]
            if (borrowed && borrowed.length > 0) {
                if (active.Borrowed == 0) {
                    active.Borrowed = borrowed
                    active.BorrowDay = new Date()
                    await connection.query(`UPDATE Reservation SET BorrowDay=? ,ReturnDay=?, Borrowed = ? , Returned=?
                    WHERE ReservationNumber = ?`, [active.BorrowDay, null, active.Borrowed, 0, reservationnumber])
                    let update = await connection.query(`SELECT * FROM Reservation 
            WHERE  ReservationNumber  = ? `, [reservationnumber])
                    Update = update[0][0]
                    res.send({ returned: Update })
                }
                else { res.send({ message: "borrowed the book" }) }
            }
            if (returned && returned.length > 0) {
                if (active.Returned == 0) {
                    active.Returned = returned
                    active.ReturnDay = new Date()
                    await connection.query(`UPDATE Reservation SET BorrowDay=? ,ReturnDay=?, Borrowed = ? , Returned=?
                    WHERE ReservationNumber = ?`, [active.BorrowDay, active.ReturnDay, active.Borrowed, active.Returned, reservationnumber])
                    let update = await connection.query(`SELECT * FROM Reservation 
            WHERE  ReservationNumber  = ? `, [reservationnumber])
                    Update = update[0][0]
                    res.send({ returned: Update })
                }
                else { res.send({ message: "returned the book" }) }
            }
        }
        else { res.send({ messege: "reservation number does not exist" }) }
    }
}

const deleteReservation = async (req, res) => {
    let reservationnumber = req.body.ReservationNumber
    let user = res.locals.user
    let [results, fields] = await connection.query(
        `select * from Reservation where 
        ReservationNumber = ?  `, [reservationnumber])
    if (results && results.length > 0) {
        info = results[0]
        if (info.Borrowed == 1) { res.send({ messege: "this book has been loned" }) }
        else {
            if (user.RoleID == 4) {
                if (info.ClientID == user.ID) {
                    await connection.query(
                        `DELETE FROM Reservation WHERE ReservationNumber= ?`, [reservationnumber])
                    res.send({ message: "DELETED" })
                }
                else { res.send({ message: "id doesn't match" }) }
            }
            else {
                await connection.query(
                    `DELETE FROM Reservation WHERE ReservationNumber= ?`, [reservationnumber])
                res.send({ message: "DELETED" })
            }

        }
    }
    else { res.send({ message: "reservation number does not exist" }) }

}
module.exports = { CreateReservation, CreateReservationnumber, UpdateReservation, deleteReservation }