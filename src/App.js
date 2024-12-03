import React, { useState } from 'react';
import './App.css';

// Hardcoded mock API responses
const apiResponses = {
  userInformation: {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false }
    ]
  },
  addressInformation: {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      { name: "state", type: "dropdown", label: "State", options: ["California", "Texas", "New York"], required: true },
      { name: "zipCode", type: "text", label: "Zip Code", required: false }
    ]
  },
  paymentInformation: {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true }
    ]
  }
};

const App = () => {
  const [selectedForm, setSelectedForm] = useState('');
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [submittedData, setSubmittedData] = useState([]);

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
    setFormData({});
    setFormError('');
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentForm = apiResponses[selectedForm];
    if (!currentForm) return;

    // Validate required fields
    const missingFields = currentForm.fields.filter(field => field.required && !formData[field.name]);
    if (missingFields.length > 0) {
      setFormError('Please fill in all required fields.');
      return;
    }

    // If validation passes, submit data
    setSubmittedData([...submittedData, formData]);
    setFormData({});
    setFormError('');
    alert('Form submitted successfully!');
  };

  const handleDelete = (index) => {
    const newData = [...submittedData];
    newData.splice(index, 1);
    setSubmittedData(newData);
    alert('Entry deleted successfully');
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData(submittedData.filter((_, i) => i !== index));
  };

  const renderFields = () => {
    const currentForm = apiResponses[selectedForm];
    if (!currentForm) return null;

    return currentForm.fields.map((field) => (
      <div key={field.name} className="form-group">
        <label htmlFor={field.name}>{field.label}</label>
        {field.type === 'dropdown' ? (
          <select
            name={field.name}
            id={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            required={field.required}
          />
        )}
        {formError && <p className="error">{formError}</p>}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Dynamic Form</h1>

      <div className="form-selection">
        <label htmlFor="formType">Choose Form Type:</label>
        <select
          id="formType"
          value={selectedForm}
          onChange={handleFormChange}
        >
          <option value="">Select Form</option>
          <option value="userInformation">User Information</option>
          <option value="addressInformation">Address Information</option>
          <option value="paymentInformation">Payment Information</option>
        </select>
      </div>

      {selectedForm && (
        <form onSubmit={handleSubmit}>
          {renderFields()}
          <button type="submit">Submit</button>
        </form>
      )}

      <h2>Submitted Data</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data, index) => (
            <tr key={index}>
              <td>{JSON.stringify(data)}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
