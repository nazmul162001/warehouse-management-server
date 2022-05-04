const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware//
app.use(cors());
app.use(express.json());

//user
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
