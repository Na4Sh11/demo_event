import React, { useState } from 'react';
import { FaCheckCircle, FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa'; 
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const PaymentPage = ({ userId, eventId }) => { // Assume userId and eventId are passed as props
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [noOfTickets, setNoOfTickets] = useState(1); // Default to 1 ticket
  const [isValid, setIsValid] = useState(true);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cardNumberRegex = /^\d{16}$/; // 16 digits
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
  const cvvRegex = /^\d{3,4}$/; // 3 or 4 digits

  
  const handlePaymentSubmit = async () => {
    if (
      emailRegex.test(email) &&
      cardNumberRegex.test(cardNumber) &&
      expiryDateRegex.test(expiryDate) &&
      cvvRegex.test(cvv)
    ) {
      setIsValid(true);
      
      console.log(userId);
      console.log(eventId);
      console.log(noOfTickets);
      try {
        // API call to buy tickets
        const response = await axios.post('http://localhost:5001/users/buyTickets', {
          userId: 1,
          eventId: '1ApZkeKGkdrhkM6',
          noOfTickets
        });
      

        if (response.status === 200) {
          setPurchaseSuccess(true);
          console.log('Tickets purchased successfully');
        } else {
          console.error('Failed to purchase tickets:', response.data.error);
        }
      } catch (err) {
        console.error('Error during payment:', err);
      }
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="payment-page">
      <h1>Payment</h1>
      <Form>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group controlId="formEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!isValid && !emailRegex.test(email)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group controlId="formCardNumber">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            isInvalid={!isValid && !cardNumberRegex.test(cardNumber)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid 16-digit card number.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group controlId="formExpiryDate">
          <Form.Label>Expiry Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            isInvalid={!isValid && !expiryDateRegex.test(expiryDate)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid expiry date (MM/YY).
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group controlId="formCVV">
          <Form.Label>CVV</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            isInvalid={!isValid && !cvvRegex.test(cvv)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid CVV (3 or 4 digits).
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group controlId="formNoOfTickets">
          <Form.Label>Number of Tickets</Form.Label>
          <Form.Control
            type="number"
            value={noOfTickets}
            onChange={(e) => setNoOfTickets(Number(e.target.value))}
            required
          />
        </Form.Group>

        <Button variant="primary" onClick={handlePaymentSubmit}>
          Submit Payment
        </Button>
      </Form>

      {purchaseSuccess && (
        <div className="payment-success mt-4">
          <FaCheckCircle color="green" size="2em" />
          <p>Purchase successful!</p>
          <p><strong>First Name:</strong> {firstName}</p>
          <p><strong>Last Name:</strong> {lastName}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Event:</strong> Concert</p>
          
          <div className="card-icons-container mt-2">
            <FaCcVisa className="card-icon" />
            <FaCcMastercard className="card-icon" />
            <FaCcAmex className="card-icon" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
