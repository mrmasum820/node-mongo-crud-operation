const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const objectId = require('mongodb').ObjectId;


const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

//db user = mydbuser2
//db password = AalmO541HeghH6Fr


const uri = "mongodb+srv://mydbuser2:AalmO541HeghH6Fr@cluster0.krzjo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("food");
        const usersCollections = database.collection("recipes");

        //get api
        app.get('/users', async (req, res) => {
            const cursor = usersCollections.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) }
            const user = await usersCollections.findOne(query);
            console.log('load user with id', id)
            res.send(user);
        })

        //post api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollections.insertOne(newUser);
            console.log('got new user', req.body)
            console.log('added user', result)
            res.json(result);
        })

        //put api / update
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: objectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollections.updateOne(filter, updateDoc, options);
            console.log('updating user', id)
            res.json(result);
        })

        //delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await usersCollections.deleteOne(query);
            console.log('deleting with id', result)
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('My node mongoDB crud server')
})

app.listen(port, () => {
    console.log('server is running', port)
})