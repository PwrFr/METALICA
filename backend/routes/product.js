const express = require('express');
const pool = require('../config');

const path = require("path")
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


router.put("/product", upload.single("myImage"), async function (req, res, next) {
    const file = req.file;
    const productid = req.body.productid
    const model = req.body.model
    const brand = req.body.brand
    const imgid = req.body.imgid
    // Begin transaction
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
        console.log(file)
        if (!file) {
            console.log(model)
            console.log(brand)
            console.log(productid)

            await conn.query('UPDATE product SET model=?, brand=? WHERE product_id =?', [model, brand, productid]);
            await conn.commit()

            console.log("NO image")
        } else {
            await conn.query('UPDATE image SET url=? WHERE img_id =?', [file.path.substring(6), imgid]);
            await conn.query('UPDATE product SET model=?, brand=? WHERE product_id =?', [model, brand, productid]);
            let sql = 'SELECT url FROM image WHERE img_id=?;'
            let cond = [imgid]
            const [rows, fields] = await conn.query(sql, cond);
            console.log("HAVE image")

            await conn.commit();
            return res.json(rows[0].url);
        }
    } catch (err) {
        console.log(err)
        await conn.rollback();
        return res.status(400).json(err);
    } finally {
        conn.release();
    }
});




exports.router = router;
