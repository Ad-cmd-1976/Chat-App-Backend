import express from 'express'
import dotenv from 'dotenv'
import { connectdb } from './lib/db.js';
import authRoute from './routes/auth.route.js'
dotenv.config();

const app=express();
const port=process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/auth',authRoute);

app.get('/',(req,res)=>{
   res.send('okay');
})

app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
    connectdb();
})