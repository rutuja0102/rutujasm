const express=require('express')
const bodyParser=require('body-parser')
const routes=require('./src/routes/routes')
const app=express();
const cors = require('cors');
require("dotenv").config();

const PORT = process.env.PORT
app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());
app.use("/",routes)

// app.get('/', async (req, res) => {
//     res.send('done');
// });

// app.get('/', async (req, res) => {
//     res.send('done');
// });

app.listen(PORT,()=>{ console.log('info',`Server started ${PORT}`)})