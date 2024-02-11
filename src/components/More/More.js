import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import './TransactionFilter.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import EditTransactionModal from './EditTransactionModal.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Swal from "sweetalert2";

const TransactionFilter = () => {
    const navigate=useNavigate()
  const [transactions, setTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [fmonth,setMonthYear]=useState([])
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthamount,setMonthamount]=useState("")
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null)

  const handleEditClick = (transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setTransactionToEdit(null);
  };

  const saveEditedTransaction = (editedTransaction) => {
    axios.put(`https://financialtransactions.onrender.com/transactions/${editedTransaction._id}`, editedTransaction)
      .then(() => {
        setTransactions(transactions => transactions.map(t => t._id === editedTransaction._id ? editedTransaction : t));
        closeModal();
        // fetchData()
      })
      .catch(error => console.error('Error saving transaction:', error));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminUsername = Cookies.get('authToken');
        const response = await axios.get('https://financialtransactions.onrender.com/transactions');
        const gettingdata = response.data;
        const filtereddata = gettingdata.filter((item) => item.id === adminUsername);
        setTransactions(filtereddata);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
const monthNumberToName = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  };
  
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchMonthYear();
    }
  }, [selectedYear, selectedMonth]);
  
  const fetchMonthYear = async () => {
    try {
      const adminUsername = Cookies.get("authToken");
      const response = await axios.get('https://financialtransactions.onrender.com/month');
      const gettingMonth = response.data;
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      const nemonth = selectedMonth;
  
      console.log(monthNumberToName[nemonth], "new Month", gettingMonth[0].month);
  
      const filteredMonthYear = gettingMonth.filter(item =>
        item.id === adminUsername.toString() &&
        item.month.toLowerCase() === monthNumberToName[nemonth].toLowerCase() && 
        item.year === selectedYear
      );
      if (filteredMonthYear.length > 0) {
        const am = filteredMonthYear[0].amount;
        setMonthYear(am);
        console.log(filteredMonthYear, "NEW DATA");
      } else {
        // Handle the case when the amount is not found
        setMonthYear('Please Update the Salary');
        console.log('No data found');
      }
  
      console.log(filteredMonthYear, "NEW DATA");
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  console.log(selectedMonth,selectedYear)

  const filterTransactions = () => {
    setIsEditModalOpen(false);
    const filtered = transactions.filter((transaction) => {
      const transactionYear = new Date(transaction.date).getFullYear().toString();
      const transactionMonth = (new Date(transaction.date).getMonth() + 1).toString().padStart(2, '0');

      return transactionYear === selectedYear && transactionMonth === selectedMonth;
      
    });

    setFilteredTransactions(filtered);
    const totalAmount = filtered.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
    // console.log('Total Amount for Filtered Transactions:', totalAmount);
    const fix2 = isNaN(totalAmount) ? 0 : totalAmount.toFixed(2);
    setMonthamount(fix2)
  };
  const uniqueYears = Array.from(new Set(transactions.map((transaction) => new Date(transaction.date).getFullYear())));

  const uniqueMonths = Array.from(
    new Set(transactions.map((transaction) => new Date(transaction.date).getMonth() + 1))
  ).sort();

  const handleDelete=(ids)=>{
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
  const calculateBalance = () => {
    const totalAmount = transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
  const remainingBudget = fmonth - calculateMonthlySummary();
  return isNaN(remainingBudget) ? 0 : remainingBudget
  };

  const calculateMonthlySummary = () => {
    const currentMonth = new Date().getMonth() + 1;
    const totalAmount = transactions
      .filter(transaction => new Date(transaction.date).getMonth() + 1 === currentMonth)
      .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
    return isNaN(totalAmount) ? 0 : totalAmount;
  };

  return (
    <div className="transaction-filter-container">
        <ArrowBackIosIcon style={{cursor:"pointer"}} onClick={()=>navigate("/expence")} />
      <label className="transaction-label" htmlFor="year">
        Select Year:
      </label>
      <select
        className="transaction-select"
        id="year"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="">-- Select Year --</option>
        {uniqueYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <label className="transaction-label" htmlFor="month">
        Select Month:
      </label>
      <select
        className="transaction-select"
        id="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">-- Select Month --</option>
        {uniqueMonths.map((month) => (
          <option key={month} value={month.toString().padStart(2, '0')}>
            {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>

      <button className="transaction-button" onClick={filterTransactions}>
        Filter Transactions
      </button>
      <h2>{monthNumberToName[selectedMonth]} Salary: <span style={{fontSize:"15px"}}>{fmonth}</span></h2>
      <div style={{marginTop:"20px"}}>
      {isEditModalOpen && (
        <EditTransactionModal
          transaction={transactionToEdit}
          onSave={saveEditedTransaction}
          onCancel={closeModal}
        />
      )}
      </div>

      <div className="transaction-list">
        {filteredTransactions.length > 0 ? (
            <>
            <table className="table mt-3" style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead style={{ textAlign: "center", border: "1px solid #ddd" }}>
            <tr>
              <th>Edit</th>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Delete</th>
            </tr>
          </thead>
        
          <tbody style={{ textAlign: "center" }}>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td><ModeEditIcon style={{cursor:"pointer"}} onClick={() => handleEditClick(transaction)}/></td>
                <td>{transaction.date}</td>
                <td>{transaction.category}</td>
                <td>{transaction.amount}</td>
                <td>
                  <DeleteForeverIcon style={{cursor:"pointer"}} onClick={() => handleDelete(transaction._id)}/>
                </td>
              </tr>
            ))}
          </tbody>
            </table>
            <div style={{display:'flex',justifyContent:"space-around"}}>
          <div>
            {/* <h2 className="dashboard-heading">Current</h2> */}
            <p className="current-balance" style={{borderBottom:"10px",borderStyle:"solid"}} >Remaining: ${calculateBalance().toFixed(2)}</p>
          </div>
          <div>
            {/* <h2 className="dashboard-heading">Expence</h2> */}
            <p className="current-balance" style={{borderBottom:"10px",borderStyle:"solid"}}>Expenced: ${monthamount}</p>
          </div>
        </div>
            </>
        
        ) : (
          <div className="transaction-message">No transactions found for the selected year and month.</div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilter;