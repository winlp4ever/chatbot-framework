//const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const http = require('http');

var app = express();
app.use(favicon(path.join(__dirname, 'imgs', 'favicon.ico')));
app.use(express.static(__dirname + './public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const config = require('./webpack.config.js');

const options = {
    //contentBase: './public',
    //hot: true,
    //host: 'localhost',
    //proxy: { '*': 'http://localhost:5000' }
};

// webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
//const server = new webpackDevServer(compiler, options);
//compiler.outputFileSystem = fs;

const server = new http.Server(app);
const io = require('socket.io')(server);

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
});

var posts = {
    0: {
        id: 0,
        content: {
            title: 'an example',
            text: '<h1>example</h1>\n<p>this is an example</p>',
            shared_link: ''
        },
        likes: 0,
        comments: [
            {username: 'AII', content: 'Hey yo'},
            {username: 'AII', content: 'this is an example'}
        ]
    },
    1: {
        id: 1,
        content: {
            title: 'oofsi',
            text: '<h1>second ex</h1> \n<p>where anything goes wrong</p>',
            shared_link: ''
        },
        likes: 1,
        comments: [
            {username: 'AII', content: 'Ooof'}
        ]
    }
}
var count = 0;


app.use(
    middleware(compiler, options)
);

app.use(require('webpack-hot-middleware')(compiler));


io.on('connection', function(socket){
    count ++;
    console.log(`${count} user connected with id: ${socket.id}`);
    socket.on('disconnect', function(){
        count --;
        console.log(`1 user disconnected, rest ${count}`);
    });
    socket.on('bot-msg', msg => {
        io.emit('bot-msg', msg);
        console.log('bot: ' + msg);
    })
    socket.on('user-msg', msg => {
        io.emit('user-msg', msg);
        console.log('user: ' + msg);
    })
    socket.on('new-context', context => {
        io.emit('new-context', context);
        console.log('new-context: \n' + context);
    })
});


app.get('/', (req, res, next) => {
    var filename = path.join(compiler.outputPath,'index');
    
    compiler.outputFileSystem.readFile(filename, async (err, data) => {
        if (err) {
            return next(err);
        }
        res.set('content-type','text/html');
        res.send(data);
        res.end();
    });
});
process.on('SIGINT', _ => {
    console.log('now you quit!');
    process.exit();
})