import React, { useState } from 'react';

const EditTransactionModal = ({ transaction, onSave, onCancel }) => {
  const [editedTransaction, setEditedTransaction] = useState({ ...transaction });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction({ ...editedTransaction, [name]: value });
  };

  return (
    <div className="edit-transaction-modal">
      <div className="edit-transaction-content">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={editedTransaction.date}
          onChange={handleInputChange}
        />
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={editedTransaction.category}
          onChange={handleInputChange}
        />
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={editedTransaction.amount}
          onChange={handleInputChange}
        />
        <button onClick={() => onSave(editedTransaction)}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditTransactionModal;