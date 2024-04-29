const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 8000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ev0lfe7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristCollection = client.db('touristDB').collection('tourist')


    app.get('/addTouristsSpot', async(req,res) => {
        const cursor = touristCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })

    // view details
    app.get('/addTouristsSpot/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await touristCollection.findOne(query)
        res.send(result)
    })

    // my list
    app.get('/myList/:email', async(req, res) => {
        console.log(req.params.email);
        const result = await touristCollection.find({email:req.params.email}).toArray()
        res.send(result);
    })


    app.post('/addTouristsSpot', async(req, res)=>{
        const newSpot = req.body
        console.log(newSpot)
        const result = await touristCollection.insertOne(newSpot)
        res.send(result)
    })


    app.delete('/addTouristsSpot/:id', async(req, res) => {
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await touristCollection.deleteOne(query)
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Assignment server is running')
})


app.listen(port, () => {
    console.log(`Assignment server is running on port: ${port}`);
})