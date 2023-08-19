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
import { expenseAction } from '../../store/expenseSlice';
import { useDispatch } from 'react-redux';
import Premium from './Premium';
import { csvActions } from '../../store/csvExportSLice';

const ExpensesForm = () => {

    const isAuth = useSelector(state => state.auth);// to get the token which we will use to send request to firebase
    const token = isAuth.token// the token which we will use 

    const dispatch = useDispatch(); //dispatch hook to use actions 

    //refs to get the amount and description and for category i will use state because refs only helpfull when 
    //we have to enter data when select data we can use usestate
    const enteredAmount = useRef(); 
    const enteredDescription = useRef();
    const [category, setCategory] = useState(null)
    const handleCategorySelect = (category) => {
        setCategory(category)
    }


    // To set the expense list and this list we will use to get the data on the screen 
    const [expenseList, setExpenseList] = useState([]); 

    //expenseList contains all the expenses  so we can manipulate it to get amount 
    let totalAmount=0
    expenseList.forEach((element)=>{
        totalAmount+=parseInt(element.amount)
    })
    console.log(totalAmount);


     //i have created this function to donwload csv file when called i click on that it will use csvExportSlice
     function convertDataToCSV(data) {
        // Implement the logic to format your data into a CSV string
        // Example: Convert an array of objects into a CSV string
        const csvRows = [];
        for (const item of data) {
          const values = Object.values(item);
          const row = values.map(value => `"${value}"`).join(",");
          csvRows.push(row);
        }
        return csvRows.join("\n");
      }
  const handleExportCSV=()=>{

                const csvData = convertDataToCSV(expenseList);
                // You can create a Blob or File object and trigger download
                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.csv';
                a.click();
            }
    

    //here i will get premium value if its premium then i wont show upgrade to premium value
    const premium=useSelector(state=>state.premium) //calling the premium state 
    const isPremium=premium.isPremium //accessing isPremium state and assigning it to a constant



    //email which we stored in localStorage will be used  in url 
    const email2 = localStorage.getItem('email');
    const email = email2.replace('@', '').replace('.', ''); //here in the email remove @ and . because they are  used as periods in url


    //In order to edit we need expense id so we create a state which will be used to get the expense id and set 
    const [editingExpenseId, setEditingExpenseId] = useState()


    const startEditing = (expenseId) => {
        setEditingExpenseId(expenseId);
    };

    const cancelEditing = () => {
        setEditingExpenseId(null);
    };


    //this firebase url wil be used 5 times so i created a variable for it
    const firebaseUrl = "https://expensetracker-a3278-default-rtdb.firebaseio.com";


    //this function will  be executed whenever submit button is pressed 
    const submitHandler = async (event) => {
        event.preventDefault(); 

        //since current and value are used to get the entered value like below
        const amount = enteredAmount.current.value;
        const description = enteredDescription.current.value;

        //we will send amount,descripton,category and email to server
        const expenseData = {
            amount: amount,
            description: description,
            category: category,
            email: email, //email is send as well but can be left out since it wont be displayed on the screen 
        }
        
        try {
            const response = await axios.post(`${firebaseUrl}/expenses/${email}.json?auth=${token}`, expenseData,//while sending req in url at last append email which i will enter dynamically which in later i can use to fetch the data for a partcular user
                {
                    headers: {
                        'Content-Type': 'application/json'//telling the server we are sending the data in json format 
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

    //now from expense array   i will get amount 

    
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
                dispatch(expenseAction.addExpenses(expenses));
                setExpenseList(expenses);
            }
        }
        catch (error) {
            console.error('Error fetching expenses:', error);
        }
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
            {totalAmount>=10000 && (<Premium />)}
            <Button onClick={handleExportCSV}>download Expenses</Button>    

            
        </Container>


    )
}

export default ExpensesForm
