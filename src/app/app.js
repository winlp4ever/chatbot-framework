import React, { Component, useReducer } from 'react';
import io from 'socket.io-client';
import $ from 'jquery';

class App extends Component {
    state = {
        chats: [],
        new_chat: '',
        socket: io()
    }

    componentDidMount() {
        this.state.socket.on('bot-msg', msg => {
            let copy = this.state.chats.slice();
            copy.push(msg);
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
            copy.push(this.state.new_chat);
            this.setState({chats: copy, new_chat: ''})
            $(e.currentTarget).val('');        
        }
        
        

    }

    render() {
        return (
            <div className='app'>
                {this.state.chats.map((sen, id) => (<div key={id}>{sen}</div>))}
                <div className='new-chat'>
                    <input onChange={this.onChange} onKeyPress={this.submit} placeholder='chat..' />
                </div>
            </div>
        )
    }
}

export default App;