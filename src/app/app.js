import React, { Component, useReducer } from 'react';
import io from 'socket.io-client';
import $ from 'jquery';
import './_app.scss';
import Context from '../context/context'

class App extends Component {
    state = {
        chats: [],
        new_chat: '',
        socket: io()
    }

    componentDidMount() {
        this.state.socket.on('bot-msg', msg => {
            let copy = this.state.chats.slice();
            copy.push({name: 'Bob', msg: msg});
            this.setState({chats: copy})
        })
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
    }

    onChange = (e) => {
        this.setState({new_chat: e.target.value});
    }

    submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault(); // prevents page reloading
        if ($(e.currentTarget).val()) {
            this.state.socket.emit('user-msg', this.state.new_chat)
            let copy = this.state.chats.slice();
            copy.push({name: 'you', msg: this.state.new_chat});
            this.setState({chats: copy, new_chat: ''})
            $(e.currentTarget).val('');        
        }
    }

    reset = () => {
        this.setState({chats: []});
    }

    render() {
        return (
            <div className='app'>
                <div className='chat-app'>
                    {this.state.chats.map((chat, id) => (
                        <div key={id} className={(chat.name == 'you') ? 'you': 'others'}>
                            <span className='username'>{chat.name}</span>
                            <span>{chat.msg}</span>
                        </div>)
                    )}
                    <div className='new-chat'>
                        <textarea
                            rows={1} 
                            onChange={this.onChange} 
                            onKeyPress={this.submit} 
                            placeholder='&nbsp;' 
                        />
                        <span className='label'>
                            chat now
                        </span>
                    </div>
                </div>
                <Context socket={this.state.socket} reset={this.reset}/>

            </div>  
        )
    }
}

export default App;