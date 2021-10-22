const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = 4000;
// const port = process.env.PORT || 5000;

//------middleware--------
app.use(cors());
app.use(express.json());

// user: mydbuser1
// pass: Ln98wj7hi7Oz1kkc




const uri = "mongodb+srv://mydbuser1:Ln98wj7hi7Oz1kkc@cluster0.mp2nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("foodMaster");
      const usersCollection = database.collection("users");

      //--------GET API-----------
      app.get('/users', async(req, res) =>{
          const cursor = usersCollection.find({});
          const users = await cursor.toArray();
          res.send(users);
      });

      //----------User Update------------
      app.get('/users/:id', async (req, res) =>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const user = await usersCollection.findOne(query);

          console.log('load user with id:', id);
          res.send(user);
      })
      

      //---------POST API---------
      app.post('/users', async(req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
      });


      //-------DELETE API-------
      app.delete('/users/:id', async (req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await usersCollection.deleteOne(query);

          console.log('deleting user with id', result);

          res.json(result);
      })

    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get ('/', (req, res) => {
    res.send('Running my CURD server');
});

app.listen(port, () => {
    console.log('Running Server on Port', port);
})
