import React, { Component, useReducer } from 'react';
import io from 'socket.io-client';
import $ from 'jquery';
import './_context.scss';

export default class Context extends Component {
    state = {
        context: ['i live in paris.', 'i work for a start-up.', "i'm a virtual assistant.", "i teach sometimes."],
        new_context: '',
    }

    componentDidMount() {
        this.props.socket.emit('new-context', this.state.context);
        this.props.reset();
    }

    delContext = async (id) => {
        let copy = this.state.context.slice();
        copy.splice(id, 1);
        this.setState({context: copy});
    }

    onChange = (e) => {
        this.setState({new_context: e.target.value});
    }

    submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        e.preventDefault(); // prevents page reloading
        if (this.state.new_context) {
            let copy = this.state.context.slice();
            copy.push(this.state.new_context + '.');
            this.setState({context: copy, new_context: ''})
            $(e.currentTarget).val(''); 
        }
    }

    useContext = async () => {
        this.props.socket.emit('new-context', this.state.context);
        this.props.reset();
    }

    render() {
        return (
            <div className='contexts'>
                {this.state.context.map((context, id) => (
                    <span className='context' key={id}>
                        {context}
                        <i className="fas fa-times del" onClick={_ => this.delContext(id)}></i>
                    </span>
                ))}
                <textarea
                    rows={1} 
                    onChange={this.onChange} 
                    onKeyPress={this.submit} 
                    placeholder='enter new context' 
                />
                <div className='valid-button'>
                    <button className='valid' onClick={this.useContext}>Use this context</button>
                </div>
            </div>
        )
    }
}