const express = require("express")
var cors = require('cors')
const app = express();
const { logger } = require('./middlewares')
app.use(logger)
app.use(cors())
// Statics
app.use(express.static('static'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// routers
const indexRouter = require('./routes/index')
const catalogRouter = require('./routes/catalog')
const productRouter = require('./routes/product')
const detailRouter = require('./routes/detail')
const userRouter = require('./routes/user')
const orderRouter = require('./routes/order')



app.use(detailRouter.router)
app.use(userRouter.router)
app.use(orderRouter.router)
app.use(indexRouter.router)
app.use(catalogRouter.router)
app.use(productRouter.router)




app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})