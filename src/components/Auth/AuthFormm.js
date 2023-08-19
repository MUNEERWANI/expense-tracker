import React, { useState, useRef } from 'react';
import classes from './AuthForm.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/authSlice';

const AuthFormm = () => {
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true); //its used to switch between login page or sign up page
  const [isLoading, setIsLoading] = useState(false); //its used for laoding where submiting the request

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const navigate = useNavigate();// this for getting to another page or navigating to another page
  const token=localStorage.getItem('token');
  if(token){
    dispatch(authActions.login(token))
  }

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("yes you clicked submit");

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    localStorage.setItem('email', enteredEmail);

    setIsLoading(true);
    let url;

    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBA5mjQNbPc_xHFvSiE7mL56q-gN_lAhbI';
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBA5mjQNbPc_xHFvSiE7mL56q-gN_lAhbI';
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        }
        else {
          if (!res.ok) {
            return res.json().then((data) => {
              let errorMessage = "Authentication unsuccessful";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }

        }
      }).then((data) => {
        dispatch(authActions.login(data.idToken));
        console.log(data)
        navigate('/expenses'); // Redirect to UpdateProfile
      }).catch((err) => {
        alert(err.message)
      })
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState); //here it  sets the login or sign up button
  };
  const forgotPasswordHandler = () => {
    console.log('forgot')
    navigate('/authpasswordchange'); // Redirect to password change  form
  }

  return (
    <div>
      <section className={classes.auth}>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor='email'>Your Email</label>
            <input type='email' id='email' required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='password'>Your Password</label>
            <input type='password' id='password' required ref={passwordInputRef} />
          </div>
          {!isLogin &&
            (
              <div className={classes.control}>
                <label htmlFor='password'>confirm Password</label>
                <input type='password' id='password' required ref={confirmPasswordInputRef} />
              </div>
            )}
          <div className={classes.actions}>
            <button onClick={forgotPasswordHandler}>Forgot password</button>
            <br />
            {!isLoading && <button type='submit'>{isLogin ? 'Login' : 'Sign up'}</button>}
            <button
              type='button'
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </button>
          </div>
        </form>
      </section>
    </div>

  );
};

export default AuthFormm;
