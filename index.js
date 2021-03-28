const express = require('express')
require('dotenv').config()
const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wszk2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


//middle war
const app = express()
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

  const products = client.db(`${process.env.DB_NAME}`).collection("products")
  const orders = client.db(`${process.env.DB_NAME}`).collection("orders")

    app.post('/addProduct', (req,res) => {
        const product = req.body
            products.insertMany(product)
            .then(result=> {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/products',(req,res) => {
            products.find({})
            .toArray((err,documents)=> {
                res.send(documents)
            })
    })

    app.get('/product/:key',(req,res) => {
            products.find({key: req.params.key})
            .toArray((err,document)=> {
                res.send(document[0])
            })
    })

    app.post('/productsByKeys',(req,res) => {
            const productKeys = req.body
            products.find({key: {$in: productKeys }})
            .toArray((err,documents)=> {
                res.send(documents)
            })
    })

    app.post('/addOrders', (req,res) => {
        const order = req.body
            orders.insertOne(order)
            .then(result=> {
                console.log(result.insertedCount);
                res.status(200).send(result.insertedCount)
            })
    })
    

    app.get('/', (req,res) => {
        res.send('Hello Im From Root')
    })

});
app.listen(process.env.PORT ||port);