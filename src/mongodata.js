

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://0.0.0.0:27017/";

const client = new MongoClient(url);
const connection = client.db('LibraryManagment')

module.exports = connection

// const mongodata = async (req, res) => {
//     console.log("in")
    
//     var query = { name: "fere" };
//     console.log("db", db)
//     //const docs = await db.collection('people').countDocuments()

//     const docs = await db.collection('people').findOne(query)

//     res.send({ totaldocs: docs })
// }

// module.exports = { mongodata }