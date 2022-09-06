import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const vacationSchema = new Schema({
    destination : String,
    location: String,
    description : String,
    image: String,
})


export default mongoose.model('Vacation', vacationSchema) 