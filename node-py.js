var express = require( "express" );
var app = express();
var http = require( "http" );
app.use( express.static( "./public" ) ); // where the web page code goes

const server = new http.Server(app);
const io = require('socket.io')(server);

const PORT = 5000;

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
});

io.on('connection', socket => {
    socket.on('disconnect', function() {
        console.log('opposant disconnect!');
    });

    socket.on('python-msg', msg => {
        console.log('python: ' + msg + '\n');
        rl.question('>> ', (res) => {
            io.emit('node-msg', res);
            rl.close();
        })
    })
    
})