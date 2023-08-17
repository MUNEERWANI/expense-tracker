import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useRef } from 'react';
import Container from 'react-bootstrap/esm/Container';
import axios from 'axios'; // Make sure to import Axios;
import { useSelector } from 'react-redux';


const ExpensesForm = () => {
    const isAuth = useSelector(state => state.auth);
    const token = isAuth.token
    const enteredAmount = useRef();
    const enteredDescription = useRef();
    const [category, setCategory] = useState(null)
    const [expenseList, setExpenseList] = useState([]);
    const email = localStorage.getItem('email');
    const [expenseId, setExpenseId] = useState()
    console.log(email)
    const firebaseUrl = "https://expensetracker-a3278-default-rtdb.firebaseio.com";

    const handleCategorySelect = (category) => {
        setCategory(category)
    }

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`${firebaseUrl}/expenses.json?auth=${token}`);
            const expensesData = response.data;
            console.log(expensesData)
            if (expensesData) {
                const expenses = Object.keys(expensesData).map((key) => ({
                    id: key,
                    ...expensesData[key],
                }));
                setExpenseList(expenses);
                // setExpenseList([...expenseList, { amount, description, category }])

            }
        }
        catch (error) {
            console.error('Error fetching expenses:', error);

        }
    }
    const submitHandler = async (event) => {
        event.preventDefault();
        const amount = enteredAmount.current.value;
        const description = enteredDescription.current.value;
        console.log(amount, description, category)
        const expenseData = {
            amount: amount,
            description: description,
            category: category,
            email: email,
        }
        console.log(expenseData)
        try {
            const response = await axios.post(`${firebaseUrl}/expenses.json?auth=${token}`, expenseData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.status === 200 || response.status === 201) {
                console.log(response.data);

                fetchExpenses(); // Fetch updated expenses
            } else {
                console.log('error in post');
                throw new Error('something went wrong');
            }
        }
        catch (error) {
            console.log(error)
            alert(error)
        }
        // Clear form fields
        enteredAmount.current.value = '0';
        enteredDescription.current.value = '';
    }
    const loadExpenses=
    useEffect(() => {
        fetchExpenses();

    }, [])
    const deleteExpenseHandler = async () => {
        try {
            console.log('delete button')
            const response = await axios.delete(`${firebaseUrl}/expenses.json?auth=${token}`);
            console.log('dataa deleted ')
        } catch (error) {
            console.log(error)
        }
    }
    const editExpenseHandler = () => {

    }

    return (
        <Container>
            <Form onSubmit={submitHandler}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="Add amount"
                            defaultValue="0"
                            ref={enteredAmount}
                        />
                        <Form.Control.Feedback>great</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>description</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Description"
                            defaultValue="description"
                            ref={enteredDescription}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select Expense Category
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleCategorySelect('Food')}>Food</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleCategorySelect('Transportation')}>Transportation</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleCategorySelect('School')}>School</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Row>
                <Button type="submit">Submit form</Button>
            </Form>
            <Container>
                <h2>Entered Expenses </h2>
                <ul>
                    {expenseList.map((expense) => {
                        return (
                            <li key={expense.id}>
                                Amount: {expense.amount},
                                Description:{expense.description},
                                Category: {expense.category}
                                <Button onClick={deleteExpenseHandler}>Delete</Button><span> </span>
                                <Button onClick={editExpenseHandler}>Edit</Button>

                            </li>
                        )

                    })}

                </ul>
            </Container>
        </Container>


    )
}

export default ExpensesForm
