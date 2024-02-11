import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Expe.css';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditTransactionModal from '../More/Editmonth.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function App() {
    const navigate=useNavigate()
  const [transactions, setTransactions] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    year:"",
    month:"",
    amount: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditClick = (transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const fetchTransactions = async () => {
    try {
    const adminUsername = Cookies.get("authToken");
      const response = await axios.get('https://financialtransactions.onrender.com/month');
      const gettingdata=response.data
      const filtereddata=gettingdata.filter(item=>item.id==adminUsername)
      setTransactions(filtereddata);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const addTransaction = async () => {
    const { year, month, amount } = newTransaction;
    const id=Cookies.get("authToken")

    if (!year || !month || isNaN(amount)) {
      alert("Please fill in all fields with valid data.");
      return;
    }

    try {
      await axios.post('https://financialtransactions.onrender.com/month', {id, year,month, amount: parseFloat(amount) });
      // After successfully adding the transaction, fetch updated transactions
      fetchTransactions();
      setNewTransaction({ year:'',month: '', amount: '' });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const calculateBalance = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const handledelete=(ids)=>{
    axios.delete(`https://financialtransactions.onrender.com/month/${ids}`)
      .then(() => {
        setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction._id !== ids));
      })
      .catch(error => console.error('Error deleting transaction:', error));
  }

  const calculateMonthlySummary = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() + 1 === currentMonth;
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const saveEditedTransaction = (editedTransaction) => {
    axios.put(`https://financialtransactions.onrender.com/month/${editedTransaction._id}`, editedTransaction)
      .then(() => {
        setTransactions(transactions => transactions.map(t => t._id === editedTransaction._id ? editedTransaction : t));
        closeModal();
        // fetchData()
      })
      .catch(error => console.error('Error saving transaction:', error));
  };
  const closeModal = () => {
    setIsEditModalOpen(false);
    setTransactionToEdit(null);
  };



  useEffect(() => {
    // Check if the user is already logged in
    const adminUsername = Cookies.get("authToken");
    if (!adminUsername) {
      navigate("/login");
    }
  }, []);

  const logout=()=>{
    Cookies.remove("authToken")
    navigate("/login")
  }

  return (
    <div className="container">
        <ArrowBackIosIcon style={{cursor:"pointer"}} onClick={()=>navigate("/expence")}  />
        <div style={{display:'flex',justifyContent:"space-between"}}>
            <h1 className="title">Month Tracker</h1>
            <button onClick={logout} className='logou'>Logout</button>
        </div>
      <div className="form">
        <label className="form-label">Year:</label>
        <input type="text" name="year" value={newTransaction.year} onChange={handleInputChange} required />

        <label className="form-label">Month:</label>
        <input type="text" name="month" value={newTransaction.month} onChange={handleInputChange} required />

        <label className="form-label">Amount:</label>
        <input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} required />

        <button className="form-button" onClick={addTransaction}>Add Transaction</button>
      </div>

      {isEditModalOpen && (
  <EditTransactionModal
    transaction={transactionToEdit}
    onSave={saveEditedTransaction}
    onCancel={closeModal}
  />
)}

      <div className="table-responsive">
      <h2 className="dashboard-heading">Recent Transactions</h2>
                <table className="table mt-3" style={{width:"100%",borderStyle:"solid",borderCollapse: "collapse", border: "1px solid #ddd"}}>
                  <thead style={{textAlign:"center",borderStyle:"solid",border: "1px solid #ddd",margin:"20px"}}>
                    <tr>
                      <th>Edit</th>
                      <th>Year</th>
                      <th>Month</th>
                      <th>Amount</th> 
                      <th>Delete</th>                     
                    </tr>
                  </thead>

                  <tbody style={{textAlign:"center"}}>
                    {transactions.map((item) => (
                      <tr key={item._id}>
                        <td style={{padding:'10px'}}><ModeEditIcon style={{cursor:"pointer"}} onClick={() => handleEditClick(item)}/></td>
                        <td>{item.year}</td>
                        <td>{item.amount}</td>
                        <td>{item.month}</td>
                        <td>
                            <DeleteForeverIcon style={{cursor:"pointer"}} onClick={() => handledelete(item._id)}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
    </div>
  );
}

export default App;