const pool = require("../config");

async function logger(req, res, next) {
    const timestamp = new Date().toISOString().substring(0, 19)
    console.log(`${timestamp} | ${req.method}: ${req.originalUrl}`)
    next()
}

async function isLoggedIn(req, res, next) {

    let authorization = req.headers.authorization

    if (!authorization) {
        console.log("authorization")
        return res.status(401).send('You are not logged in')
    }
    let [part1, part2] = authorization.split(' ')
    if (part1 !== 'Bearer' || !part2) {
        return res.status(401).send('You are not logged in')
    }
    console.log("pass")
    // Check token
    const [tokens] = await pool.query('SELECT * FROM user WHERE token = ?', [part2])
    const token = tokens[0].token

    if (!token) {
        return res.status(401).send('You are not logged in')
    }

    // Set user
    const [users] = await pool.query(
        'SELECT * ' +
        'FROM user WHERE token = ?', [token]
    )
    req.user = users[0]

    next()
}

module.exports = {
    logger,
    isLoggedIn
}