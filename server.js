const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require("path");

const port = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = 'mongodb://admin:admin123@ds011705.mlab.com:11705/simple_chat';

var Message = mongoose.model('Message', {
    name: String, 
    message: String 
});

// app.get('*', (req,res)=>{
//     res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
// })

app.get('/messages', (req, res) => {
    Message.find({}, (err,messages)=>{  //{} all the messages from db
        res.send(messages)
    })
})

app.post('/messages',(req,res)=>{
    var message = new Message(req.body)
    message.save((err) =>{
        if(err)
          sendStatus(500);
          io.emit('message', req.body)
          res.sendStatus(200)
  })
})
io.on('connection', (socket)=>{
    console.log('user connected');
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
})

var server = http.listen(port, () => {
    console.log('server is running on port %d', port);
})
