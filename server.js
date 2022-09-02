import * as dotenv from 'dotenv'
import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';
import path from 'path';
import {fileURLToPath} from 'url';
import { ObjectId } from 'mongodb';
import cors from 'cors';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;


MongoClient.connect('mongodb+srv://vacation:vacation@cluster0.ij55gmd.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology: true})
.then( client => {
    console.log('connected')
    const db = client.db('vacation-wishlist')
    const vacayCollection = db.collection('vacations')
    // SET
    app.set('view engine', 'ejs')

    // USE
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors({
        origin:'*'
    }));

    // GET
    app.get('/', (req, res)=>{
        db.collection('vacations').find().toArray()
        .then(results => {
            res.render('index.ejs', {vacations: results})
        })
        .catch(error => console.error(error)) 
    })

    //POST
    app.post('/vacations', async(req, res) =>{

        let image = await getImage(req.body);

        req.body.destination = req.body.destination.trim();
        req.body.location = req.body.location.trim(); 
        req.body.description = req.body.description.trim();
        req.body.image = `${image}`;
        vacayCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
    })

    //PUT
    app.put('/vacations', async(req, res)=>{
        let filterID = new ObjectId(req.body.id);
        let img= await getImage(req.body);
        vacayCollection.findOneAndUpdate(
            {_id: filterID},
            {
                $set: {
                    destination: req.body.destination,
                    location: req.body.location,
                    description: req.body.description,
                    image : img,
                }
            },
            {
                upsert: true
            }
        )
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))
    }) 

    // DELETE
    app.delete('/vacations', (req, res) =>{
        let filterId = new ObjectId(req.body.id);

        vacayCollection.deleteOne(
            { _id : filterId }
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No item to delete')
            }
            res.json('wishlist item deleted')
        })
        .catch(error => console.error(error))
    })

    // LISTEN
    app.listen(PORT, () => console.log("server listening"))
    
    

}).catch(err => console.error(err));

async function getImage(data){
    let url = `https://api.unsplash.com/search/photos?order_by=popular&page=1&query=${data.destination}&query=${data.location}&client_id=${API_KEY}`;
    let img;
    try{
        let response = await fetch(url);
        let images = await response.json();
        img = images.results[0].urls.thumb;
    }catch{
        img = 'https://images.unsplash.com/photo-1596120236172-231999844ade?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        console.error(error.message);
    }
    finally{
        return img;
    }
}

