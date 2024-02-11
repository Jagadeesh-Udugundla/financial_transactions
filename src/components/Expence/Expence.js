import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Expe.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import EditTransactionModal from '../More/EditTransactionModal.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Swal from "sweetalert2";

function App() {
    const navigate=useNavigate()
  const [transactions, setTransactions] = useState([]);
  const [fmonth,setMonthYear]=useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [month,setMonth]=useState("")
  const [year,setYear]=useState("")
  const [transactionToEdit, setTransactionToEdit] = useState(null)

  const [camount,setCamount]=useState("")
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    category: '',
    amount: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);
  useEffect(() => {
    fetchMonthYear();
  }, []);

  const dat=new Date()
  const options = { month: 'long' };
  const fullMonth = dat.toLocaleDateString('en-US', options);
    const dyear = dat.getFullYear();
  // console.log(dat,fullMonth,dyear,"jna")

  const saveEditedTransaction = (editedTransaction) => {
    axios.put(`https://financialtransactions.onrender.com/transactions/${editedTransaction._id}`, editedTransaction)
      .then(() => {
        setTransactions(transactions => transactions.map(t => t._id === editedTransaction._id ? editedTransaction : t));
        Swal.fire({
          icon: "success",
          title: "Edited successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        closeModal();
        // fetchData()
      })
      .catch(error => console.error('Error saving transaction:', error));
  };
  const closeModal = () => {
    setIsEditModalOpen(false);
    setTransactionToEdit(null);
  };


  const fetchMonthYear = async () => {
    try {
      const adminUsername = Cookies.get("authToken");
      const response = await axios.get('https://financialtransactions.onrender.com/month');
      const gettingMonth = response.data;
  
      // console.log(gettingMonth, "getmonth");
  
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      // console.log(currentMonth.toString(),currentYear.toString(),"jadkl")
  
      const filteredMonthYear = gettingMonth.filter(item => 
        item.id === adminUsername &&
        item.month === fullMonth.toString() &&
        item.year === dyear.toString() // Convert to string for strict comparison
      );
  
      // console.log(gettingMonth, filteredMonthYear, "kjna");
      if (filteredMonthYear.length>0){
        setMonthYear(filteredMonthYear[0].amount)
      }else{
        setMonthYear("please Update the Salary")
      }
      // setMonthYear(filteredMonthYear[0].amount);
      // console.log(filteredMonthYear, "actual");
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  const fetchTransactions = async () => {
    try {
      const adminUsername = Cookies.get("authToken");
      const response = await axios.get('https://financialtransactions.onrender.com/transactions');
      const gettingdata = response.data;
      // console.log(gettingdata,"GETTING DATA")
        const filtereddata = gettingdata.filter(item => {
        const transactionDate = new Date(item.date);
        return (
          item.id==adminUsername &&
          transactionDate.getFullYear() === dyear &&
          transactionDate.toLocaleDateString('en-US', { month: 'long' }) === fullMonth // 0-indexed, so February is 1
        );
      });
      // console.log(filtereddata,"FILTERED DATA")
  
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
    const { date, category, amount } = newTransaction;
    const id=Cookies.get("authToken")

    if (!date || !category || isNaN(amount)) {
      Swal.fire({
        icon: "error",
        title: "transaction added failed",
        text: "Add all the details.",
      });
      // alert("Please fill in all fields with valid data.");
      return;
    }

    try {
      await axios.post('https://financialtransactions.onrender.com/transactions', {id, date, category, amount: parseFloat(amount) });
      Swal.fire({
        icon: "success",
        title: "Transaction added successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      // After successfully adding the transaction, fetch updated transactions
      fetchTransactions();
      setNewTransaction({ date: '', category: '', amount: '' });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "transaction added failed",
        text: "Add all the details.",
      });
      console.error('Error adding transaction:', error);
    }
  };
  const calculateBalance = () => {
    const totalAmount = transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
  const remainingBudget = fmonth - calculateMonthlySummary();
  return isNaN(remainingBudget) ? 0 : remainingBudget
  };
  const handledelete=(ids)=>{
    axios.delete(`https://financialtransactions.onrender.com/transactions/${ids}`)
      .then(() => {
        setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction._id !== ids));
        Swal.fire({
          icon: "success",
          title: "Deleted successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(error => console.error('Error deleting transaction:', error));
  }

  const calculateMonthlySummary = () => {
    const currentMonth = new Date().getMonth() + 1;
    const totalAmount = transactions
      .filter(transaction => new Date(transaction.date).getMonth() + 1 === currentMonth)
      .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
    return isNaN(totalAmount) ? 0 : totalAmount;
  };
  

  useEffect(() => {
    // Check if the user is already logged in
    const adminUsername = Cookies.get("authToken");
    if (!adminUsername) {
      navigate("/login");
    }
  }, []);

  const handleEditClick = (item) => {
    setTransactionToEdit(item);
    setIsEditModalOpen(true);
  };

  const logout=()=>{
    Cookies.remove("authToken")
    navigate("/login")
  }
  // console.log(fmonth[0].amount,"fmonth")

  return (
    <div className="container">
      {/* <ArrowBackIosIcon/> */}
      <h3 className="current-balance" style={{borderBottom:"5px",borderStyle:"solid",textAlign:"center",borderBottomLeftRadius:"7px"}}>{fullMonth}</h3>
        <div style={{display:'flex',justifyContent:"space-between"}}>
            <h1 className="title">Expense Tracker</h1>
            <button onClick={logout} className='logou' style={{height:"30px"}}>Logout</button>
        </div>
      <div className="form">
        <label className="form-label">Date:</label>
        <input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} required />

        <label className="form-label">Category:</label>
        <input type="text" name="category" value={newTransaction.category} onChange={handleInputChange} required />

        <label className="form-label">Amount:</label>
        <input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} required />

        <button className="form-button" onClick={addTransaction}>Add Transaction</button>
      </div>
      <div className="dashboard">
      <div className="table-responsive">

      <h3>Current Month Salary: <span style={{fontSize:"15px"}}>{fmonth}</span></h3>
      <div id="editable">
      {isEditModalOpen && (
        <EditTransactionModal
          transaction={transactionToEdit}
          onSave={saveEditedTransaction}
          onCancel={closeModal}
        />
      )}
      </div>
      <h2 className="dashboard-heading">Recent Transactions</h2>
        <table className="table mt-3" style={{width:"100%",borderStyle:"solid",borderCollapse: "collapse", border: "1px solid #ddd"}}>
          <thead style={{textAlign:"center",borderStyle:"solid",border: "1px solid #ddd",margin:"20px"}}>
            <tr style={{padding:"20px"}}>
              <th>Edit</th>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th> 
              <th>Delete</th>                     
            </tr>
          </thead>

          <tbody style={{textAlign:"center"}}>
            {transactions.map((item) => (
              <tr key={item._id} >
                <td href="#editable" style={{padding:"10px"}}><ModeEditIcon style={{cursor:"pointer"}} onClick={() => handleEditClick(item)}/></td>
                <td>{item.date}</td>
                <td>{item.category}</td>
                <td>{item.amount}</td>
                <td>
                  <DeleteForeverIcon style={{cursor:"pointer"}} onClick={()=>handledelete(item._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div style={{display:'flex',justifyContent:"space-around",marginTop:"25px"}}>
          <div>
            {/* <h2 className="dashboard-heading">Current</h2> */}
            <p className="current-balance" style={{borderBottom:"10px",borderStyle:"solid"}} >Remaining: ${calculateBalance().toFixed(2)}</p>
          </div>
          <div>
            {/* <h2 className="dashboard-heading">Expence</h2> */}
            <p className="current-balance" style={{borderBottom:"10px",borderStyle:"solid"}}>Expenced: ${calculateMonthlySummary().toFixed(2)}</p>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:"column"}}>
          <div style={{textAlign:"end"}}>
            <button className='viewmore' onClick={()=>navigate("/addsalary")} style={{border:"none",marginBottom:"25px"}}>Add Monthly Salary</button>
          </div>
          <div style={{textAlign:"end"}}>
            <button className='viewmore' onClick={()=>navigate("/more")} style={{border:"none",marginBottom:"25px"}}>View More</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
