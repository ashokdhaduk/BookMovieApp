import React, { Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from "../common/header/Header";
import Home from "./home/Home";
import Confirmation from "./confirmation/Confirmation";
import BookShow from "./bookshow/BookShow";
import Details from "./details/Details";

//handling the navigation between all the pages using react router dom
export default function Controller(){
    const baseUrl = "http://localhost:8085/api/v1/";
    return(
        <Fragment>
            <BrowserRouter>
                <Header/> 
                <Route exact path='/' render={(props)=> <Home {...props} baseUrl={baseUrl} />}></Route>
                <Route path='/movie/:id' render={(props)=> <Details {...props} baseUrl={baseUrl} />}></Route>
                <Route path='/bookshow/:id' render={(props)=> <BookShow {...props} baseUrl={baseUrl} />}></Route>
                <Route path='/confirm/:id' render={(props)=> <Confirmation {...props} baseUrl={baseUrl} />}></Route>
            </BrowserRouter>
        </Fragment>
    )
}