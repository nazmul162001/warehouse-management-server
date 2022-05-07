const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware//
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'unauthorized access'});
  }
  // verify Token
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
    if(err){
      return res.status(403).send({message: 'Forbidden access'})
    }
    console.log('decoded', decoded);
    req.decoded = decoded;
  })
  next();
}

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

    // JWT Auth
    app.post('/login', async(req,res)=>{
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
      });
      res.send({accessToken});
    })

    // my Service API
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
    app.get('/myitem', verifyJWT, async(req, res)=> {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      // console.log(email);
      if(email === decodedEmail){
        const query = {email: email};
        const cursor = foodCollection.find(query);
        const items = await cursor.toArray();
        res.send(items)
      }
      else{
        res.status(403).send({message: 'Forbidden access'})
      }
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
