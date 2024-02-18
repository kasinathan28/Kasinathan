import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cancellations.css';

function Cancellations() {
  const [cancellations, setCancellations] = useState([]);

  useEffect(() => {
    const getCancellations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getCancellation');
        setCancellations(response.data);
        console.log(response.data);
      } catch (error) {
        console.log('Error fetching the cancellations', error);
      }
    };
    getCancellations();
  }, []);

  const handleCancellation = async (id) => {
    try {
      // Send a request to cancel the specified cancellation by id
      await axios.delete(`http://localhost:5000/cancelCancellation/${id}`);
      // Update the cancellations state to reflect the cancellation
      setCancellations(cancellations.filter((item) => item._id !== id));
      console.log(`Cancellation ${id} cancelled successfully`);
    } catch (error) {
      console.log(`Error cancelling the cancellation ${id}`, error);
    }
  };

  const handleApproval = async (id) => {
    try {
      // Send a request to approve the specified cancellation by id
      await axios.post(`http://localhost:5000/approveCancellation/${id}`);
      // Update the cancellations state to reflect the approval
      setCancellations(cancellations.filter((item) => item._id !== id));
      console.log(`Cancellation ${id} approved successfully`);
    } catch (error) {
      console.log(`Error approving the cancellation ${id}`, error);
    }
  };

  return (
    <div className='cancellationPage'>
      <h1>Cancellations</h1>
      <table className='cancellationTable'>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>User ID</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cancellations.map((cancellation) => (
            <tr key={cancellation._id}>
              <td>{cancellation.paymentIntentId}</td>
              <td>{cancellation.userId}</td>
              <td>{cancellation.reason}</td>
              <td>
                <button id='delete' onClick={() => handleCancellation(cancellation._id)}>Cancel</button>
                <button id='approve' onClick={() => handleApproval(cancellation._id)}>Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cancellations;
