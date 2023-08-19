import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/authSlice';
import { useSelector } from 'react-redux';
import { darkModeActions} from '../../store/darkModeSLice';
import { csvActions } from '../../store/csvExportSLice';

const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.auth);
  const isLoggedIn = isAuth.isLoggedIn;


  //premium to unLock premium features like dark mode and also to show download csv file option
  const premium=useSelector(state=>state.premium) //calling the premium state 
  const isPremium=premium.isPremium //accessing isPremium state and assigning it to a constant
  console.log(isPremium)


 
  const navigate = useNavigate()
  const logoutHandler = () => {
    dispatch(authActions.logout())
    navigate('/');
  }
  const darkModeHandler=()=>{
    console.log('turn Off on dark Mode')
    dispatch(darkModeActions.toggleDarkMode());
  }
  return (
    <div>

      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Monthly Expense Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
              <Nav.Link as={Link} to="/about">about</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        {isPremium&&<Button onClick={darkModeHandler}>DarkMode</Button>}    

        {isLoggedIn && (<>
          <Nav.Link as={Link} to="/updateprofile"  ><Button>Complete profile</Button></Nav.Link>
 <Button variant="warning" className="ml-5"  onClick={logoutHandler} >logout</Button>
        </>
 
        )}



      </Navbar>
    </div>
  )
}

export default Header
