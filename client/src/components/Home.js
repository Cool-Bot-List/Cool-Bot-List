import React, { Component } from "react";

export default class Home extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            botId: props.id,
            botName: props.name,
            owners: props.owners,
            language: props.language
        };
    }
    render() {
        return (
            <div>
                <h1>Bot Name: {this.state.botName}</h1>
                <h1>Bot ID: {this.state.botId}</h1>
                <h1>Owners: {this.state.owners.join(", ")}</h1>
                <h1>Language: {this.state.language}</h1>
            </div>
        );
    }
}