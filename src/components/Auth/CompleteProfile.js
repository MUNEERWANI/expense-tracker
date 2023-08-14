import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRef } from 'react';
import { useContext } from 'react';
import AuthContext from '../../store/AuthContext';

const CompleteProfile = () => {
    const authCtx = useContext(AuthContext);
    const nameInputRef = useRef();
    const imageInputRef = useRef();
    console.log(authCtx.token)
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
        let toke=authCtx.token


        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBA5mjQNbPc_xHFvSiE7mL56q-gN_lAhbI', {
                method: 'POST',
                body: JSON.stringify({
                    idToken: toke,
                    displayName: enteredName,
                    photoUrl: photoUrl,
                    deleteAttribute:["DISPLAY_NAME"],
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
    return (
        <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" ref={nameInputRef} />

            </Form.Group>

            <Form.Group className="mb-3" controlId="photo">
                <Form.Label>Update your photo</Form.Label>
                <Form.Control type="file" placeholder="upload Profile picture " ref={imageInputRef} />
            </Form.Group>

            <Button variant="primary" type="submit">
                Update details
            </Button>
        </Form>
    )
}

export default CompleteProfile
