const connecttomongo=require('./db');
var cors=require('cors')
connecttomongo();
const express=require('express')
const app=express()
const port=5000
app.use(cors())
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.get('/',(req,res)=>{
    res.send('INOTEBOOOK APP')
})

app.listen(port,()=>{
    console.log('Listening at Port 5000')
})