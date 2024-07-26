import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPen, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './form-create.css';

export default function FormUpdate() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [title, setTitle] = useState('');
    const [inputs, setInputs] = useState([]);
    const [showAddInput, setShowAddInput] = useState(false);
    const [editingInput, setEditingInput] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`http://localhost:7786/form/view/${id}`);
                const form = response.data;
                setTitle(form.title);
                setInputs(form.inputs);
            } catch (error) {
                console.error('Error fetching form:', error);
            }
        };

        fetchForm();
    }, [id]);

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

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:7786/form/edit/${id}`, { title, inputs });
            alert('Form updated successfully');
            navigate('/');
        } catch (error) {
            console.error('Error updating form:', error);
            alert('Error updating form');
        }
    };

    return (
        <div className="form-create-wrapper">
            <div className="container">
                <h3 className="text-center">Update Form</h3>
                <div className="form-create-box">
                    <div className="form-creation-section">
                        <h4>
                            {title}
                            <FaPen onClick={() => { }} className="edit-icon" />
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
                    </div>
                    <div className="form-editor-section">
                        <h4>Form Editor</h4>
                        {editingInput ? (
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
                    <button className="btn btn-success" onClick={handleUpdate}>Update Form</button>
                </div>
            </div>
        </div>
    );
}
