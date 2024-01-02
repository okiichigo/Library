const connection = require('../config/database')

const getAllLirbary = async () => {
    let [results, fields] = await connection.query('select * from People')
    return results
}
module.exports = { getAllLirbary }