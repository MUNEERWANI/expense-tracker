import React from 'react'
import AuthFormm from '../Auth/AuthFormm';
import { useSelector } from 'react-redux';
import Expenses from '../expenses/Expenses';

const Home = () => {
    const isAuth=useSelector(state=>state.auth)
    const isLoggedIn=isAuth.isLoggedIn
    console.log(isLoggedIn)

    return (
        <div>
            {!isLoggedIn?(<AuthFormm />):(<Expenses />)}
        </div>
    )
}

export default Home
