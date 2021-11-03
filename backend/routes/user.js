const express = require('express');
const pool = require('../config');
const Joi = require('joi')
const path = require("path")
const bcrypt = require('bcrypt')
const { generateToken } = require("../utils/token");
const { isLoggedIn } = require('../middlewares')
// SET STORAGE

router = express.Router();


const usernameValidator = async (value, helpers) => {
    const [rows, _] = await pool.query("SELECT user_name FROM user WHERE user_name = ?", [value])
    if (rows.length > 0) {
        const message = 'This username is already taken'
        throw new Joi.ValidationError(message, { message })
    }
    return value
}

const passwordValidator = (value, helpers) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}




const signupSchema = Joi.object({
    username: Joi.string().required().min(5).max(20).external(usernameValidator),
    password: Joi.string().required().custom(passwordValidator),
    confirm_password: Joi.string().required().valid(Joi.ref('password')),
    address: Joi.string().required().min(20),

})



router.post("/register", async function (req, res, next) {
    try {
        await signupSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 5)
    const address = req.body.address
    const role = "User"
    try {
        await conn.query(
            'INSERT INTO user(user_name, user_password, user_role, user_address) VALUES (?, ?, ?, ?);',
            [username, password, role, address]
        )
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
});



const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})


router.post('/login', async (req, res, next) => {
    try {
        await loginSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const username = req.body.username
    const password = req.body.password
    console.log(username)
    console.log(password)

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        // Check if username is correct
        const [users] = await conn.query(
            'SELECT * FROM user WHERE user_name=?',
            [username]
        )
        const user = users[0]
        if (!user) {
            throw new Error('Incorrect username or password')
        }


        // Check if password is correct
        if (!(await bcrypt.compare(password, user.user_password))) {
            throw new Error('Incorrect username or password')
        }

        // Check if token already existed
        const [tokens] = await conn.query(
            'SELECT token FROM user WHERE user_id=?',
            [user.user_id]
        )

        let token = tokens[0]?.token
        if (!token) {
            // Generate and save token into database
            token = generateToken()
            await conn.query(
                'UPDATE user SET token=? WHERE user_id=?',
                [token, user.user_id]
            )
        }

        conn.commit()
        res.status(200).json({ 'token': token })
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }
})


const userSchema = Joi.object({
    userid: Joi.number().required(),
    username: Joi.string().required().min(5).max(20).external(usernameValidator),
})


router.put("/edituser", async function (req, res, next) {
    try {
        await userSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    // Your code here
    const userid = req.body.userid
    const username = req.body.username
    console.log("Edit")


    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query('UPDATE user SET user_name=? WHERE user_id=?', [username, userid]);
        let sql = 'SELECT user_name  from user where user_id =?'
        let cond = [userid]
        const [rows, fields] = await conn.query(sql, cond);
        await conn.commit()
        return res.json(rows);
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
    return;
});


const addressSchema = Joi.object({
    userid: Joi.number().required(),
    address: Joi.string().required().min(20),
})


router.put("/editaddress", async function (req, res, next) {
    try {
        await addressSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    // Your code here
    const userid = req.body.userid
    const address = req.body.address
    console.log(userid)

    console.log(address)


    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query('UPDATE user SET user_address=? WHERE user_id=?', [address, userid]);
        let sql = 'SELECT user_address  from user where user_id =?'
        let cond = [userid]
        const [rows, fields] = await conn.query(sql, cond);
        await conn.commit()
        return res.json(rows);
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
    return;
});





router.get('/user/me', isLoggedIn, async (req, res, next) => {
    console.log("check")

    res.json(req.user)
})

exports.router = router;
