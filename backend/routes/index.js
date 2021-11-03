const express = require('express');
const pool = require('../config');

router = express.Router();


router.get("/", async function (req, res, next) {
    try {
        let sql = 'select a.instrument_id, a.title, a.url InstrumentImg, b.catalog_id, b.name, b.url CatalogImg from (SELECT i.instrument_id, i.title, m.url FROM instrument AS i LEFT JOIN (SELECT * FROM image ) AS m ON i.img_id = m.img_id)as a LEFT JOIN (SELECT c.catalog_id, c.instrument_id,c.name, m.url FROM catalog AS c LEFT JOIN (SELECT * FROM image) AS m ON c.img_id = m.img_id) as b on a.instrument_id = b.instrument_id'
        let cond = []
        const [rows, fields] = await pool.query(sql, cond);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json(err)
    }
});


exports.router = router;
