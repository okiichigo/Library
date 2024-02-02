const { ObjectId } = require('mongodb')
const connection2 = require('./mongodata')
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

const CreateReservation1 = async (req, res) => {
    let bookid = req.body._id
    //let bookid = new ObjectId(req.body._id)
    let user = res.locals.users
    let reservationnumber
    let query
    let Reservationnumber2
    let bookactive = await connection2.collection('books').find({ _id: new ObjectId(bookid) }).toArray()
    console.log("bookactive", bookactive)
    if (bookactive && bookactive.length > 0) {
        bookactive = bookactive[0]
        if (bookactive.active == true && bookactive.borrowed == true) { res.send({ messege: 'you can not reservation' }) }
        else if (bookactive.active == true && bookactive.borrowed == false) {
            do {
                reservationnumber = CreateReservationnumber()
                query = { reservationnumber: reservationnumber }
                //let Reservationnumber = { reservationnumber }
                console.log("reservationnumber:", reservationnumber)
                let active = await connection2.collection('reservation').find(query).toArray()
                Reservationnumber2 = active
                console.log("res:", Reservationnumber2)
            }
            while (Reservationnumber2 && Reservationnumber2.length > 0)
            console.log("reservationnumber:", Reservationnumber2)
            if (user.RoleID == 4) {
                let book = {
                    reservationnumber,
                    staffid: null,
                    clientid: user._id,
                    bookid,
                    borrowday: null,
                    returnday: null,
                    borrowed: false,
                    returned: false
                }
                await connection2.collection('reservation').insertOne(book)
                let reservation = await connection2.collection('reservation').find(query).toArray()
                res.send({ "Reservation by Client": reservation[0] })
            }
            else {
                let book = {
                    reservationnumber,
                    staffid: user._id,
                    clientid: new ObjectId(req.body._id),
                    bookid,
                    borrowday: null,
                    returnday: null,
                    borrowed: false,
                    returned: false
                }
                await connection2.collection('reservation').insertOne(book)
                let reservation = await connection2.collection('reservation').find(query).toArray()
                console.log("reser:", reservation[0])
                res.send({ "Reservation by Staff": reservation[0] })
            }
        }
        else { res.send({ messege: 'this book deleted' }) }
    }
    else { res.send({ messege: 'not book ' }) }
}

const UpdateReservation1 = async (req, res) => {
    let query = { reservationnumber: req.body.reservationnumber }
    let borrowed = req.body.borrowed
    let returned = req.body.returned
    let user = res.locals.users
    console.log("borrow11:", borrowed)
    if (user.RoleID == 4) { res.send({ messenge: "you can not update reservation" }) }
    else {
        let active = await connection2.collection('reservation').find(query).toArray()
        console.log("active", active)
        if (active && active.length > 0) {
            active = active[0]

            let _id = new ObjectId(active.bookid)
            let id = { _id }

            if (borrowed == true) {
                console.log("borrow:", borrowed)
                if (active.borrowed == false) {
                    let newvalues = {
                        $set: {
                            borrowday: new Date(),
                            borrowed: true
                        }
                    }
                    await connection2.collection("reservation").updateOne(query, newvalues)
                    let response = await connection2.collection("books").updateOne(id, { $set: { borrowed: true } })
                    console.log("borrow response", response)
                    res.send({ messege: "updated" })
                }
                else { res.send({ message: "this book borrowed so you can't borrow" }) }
            }
            else if (returned == true) {
                if (active.returned == false && active.borrowed == true) {
                    let newvalues = {
                        $set: {
                            returnday: new Date(),
                            returned: true
                        }
                    }
                    let response = await connection2.collection("reservation").updateOne(query, newvalues)
                    let response2 = await connection2.collection("books").updateOne(id, { $set: { borrowed: false } })
                    console.log("response", response)
                    console.log("response2", response2)

                    res.send({ message: "returned" })
                }
                else { res.send({ message: "this book " }) }
            }
            else { res.send({ message: "not enought info" }) }
        }
        else { res.send({ messege: "reservation number does not exist" }) }
    }
}

const deleteReservation1 = async (req, res) => {
    let reservationnumber = { reservationnumber: req.body.reservationnumber }
    let user = res.locals.users
    let info = await connection2.collection('reservation').find(reservationnumber).toArray()
    if (info && info.length > 0) {
        info = info[0]
        if (info.borrowed == true && info.returned == false) { res.send({ messege: "this book has been loned" }) }
        else {
            if (user.roleid == 4) {
                if (info.clientid == user._id) {
                    await connection2.collection('reservation').deleteOne(reservationnumber)
                    res.send({ message: "DELETED" })
                }
                else { res.send({ message: "id doesn't match" }) }
            }
            else {
                await connection2.collection('reservation').deleteOne(reservationnumber)
                res.send({ message: "DELETED" })
            }
        }
    }
    else { res.send({ message: "reservation number does not exist" }) }

}

module.exports = { CreateReservationnumber, CreateReservation1, UpdateReservation1, deleteReservation1 }