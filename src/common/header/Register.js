import React, { useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import './Header.css';

export default function Register(){

    const [registerForm, setRegisterForm] = useState({
        email_address: '',
        first_name: '',
        last_name: '',
        mobile_number: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    const {email_address, first_name, last_name, mobile_number, password} = registerForm;

    var xhr = new XMLHttpRequest();

    //save the registration details in the database
    const saveFormData = async()=> {
            xhr.open('POST', 'http://localhost:8085/api/v1/signup');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(registerForm));
            console.log(registerForm);         
    }
    
    //handles the click of Register button in the form and shows appropriate success/fail message 
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            await saveFormData();
            setMessage('Registration Successful. Please Login!')
            setRegisterForm({email_address:'', first_name:'', last_name:'', mobile_number:'', password:''});
         }
         catch(e){
            setMessage(`Registration Failed! ${e.message}`)
         }
    }

    //handles the change in the form text fields and update the values in the state variable
    const inputChangedHandler = (e) => {
        const state = registerForm;
        state[e.target.name] = e.target.value;
        setRegisterForm({...state});
    }

    return(
        <div>
            <ValidatorForm className="subscriber-form" onSubmit={handleSubmit}>

                <TextValidator
                    id="firstname" 
                    type="text"
                    name="first_name" 
                    onChange={inputChangedHandler}
                    value={first_name}
                    label="First Name*"
                    validators={['required']}
                    errorMessages={['required']}
                >
                </TextValidator>
                <br/>

                <TextValidator
                    id="lastName" 
                    type="text"
                    name="last_name" 
                    onChange={inputChangedHandler}
                    value={last_name}
                    label="Last Name*"
                    validators={['required']}
                    errorMessages={['required']}
                >
                </TextValidator>
                <br/>

                <TextValidator
                    id="email" 
                    type="text"
                    name="email_address" 
                    onChange={inputChangedHandler}
                    value={email_address}
                    label="Email*"
                    validators={['required','isEmail']}
                    errorMessages={['required']}
                >
                </TextValidator>
                <br/>

                <TextValidator
                    id="password" 
                    type="password"
                    name="password" 
                    onChange={inputChangedHandler}
                    value={password}
                    label="Password*"
                    validators={['required']}
                    errorMessages={['required']}
                >
                </TextValidator>
                <br/>

                <TextValidator
                    id="contactNo" 
                    type="number"
                    name="mobile_number" 
                    onChange={inputChangedHandler}
                    value={mobile_number}
                    label="Contact No.*"
                    validators={['required']}
                    errorMessages={['required']}
                >
                </TextValidator>
                <br/><br/>
                {message && <p style={{color:'green'}}>{message}</p>}
                <button type="submit" className="custom-btn add-btn">REGISTER</button>


                </ValidatorForm>
        </div>
    )
}