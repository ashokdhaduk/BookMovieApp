import React, {useEffect, useState} from 'react';
import './Header.css';
import mySvg from '../../assets/logo.svg';
import Modal from 'react-modal';
import { Tabs, Tab } from '@material-ui/core';
import Register from './Register';
// import { useLocation } from 'react-router-dom';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useSelector } from 'react-redux';


//style used for modal (Login/Register)
const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

const Header = function(props){

    const [isReleasedMovieBtnClicked, setisReleasedMovieBtnClicked]  = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [modalIsOpen, setisModalOpen] = useState(false);
    const [tabValue,setTabValue] = useState(0);
    // const location = useLocation();
    
    //Getting the movieId from the redux store state
    const movieId = useSelector(state=>state.movieId);
    
    useEffect(() => {
        const shoulShowBtn = window.location.href.indexOf('movie') > 0; //code to check whether window.location contains movie Id, 
        setisReleasedMovieBtnClicked(shoulShowBtn);         //if yes, then show bookShow button
        const isLoggedIn = sessionStorage.getItem('uuid');  //checking if the session storage contains uuid code
        if (isLoggedIn !== null) {
            setLoggedIn(!!isLoggedIn);          // if session storage doesn't contains uuid code, then showing login button.
        }
    }, []) // location
    

    //function to open login/register modal
    function openModal() {
        setisModalOpen(true);
    }

    //function to close login/register modal 
    function closeModal(){
        setisModalOpen(false);
    }

    //function for handling modal tabs
    const handleTabs=(e,val)=>{
        setTabValue(val);
    }

    function Login(){
        const [username, setUserName] = useState("");
        const [password, setPassword] = useState("");

        const [message, setMessage] = useState('');
    
        //function to handle change in login username textbox
        const inputUserNameChangedHandler = (e)=> {
            setUserName(e.target.value);
        }
    
        //function to handle change in login password textbox
        const inputPasswordChangedHandler = (e)=> {
            setPassword(e.target.value);
        }
    
        //function for validating login and storing login details in session storage
        const handleSubmit = ()=> {
            let dataLogin = null;
            let xhrLogin = new XMLHttpRequest();
            xhrLogin.addEventListener("readystatechange", function(){
                if(this.readyState === xhrLogin.DONE){
                    sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                    sessionStorage.setItem(
                        "access-token",
                        xhrLogin.getResponseHeader("access-token")
                    );
                    if(xhrLogin.status === 200 || xhrLogin.status === 201){
                        setLoggedIn(true);
                        closeModal();
                    } else{
                        setMessage('Invalid Credential. Please try again!')
                    }
                }
            });
    
            //validating user login details from the database using API
            
            xhrLogin.open("POST", 'http://localhost:8085/api/v1/auth/login');
            dataLogin = xhrLogin.setRequestHeader(
                "Authorization",
                "Basic " + window.btoa(username + ":" + password)
            );
            xhrLogin.setRequestHeader('Content-Type', 'application/json');
            xhrLogin.setRequestHeader('Cache-Control','no-cache');
            xhrLogin.send(dataLogin);
           
        }
    
        return(
            <div>      
                
                <ValidatorForm className="subscriber-form" onSubmit={handleSubmit}>
    
                    <TextValidator
                        id="username" 
                        type="text"
                        name="username" 
                        value={username}
                        onChange={inputUserNameChangedHandler}
                        label="Username*"
                        validators={['required',"isEmail"]}
                        errorMessages={['required']}
                    >
                    </TextValidator>
                    <br/>
                    <TextValidator
                        id="password" 
                        type="password"
                        name="password" 
                        onChange={inputPasswordChangedHandler}
                        value={password}
                        label="Password*"
                        validators={['required']}
                        errorMessages={['required']}
                    >
                    </TextValidator>
                    <br/><br/>
                    {message && <p style={{color:'red'}}>{message}</p>}
                    <button type="submit" className="custom-btn add-btn" >LOGIN</button>
                    
                </ValidatorForm>
                
            </div>
        )
    }


    //function to logout
    function logoutHandler(){
        sessionStorage.clear();
        setLoggedIn(false);
    }

    //function to handle BookShow button click
    const bookShowHandler =()=>{
        if(!isLoggedIn)
           openModal(); 
        
        else{            
            window.location = `/bookshow/${movieId}`
        }
    }

    return (
        <div className="header">  
            <img className="logo" src={mySvg} alt="Logo"/>

            <div className="headerButtons">

                {/* show the bookShow button in the header, if the user is on details page */} 
                {isReleasedMovieBtnClicked && <button className="bookShow-btn" variant="contained" onClick={bookShowHandler}>BOOK SHOW</button>}

                {/* show the logout button if the user is logged in */}
                {isLoggedIn && <button className="header-btn" variant="contained" onClick={logoutHandler}>LOGOUT</button>}
                
                {/* show the login button if the user is logged out */}
                {!isLoggedIn && <button className="header-btn" variant="contained" onClick={openModal}>LOGIN</button>}            

            </div>
            
            <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Login/Register"
                    ariaHideApp={false}
                    >               

                <div>
                    <Tabs onChange={handleTabs} value={tabValue}>
                    <Tab label="LOGIN"/>
                    <Tab label="REGISTER"/>
                    </Tabs>
                </div>
                <TabPanel value={tabValue} index={0}><Login/></TabPanel>
                <TabPanel value={tabValue} index={1}><Register/></TabPanel>

            </Modal>
        </div>
    )
}

//function to handle the content display of Login and Register tabs
function TabPanel(props){
    const {children,value,index} = props;
    return(
        <div>
            {value === index && ( 
                <div>{children}</div>
             )}
        </div>
    )
}
export default Header;