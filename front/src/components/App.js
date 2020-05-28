import React, { Component, useEffect } from 'react';
import Post from './Post';
import Header from './Header';
import './css/App.css'


class App extends React.Component {
    constructor(props) {
        super(props);
        this.props.verifyLocalStorage()
        };

    render () {
        console.log(this.props.posts)
        return (
            <div>
                <div>
                    <Header user={this.props.user} loginUser={this.props.loginUser} logoutUser={this.props.logoutUser} />
                </div>
                <div id="posts-div">
                    {this.props.posts ?
                        this.props.posts.map((p, i) => <Post post={p} ind={i} removeUserPost={this.props.removeUserPost} addUserPost={this.props.addUserPost} addUserSub={this.props.addUserSub} removeUserSub={this.props.removeUserSub} jwt={this.props.user.auth_token} />)


                    : null                
                    }
                </div>
                
            </div> 
        
        )
    }
}

export default App;