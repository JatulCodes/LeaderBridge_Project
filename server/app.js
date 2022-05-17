const dotenv = require ('dotenv');
const express = require ('express')
const app = express();
dotenv.config({path:'./config.env'});

const PORT = process.env.PORT;
require('./db/connection');

app.use(express.json());
app.use(require('./router/auth'));


app.listen(PORT,()=>{
    console.log(`server is running in port ${PORT}`);
})