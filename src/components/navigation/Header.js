import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/index';
import { useSelector } from 'react-redux';

const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.auth);
  const isLoggedIn = isAuth.isLoggedIn;
  console.log(isLoggedIn)
  const navigate = useNavigate()
  const logoutHandler = () => {
    dispatch(authActions.logout())
    navigate('/');
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
        {isLoggedIn && (<>
          <Nav.Link as={Link} to="/updateprofile" >Complete profile</Nav.Link>
 <Button variant="warning" className="ml-5"  onClick={logoutHandler} >logout</Button>
        </>
 
        )}


      </Navbar>
    </div>
  )
}

export default Header
