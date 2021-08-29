import {createStore} from "redux";

//defining initial state for the store
const initialState = {
    "movieId": ""
}

//changing the state as per the action
function movieReducer (state=initialState, action){

    switch (action.type){
        case "set_movieId":
            return {...state, "movieId":action.payload}
        default:
            return state;
    }
}

export default createStore(movieReducer);