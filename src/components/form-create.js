import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPen, FaTrash } from 'react-icons/fa';
import axios from 'axios'; 
import './form-create.css';

export default function FormCreate() {
  const [title, setTitle] = useState('Untitled Form');
  const [editingTitle, setEditingTitle] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [editingInput, setEditingInput] = useState(null);

  console.log('title',title)
  console.log('inputs',inputs)

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addInput = (type) => {
    if (inputs.length >= 20) {
      alert('Maximum of 20 inputs allowed');
      return;
    }
    const newInput = { type, id: inputs.length, title: 'Title', placeholder: 'Placeholder' };
    setInputs([...inputs, newInput]);
  };

  const startEditingInput = (input) => {
    setEditingInput(input);
    setEditingTitle(false);
  };

  const updateInput = (e) => {
    const { name, value } = e.target;
    setEditingInput(prev => ({ ...prev, [name]: value }));
  };

  const saveInput = () => {
    setInputs(inputs.map(input => (input.id === editingInput.id ? editingInput : input)));
    setEditingInput(null);
  };

  const deleteInput = (id) => {
    setInputs(inputs.filter(input => input.id !== id));
  };

  const saveForm = async () => {
    try {
      const response = await axios.post('http://localhost:7786/form/create', {
        title,
        inputs
      });
      alert('Form saved successfully');
      console.log(response.data);
    } catch (error) {
      alert('Error saving form');
      console.error(error);
    }
  };

  return (
    <div className="form-create-wrapper">
      <div className="container">
        <h3 className="text-center">Create New Form</h3>
        <div className="form-create-box">
          <div className="form-creation-section">
            <h4>
              {title}
              <FaPen onClick={() => { setEditingTitle(true); setEditingInput(null); }} className="edit-icon" />
            </h4>
            <div className="mb-4">
              <div className="row">
                {inputs.map((input) => (
                  <div key={input.id} className="col-md-6 mb-3">
                    <div className="input-item d-flex align-items-center">
                      <div className="me-2">{input.title}</div>
                      <input
                        type={input.type}
                        className="form-control"
                        placeholder={input.placeholder}
                        readOnly
                      />
                      <FaPen onClick={() => startEditingInput(input)} className="edit-icon me-2" />
                      <FaTrash onClick={() => deleteInput(input.id)} className="delete-icon" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-outline-primary mb-3" onClick={() => setShowAddInput(!showAddInput)}>
              {showAddInput ? 'Close Add Input' : 'Add Input'}
            </button>
            {showAddInput && (
              <div className="mb-3">
                <button className="btn btn-primary me-2 mb-2" onClick={() => addInput('text')}>Text</button>
                <button className="btn btn-primary me-2 mb-2" onClick={() => addInput('number')}>Number</button>
                <button className="btn btn-primary me-2 mb-2" onClick={() => addInput('email')}>Email</button>
                <button className="btn btn-primary me-2 mb-2" onClick={() => addInput('password')}>Password</button>
                <button className="btn btn-primary me-2 mb-2" onClick={() => addInput('date')}>Date</button>
              </div>
            )}
            <button className="btn btn-success" onClick={saveForm}>Save Form</button>
          </div>
          <div className="form-editor-section">
            <h4>Form Editor</h4>
            {editingTitle ? (
              <div className="input-container mb-3">
                <p>Title</p>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="form-control"
                  placeholder="Enter form title"
                  onBlur={() => setEditingTitle(false)}
                />
              </div>
            ) : editingInput ? (
              <div>
                <div className="input-container mb-3">
                  <p>Title</p>
                  <input
                    type="text"
                    name="title"
                    value={editingInput.title}
                    onChange={updateInput}
                    className="form-control"
                    placeholder="Enter input title"
                  />
                </div>
                <div className="input-container mb-3">
                  <p>Placeholder</p>
                  <input
                    type="text"
                    name="placeholder"
                    value={editingInput.placeholder}
                    onChange={updateInput}
                    className="form-control"
                    placeholder="Enter placeholder"
                  />
                </div>
                <button className="btn btn-success" onClick={saveInput}>Save</button>
              </div>
            ) : (
              <p>Select an input to edit</p>
            )}
          </div>
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary">Create Form</button>
        </div>
      </div>
    </div>
  );
}
