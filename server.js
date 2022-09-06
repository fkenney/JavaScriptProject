import * as dotenv from 'dotenv'
import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import path from 'path';
import {fileURLToPath} from 'url';
import { ObjectId } from 'mongodb';
import cors from 'cors';
import Vacation from './models/Vacation.js'
import mongoose from 'mongoose';



dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const MONGO_PASS = process.env.MONGO_DB;
const DB_USERNAME = process.env.DB_USERNAME;


mongoose.connect(`mongodb+srv://${DB_USERNAME}:${MONGO_PASS}@cluster0.ij55gmd.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true})
const db = mongoose.connection

db.once('open', _ =>{
    console.log('Database connected')
})

db.on('error', err =>{
    console.log('connection error:', err)
})


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
app.get('/', async (req, res)=>{
    try {
        let results = await Vacation.find()
        res.render('index.ejs', {vacations: results})
    } catch (error) {
        console.error(error)
    }
})

//POST
app.post('/vacations', async(req, res) =>{
    let img = await getImage(req.body);
    req.body.image = `${img}`
    let vacation = new Vacation({
        destination: req.body.destination,
        location: req.body.location,
        description : req.body.description,
        image: req.body.image
    })
    try {
        let result = await vacation.save();
        res.redirect('/')
    } catch (err) {
        console.error(err)
    }
})

// PUT 
app.put('/vacations', async(req, res)=>{
    let filterID = new ObjectId(req.body.id);
    let img= await getImage(req.body);
    req.body.image = `${img}`
    try{
        let result = await Vacation.findOneAndUpdate(
            { _id : filterID},
            {
                destination: req.body.destination,
                location: req.body.location,
                description: req.body.description,
                image: req.body.image
            }
        )

        res.json('Success');
    }catch(err){
        console.error(err)
    }
}) 


// DELETE
app.delete('/vacations', async (req, res) =>{
    let filterId = new ObjectId(req.body.id);

    try {
        let result = await Vacation.findOneAndDelete({
            _id : filterId
        })

        if (result.deletedCount === 0) {
            return res.json('No item to delete')
        }
        res.json('wishlist item deleted')

    } catch (error) {
        console.error(error)
    }
})

// LISTEN
app.listen(PORT, () => console.log("server listening"))


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

