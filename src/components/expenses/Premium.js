import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/esm/Button'
import { premiumActions } from '../../store/premiumSlice'
import { useDispatch } from 'react-redux'
import { csvActions } from '../../store/csvExportSLice'

const Premium = () => {
  //This component will do following functions > activate premium functions and will display premium button on screen 
  
  //calling dispatch from redux 
  const dispatch=useDispatch()

 //function which will activate premium as soon as we click on  upgrade premium button
 const activatePremiumHandler=()=>{
    dispatch(premiumActions.setPremium())
    alert('Enjoy your premium free trail for 30 days for free')
 }


 

  return (
    <Container>
      <Button  onClick={activatePremiumHandler}>
        Upgrade to premium 
      </Button>

    </Container>
  )
}

export default Premium
