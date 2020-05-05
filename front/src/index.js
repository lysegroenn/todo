import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';



const Div = document.getElementById("app")

Div ? ReactDOM.render(<App />, Div) : console.log("nothin");