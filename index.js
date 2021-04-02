const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

app.use(bodyParser.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9mirr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    // database collection
  const products = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
  const orders = client.db(process.env.DB_NAME).collection('orders');

  console.log('Database Connected');


  app.post('/addProduct', (req, res) => {
      const allProduct = req.body;
      products.insertOne(allProduct)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })

  })

  app.get('/products', (req, res) => {
      products.find({}).limit(20)
      .toArray( (err,document) =>{
          res.send(document)
      })
  })

  app.get('/product/:key', (req, res) => {
      products.find({key:req.params.key})
      .toArray( (err,document) =>{
          res.send(document[0])
      })
  })
  app.post('/productByKeys', (req, res) => {
      const productKeys = req.body
      products.find({key: {$in: productKeys}})
      .toArray( (err,document) =>{
          res.send(document)
      })
  })


  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orders.insertOne(order)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
    })

})


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || 8080)