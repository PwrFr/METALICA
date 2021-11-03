const express = require('express');
const pool = require('../config');
const Joi = require('joi')

const path = require("path")
const multer = require("multer");
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./static/uploads");
    },
    filename: function (req, file, callback) {
        callback(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage });
router = express.Router();

const detailSchema = Joi.object({
    productid: Joi.number().required(),
    price: Joi.number().required(),


})


router.put("/detail", upload.single(""), async function (req, res, next) {
    try {
        await detailSchema.validateAsync(req.body, { abortEarly: false })

    } catch (err) {

        return res.status(400).send(err)
    }
    // Your code here
    const productid = req.body.productid
    const price = req.body.price
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {

        await conn.query('UPDATE product SET price=? WHERE product_id=?', [price, productid]);
        let sql = 'SELECT price from product where product_id =?'
        let cond = [productid]
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



exports.router = router;
