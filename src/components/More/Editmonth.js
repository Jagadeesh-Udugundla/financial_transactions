import React, { useState, useEffect } from 'react';

const EditTransactionModal = ({ transaction, onSave, onCancel }) => {
  const [editedTransaction, setEditedTransaction] = useState({});

  useEffect(() => {
    setEditedTransaction(transaction);
  }, [transaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction({ ...editedTransaction, [name]: value });
  };

  return (
    <div className="edit-transaction-modal">
      <div className="edit-transaction-content">
        <label>Year</label>
        <input
          type="text"
          name="year"
          value={editedTransaction.year || ''}
          onChange={handleInputChange}
        />
        <label>Month</label>
        <input
          type="text"
          name="month"
          value={editedTransaction.month || ''}
          onChange={handleInputChange}
        />
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={editedTransaction.amount || ''}
          onChange={handleInputChange}
        />
        <button onClick={() => onSave(editedTransaction)}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditTransactionModal;
