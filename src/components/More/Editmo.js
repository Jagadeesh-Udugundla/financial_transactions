import React, { useState } from 'react';

const EditPopup = ({ onSave, onCancel, initialData }) => {
  const [editedData, setEditedData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = () => {
    onSave(editedData);
  };

  return (
    <div className="edit-popup">
      <h2>Edit Transaction</h2>
      <label htmlFor="editedDate">Date:</label>
      <input
        type="text"
        id="editedDate"
        name="date"
        value={editedData.date}
        onChange={handleInputChange}
      />
      <label htmlFor="editedCategory">Category:</label>
      <input
        type="text"
        id="editedCategory"
        name="category"
        value={editedData.category}
        onChange={handleInputChange}
      />
      <label htmlFor="editedAmount">Amount:</label>
      <input
        type="text"
        id="editedAmount"
        name="amount"
        value={editedData.amount}
        onChange={handleInputChange}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditPopup;
