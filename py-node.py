import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

@sio.event
def my_message(data):
    sio.emit('python-msg', data)

@sio.on('node-msg')
def on_message(data):
    print('Node: ' + data)

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://localhost:5000')
while True:
    msg = input('your msg:\n');
    my_message(msg);
sio.wait()