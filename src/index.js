import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto';
import registerServiceWorker from './registerServiceWorker';
import Controller from './screens/Controller';
import { BrowserRouter as Router } from 'react-router-dom';
import {Provider} from "react-redux";
import store from './MovieStore';

ReactDOM.render(<Provider store={store}><Router><Controller /></Router></Provider>, document.getElementById('root'));
registerServiceWorker();
