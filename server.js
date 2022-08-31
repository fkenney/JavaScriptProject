const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.listen(3000, () => console.log("server listening"))
app.use(express.static(__dirname + '/public'));


// GET

app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/index.html')
})
