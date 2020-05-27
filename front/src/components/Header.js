import React, { Component } from 'react';


class Header extends React.Component {

    render() {
        return (
            <div className="header-div">
                <h1>This is the Header.</h1>
                {this.props.user.info.name === '' ? 
                    <div>
                        <button onClick={e => this.props.loginUser('adamliden93@gmail.com', 'pwpwpw121212')}>Login Adam</button>
                    </div>
                :
                    <div>
                        <p>Logged in as: {this.props.user.info.name}</p>
                        <button onClick={e => this.props.logoutUser(this.props.user.auth_token)}>Log Out</button>
                    </div>
                }
            </div>
        )
    }
}


export default Header;