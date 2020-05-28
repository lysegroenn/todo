import { connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import App from '../components/App';
import { loadUser, setUser } from './localstorage';
import thunk from 'redux-thunk';

//const Host = process.env.HOST || 'http://192.168.0.105'
const Host = 'http://localhost'



// Test action
const test = () => (
    {
        type: 'TEST', 
        data: "hej"
    }
)

// Updating Action
const toggleUpdating = (bool) => {
    return {
        type: 'TOGGLE_UPDATING',
        bool
    }
}

// Aciton to update store with received Posts.
const receivePosts = (data) => {
    return {
        type: 'RECEIVE_POSTS',
        posts: data
    };
};

// Action to store user object.
const storeUser = (user) => {
    return {
        type: 'STORE_USER',
        user: user
    }
}


const fetchPosts = () => {
    return (dispatch, getState) => {
        fetch(Host + ':5000/api/posts/')
        .then(res => res.json())
        .then(json => dispatch(receivePosts(json)))
    }
} 





// Authentication actions

const loginUser = (email, password) => {
    return (dispatch, getState) => {
        let data = { email, password }
        fetch(Host + ':5000/api/users/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
        .then(res => res.json())
        .then(json => {
            dispatch(storeUser(json))
            setUser(json)
            console.log(loadUser())
            dispatch(getUserPosts(json.auth_token))
        })        
    }
}

const logoutUser = (jwt) => {
    return (dispatch, getState) => {
        let bearer = 'Bearer ' + jwt
        fetch(Host + ':5000/api/users/logout',{ method: 'POST', headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }})
        .then(res => res.json())
        .then(json => {
            console.log(json)
            dispatch(storeUser({info: {name: ''}}))
            dispatch(receivePosts([])) // Resets "posts" in the store to an empty array
        })
    }
}
// Post actions

const getUserPosts = (jwt) => {
    return (dispatch) => {
        let bearer = 'Bearer ' + jwt
        fetch(Host + ':5000/api/posts/userPosts/',{ method: 'GET', headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }})
        .then(res => res.json())
        .then(json => dispatch(receivePosts(json.posts)))
    }
}

const addUserPost = (jwt, title) => {
    return (dispatch) => {
        let bearer = 'Bearer ' + jwt
        fetch(Host + ':5000/api/posts/userPosts/',{ method: 'POST', headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }, body: JSON.stringify({title: title})})
         .then(res => res.json())
         .then(json => {
             console.log(json)
             dispatch(getUserPosts(jwt))
            })
    }
}

const removeUserPost = (jwt, _id) => {
    return (dispatch) => {
        let bearer = 'Bearer ' + jwt
        fetch(Host + ':5000/api/posts/userPosts/',{ method: 'DELETE', headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }, body: JSON.stringify({_id: _id})})
        .then(res => res.json())
        .then(json => {
            console.log(json)
            dispatch(getUserPosts(jwt))
        })
    }
}

const addUserSub = (jwt, _id) => {
    return (dispatch) => {
        let bearer = 'Bearer ' + jwt
        fetch(Host + ':5000/api/posts/userSub/',{ method: 'POST', headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }, body: JSON.stringify({_id: _id})})
        .then(res => res.json())
        .then(json => {
            console.log(json)
            dispatch(getUserPosts(jwt))
        })
    }
}

const removeUserSub = (jwt, _id, ind) => {
    return(dispatch) => {
        let bearer = 'Bearer ' + jwt
        fetch(Host + ':5000/api/posts/userSub/',{ method: 'DELETE', headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }, body: JSON.stringify({_id: _id, ind: ind})})
        .then(res => res.json())
        .then(json => {
            console.log(json)
            dispatch(getUserPosts(jwt))
        })
    }
}



// Local storage ------------------------
const verifyLocalStorage = () => {
    return(dispatch) => {
        let localUser = loadUser()
        console.log(localUser)
        fetch(Host + ':5000/api/users/status/', {method: 'GET', headers: { 'Authorization': `Bearer ${localUser.auth_token}`, 'Content-Type': 'application/json' }})
        .then(res => res.json())
        .then(json =>{
            console.log(json)
            if(json.isLoggedIn) {
                console.log('is logged in')
                dispatch(storeUser(localUser))
                dispatch(getUserPosts(localUser.auth_token))
            }
            return
        })
    }
}


/* Reducer: Is passed the initial state as well as an action,
 which is an object containing a 'type' and a 'payload'. 
The action object is created by the action 'creators'. */
const reducer = (state = {updating: false, posts: [], user: {info: {name: ''}, auth_token: ''}}, action) => {
    switch(action.type) {
        case 'RECEIVE_POSTS' :
            return {...state, posts: action.posts};
        case 'TEST' :
            return {...state, text: action.data}
        case 'TOGGLE_UPDATING':
            return {...state, updating: action.bool}
        case 'STORE_USER' :
            return {...state, user: action.user}
        default:
            return state; 
    };
};

/* Mapping the state properties to be accessed from the Component */
const mapState = (state) => {
    return {
        posts: state.posts,
        updating: state.updating,
        user: state.user
    };
};

/*/Mapping the dispatch methods to be available in the Component. 
The methods will dispatch an action which will update the state 
in the Redux Store. */
const mapDispatch = (dispatch) => {
    return {
        loginUser: (email, password) => {
            dispatch(loginUser(email, password))
        },
        logoutUser: (jwt) => {
            dispatch(logoutUser(jwt))
        },
        getUserPosts: (jwt) => {
            dispatch(getUserPosts(jwt))
        },
        addUserPost: (jwt, title) => {
            dispatch(addUserPost(jwt, title))
        },
        removeUserPost: (jwt, _id) => {
            dispatch(removeUserPost(jwt, _id))
        },
        addUserSub: (jwt, _id) => {
            dispatch(addUserSub(jwt, _id))
        },
        removeUserSub: (jwt, _id, ind) => {
            dispatch(removeUserSub(jwt, _id, ind))
        },
        verifyLocalStorage: () => {
            dispatch(verifyLocalStorage())
        }
    }
}


const store = createStore(reducer, applyMiddleware(thunk));

const Connectors = {
    App: connect(mapState, mapDispatch)(App),
    store: store
};

export default Connectors;