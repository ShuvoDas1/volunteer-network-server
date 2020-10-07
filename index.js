const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 5000




const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vktpy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("volunteerNetwork").collection("events");
  const volunteerCollection = client.db("volunteerNetwork").collection("volunteer");
  


  app.get('/events', (req, res)=>{
      eventsCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents)
      })
  })

  app.get('/event/:id', (req, res)=>{
      eventsCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err,documents)=>{
          res.send(documents[0]);
      })
  })

  app.post('/registration', (req, res)=>{
      const volunteer = req.body;
      volunteerCollection.insertOne(volunteer)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  })

  app.get('/userevent',(req, res)=>{
    volunteerCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
        res.send(documents);
    })
  })

  app.delete('/delete/:id', (req, res)=>{
    console.log(req.params.id);
    volunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result=>{
        console.log(result);
          res.send(result.deletedCount > 0);
      })
  })

  app.get('/allvolunteer', (req, res)=>{
    volunteerCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })

  })

  app.delete('/deletevolunteer/:id',(req, res)=>{

    volunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      res.send(result.deletedCount > 0)
    })

  })

  app.post('/addevent',(req, res)=>{
    const event = req.body;
    eventsCollection.insertOne(event)
    .then(result =>{
        // res.send(insertedCount > 0);
        console.log(result);
    })
})
  
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)