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


router.get("/orderhistory/:userid", async function (req, res, next) {
    try {
        let sql = 'select a.user_id, a.date, b.brand, b.model,b.price, b.url from (SELECT o.* FROM user AS u LEFT JOIN (SELECT * FROM orderhistory ) AS o	ON u.user_id = o.user_id WHERE u.user_id = ?) as a LEFT JOIN (SELECT p.product_id,p.brand,p.model,p.price, m.url FROM product AS p LEFT JOIN (SELECT * FROM image) AS m ON p.img_id = m.img_id) as b ON a.product_id = b.product_id'
        let cond = [req.params.userid]
        const [rows, fields] = await pool.query(sql, cond);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json(err)
    }
});




const orderSchema = Joi.object({
    userid: Joi.number().required(),
    productid: Joi.number().required(),


})


router.post("/order", upload.single(), async function (req, res, next) {
    try {
        await orderSchema.validateAsync(req.body, { abortEarly: false })

    } catch (err) {

        return res.status(400).send(err)
    }
    // Your code here
    const userid = req.body.userid
    const productid = req.body.productid
    console.log(userid)
    console.log(productid)

    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query('INSERT INTO `orderhistory`(user_id, product_id, saler_id, date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', [userid, productid, 1]);
        await conn.commit()
        res.send("success!");
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }

});



exports.router = router;
