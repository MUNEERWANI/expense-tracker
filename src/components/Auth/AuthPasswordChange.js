import React, { useRef } from 'react'
import Home from '../home/Home'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AuthPasswordChange = () => {

  const enteredEmail=useRef();
  const submitHandler=async(event)=>{
    event.preventDefault();
    try{
      const email=enteredEmail.current.value;
      const response=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBA5mjQNbPc_xHFvSiE7mL56q-gN_lAhbI',{
        method:'POST',
        body:JSON.stringify({
          requestType:'PASSWORD_RESET',
          email:email,
        }),
        headers:{
          'Content-Type': 'application/json',
          'X-Firebase-Locale': 'en' // Set the language to English
        }
      })
      if(!response.ok){
        throw new Error('request failed')
      }
      const data=await response.json();
      console.log(data)


    }catch(error){
      console.log(error);
      throw error;
    }
   
        
  }
  return (
    <>
      <Home/>
      <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Enter your email address to verify password</Form.Label>
        <Form.Control type="email" placeholder="Enter email" ref={enteredEmail} />
        <Form.Text className="text-muted">
          You will recieve a link on the email where you can reset your password
        </Form.Text>
      </Form.Group>
      <Button variant="warning" type="submit">
        Submit
      </Button>
    </Form>
      
    </>
  )
}

export default AuthPasswordChange
