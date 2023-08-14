import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRef } from 'react';
import { useContext } from 'react';
import AuthContext from '../../store/AuthContext';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';

const CompleteProfile = () => {
    const authCtx = useContext(AuthContext);
    const nameInputRef = useRef();
    const imageInputRef = useRef();

    const [userData, setUserData] = useState({
        displayName: '',
        photoUrl: ''
    });
    const submitHandler = async (event) => {
        event.preventDefault();
        const enteredName = nameInputRef.current.value;
        const photoUrl = URL.createObjectURL(imageInputRef.current.files[0]);
        console.log(enteredName);
        console.log(photoUrl.name)
        if (!photoUrl) {
            console.log("upload image");
            return;
        }
        console.log(photoUrl)
        // const formData = new FormData();
        // formData.append('displayName', enteredName);
        // formData.append('photoUrl', photoUrl);
        let token = authCtx.token


        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBA5mjQNbPc_xHFvSiE7mL56q-gN_lAhbI', {
                method: 'POST',
                body: JSON.stringify({
                    idToken: token,
                    displayName: enteredName,
                    photoUrl: photoUrl,
                    deleteAttribute: ["DISPLAY_NAME"],
                    returnSecureToken: true
                }),
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${authCtx.token}`, // Use Bearer token format

                },
            })
            if (response.ok) {
                alert("Profile updated successfully");
            } else {
                console.log(response)
                alert("Profile update failed");
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
        }
    }
    useEffect(() => {
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBA5mjQNbPc_xHFvSiE7mL56q-gN_lAhbI', {
            method: 'POST',
            body: JSON.stringify({
                idToken: authCtx.token
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
            throw new Error("Failed to fetch user data");
        }).then((data) => {
            const user = data.users[0];
            if (user) {
                setUserData({
                    displayName: user.displayName || '',
                    photoUrl: user.photoUrl || ''
                })
            }

        }).catch(err => {
            console.log(err)
        })
    }, [])
    const verifyEmailHandler = async () => {
        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBA5mjQNbPc_xHFvSiE7mL56q-gN_lAhbI', {
                method: 'POST',
                body: JSON.stringify({
                    requestType: 'VERIFY_EMAIL',
                    idToken: authCtx.token
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Firebase-Locale': 'en' // Set the language to English
                }
            })
            if (!response.ok) {
                throw new Error('request failed');
            }
            const data=await response.json();
            console.log(data);

            return data
        }catch(error){
            console.log(error);
            throw error;
        }
        

    }
    return (
        <Container>

            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Name" ref={nameInputRef} defaultValue={userData.displayName} />

                </Form.Group>

                <Form.Group className="mb-3" controlId="photo">
                    <Form.Label>Update your photo</Form.Label>
                    <Form.Control type="file" placeholder="upload Profile picture " ref={imageInputRef} />
                    {
                        userData.photoUrl ? (
                            <img src={userData.photoUrl} alt="Profile" />
                        ) : (
                            <p>No profile picture available</p>
                        )
                    }            </Form.Group>

                <Button variant="primary" type="submit">
                    Update details
                </Button>

            </Form>
            <Button onClick={verifyEmailHandler}>Verify email</Button>
        </Container>


    )
}

export default CompleteProfile
