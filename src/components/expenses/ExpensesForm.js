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
    const handleCategorySelect = (category) => {
        setCategory(category)
    }
    const [expenseList, setExpenseList] = useState([]);
    const email2 = localStorage.getItem('email');
    const email = email2.replace('@', '').replace('.', '');
    const [editingExpenseId, setEditingExpenseId] = useState()
    const startEditing = (expenseId) => {
        setEditingExpenseId(expenseId);
    };

    const cancelEditing = () => {
        setEditingExpenseId(null);
    };

    const firebaseUrl = "https://expensetracker-a3278-default-rtdb.firebaseio.com";



    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`${firebaseUrl}/expenses/${email}.json?auth=${token}`);
            const expensesData = response.data;
            console.log(expensesData)
            if (expensesData) {
                const expenses = Object.keys(expensesData).map((key) => ({
                    id: key,
                    ...expensesData[key],
                }));
                setExpenseList(expenses);

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
        const expenseData = {
            amount: amount,
            description: description,
            category: category,
            email: email,
        }
        console.log(expenseData)
        try {
            const response = await axios.post(`${firebaseUrl}/expenses/${email}.json?auth=${token}`, expenseData,
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
    useEffect(() => {
        fetchExpenses();

    }, [])
    const deleteExpenseHandler = async (expenseId) => {
        try {
            console.log('delete button')
            const response = await axios.delete(`${firebaseUrl}/expenses/${email}/${expenseId}.json?auth=${token}`);
            console.log('dataa deleted ')
            console.log(response)

            fetchExpenses(); // Fetch updated expenses

        } catch (error) {
            console.log(error)
        }
    }
    const editExpenseHandler = async (expenseId) => {
        const updatedExpense = expenseList.find(expense => expense.id === expenseId);
        const updatedExpenses = expenseList.map(expense => {
            if (expense.id === expenseId) {
                return {
                    ...expense,
                    amount: enteredAmount.current.value,
                    description: enteredDescription.current.value,
                };
            }
            return expense;
        });
        setExpenseList(updatedExpenses);
        const updateExpenseData = {
            amount: enteredAmount.current.value,
            description: enteredDescription.current.value,
            category: updatedExpense.category,
            email: email,
        };
        try {
            const response = await axios.put(`${firebaseUrl}/expenses/${email}/${expenseId}.json?auth=${token}`, updateExpenseData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            alert('data updated using ')
            console.log(response)
            fetchExpenses(); // Fetch updated expenses


        } catch (error) {
            alert('some error occered in put')
            console.log(error)
        }
        enteredAmount.current.value = '0';
        enteredDescription.current.value = '';
        setEditingExpenseId(null);
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
                <Button type="submit">Add Expense</Button>
            </Form>
            <Container>
                <h2>Entered Expenses</h2>
                <ul>
                    {expenseList.map((expense) => (
                        <li key={expense.id}>
                            {editingExpenseId === expense.id ? (
                                <>
                                    <Form.Control
                                        type="number"
                                        defaultValue={expense.amount}
                                        ref={enteredAmount}
                                    />
                                    <Form.Control
                                        type="text"
                                        defaultValue={expense.description}
                                        ref={enteredDescription}
                                    />
                                    <Button onClick={() => editExpenseHandler(expense.id)}>
                                        Save
                                    </Button>
                                    <Button onClick={cancelEditing}>Cancel</Button>
                                </>
                            ) : (
                                <>
                                    Amount: {expense.amount},
                                    Description: {expense.description},
                                    Category: {expense.category}
                                    <Button onClick={() => deleteExpenseHandler(expense.id)}>
                                        Delete
                                    </Button>
                                    <Button onClick={() => startEditing(expense.id)}>Edit</Button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </Container>

        </Container>


    )
}

export default ExpensesForm
