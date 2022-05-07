const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware//
app.use(cors());
app.use(express.json());

// old user
//foodieStore
//9zZd4ROMklAfyzu4

//new user
//foodStore
//9aQdPEAHjVwdyQ5B

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehy4q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const foodCollection = client.db('foodStore').collection('service');

    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = foodCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // dynamic API
    app.get('/service/:id', async(req, res)=> {
      // console.log(req.params);
      const result = await foodCollection.findOne({_id: ObjectId(req.params.id)})
      res.send(result)
    })

    // add new item API // POST
    app.post('/service', async(req,res) =>{
      const product = req.body;
      // console.log(product);
      const result = await foodCollection.insertOne(product);
      res.send({success: 'product upload success'})
    })

    // Delete item 
    app.delete('/service/:id', async(req,res)=>{
      const id = req.params.id
      const filter = {_id: ObjectId(id)};
      const result = await foodCollection.deleteOne(filter)
      res.send(result)
    })


     // update quantity
     app.put("/service/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: req.body,
      };
      const result = await foodCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    // My item Api
    app.get('/myitem', async(req, res)=> {
      const email = req.query.email;
      // console.log(email);
      const query = {email: email};
      const cursor = foodCollection.find(query);
      const items = await cursor.toArray();
      res.send(items)
    })



  } 
  finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running My Foodie Store');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
