import "./styles/index.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { SET_USER } from './redux/actions/user.actions';
import { UserType } from './types/graphql';

interface Props {
    SET_USER: Function;
    userReducer: UserType;
}

class App extends Component<Props> {
    componentDidMount() {
        this.props.SET_USER();
    }

    render() {
        return (
            <div>
                <h1>Bio: {this.props.userReducer.bio}</h1>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return ({
        userReducer: state.userReducer
    });
};

const mapDispatchToProps = (dispatch: Function) => {
    return ({
        SET_USER: () => dispatch(SET_USER()),
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
