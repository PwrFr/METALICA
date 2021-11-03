const express = require('express');
const path = require("path")
const pool = require('../config');
const Joi = require('joi')


router = express.Router();
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


router.get("/catalog/:catalogid", async function (req, res, next) {
    try {
        let sql = 'SELECT p.product_id, p.catalog_id, p.model, p.brand, p.detail, p.price,p.img_id, m.url FROM product AS p LEFT JOIN (SELECT * FROM image ) AS m ON p.img_id = m.img_id WHERE catalog_id=?;'
        let cond = [req.params.catalogid]
        const [rows, fields] = await pool.query(sql, cond);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json(err)
    }
});


const addProductSchema = Joi.object({
    catalogid: Joi.number().required(),
    model: Joi.string().required().max(20),
    brand: Joi.string().required().max(20),



})



router.post("/catalog", upload.single("myImage"), async function (req, res, next) {
    console.log("check")
    try {
        await addProductSchema.validateAsync(req.body, { abortEarly: false })

    } catch (err) {

        return res.status(400).send(err)
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Please upload a file" });
    }
    const catalogid = req.body.catalogid
    const model = req.body.model;
    const brand = req.body.brand;
    // Begin transaction
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {


        let results = await conn.query(
            'INSERT INTO image(url) VALUES(?);', [file.path.substring(6)]);
        const imgId = results[0].insertId;
        await conn.query(
            `INSERT INTO product(catalog_id, model, brand,img_id, create_date) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [catalogid, model, brand, imgId]
        );
        let sql = 'SELECT p.product_id, p.catalog_id, p.model, p.brand, p.detail, p.price,p.img_id, m.url FROM product p LEFT JOIN (SELECT * FROM image) AS m ON p.img_id = m.img_id ORDER BY product_id DESC LIMIT 1;'
        let cond = []
        const [rows, fields] = await conn.query(sql, cond);
        await conn.commit();
        return res.json(rows);
    } catch (err) {
        console.log(err)
        await conn.rollback();
        return res.status(400).json(err);
    } finally {
        conn.release();
    }
});

router.delete("/catalog/:productid", async function (req, res, next) {
    const productid = req.params.productid
    const imgid = req.query.imgid
    // Your code here
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();

    try {
        // Check that there is no comments
        console.log(req)
        await conn.query('DELETE FROM `product` WHERE product_id = ?', [productid])
        await conn.query('DELETE FROM `image` WHERE img_id = ?', [imgid])

        await conn.commit()
        res.status(204).send()
    } catch (err) {
        console.log(err)
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        conn.release();
    }
});



exports.router = router;