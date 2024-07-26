import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './form-view.css';

export default function FormView() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState({});
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`http://localhost:7786/form/view/${id}`);
                setForm(response.data);

                // Initialize form data with default values
                const initialData = response.data.inputs.reduce((acc, input) => {
                    acc[input._id] = ''; // Initialize with empty string
                    return acc;
                }, {});
                setFormData(initialData);
            } catch (error) {
                console.error('Error fetching form:', error);
            }
        };

        fetchForm();
    }, [id]);

    const handleInputChange = (inputId, event) => {
        const { value, type } = event.target;
        setFormData(prevData => ({ ...prevData, [inputId]: value }));

        if (type === 'email') {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(value)) {
                setEmailError('Invalid email format');
            } else {
                setEmailError('');
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (emailError) {
            toast.error('Please correct the errors before submitting.');
            return;
        }

        try {
            await axios.post('http://localhost:7786/form/submit', {
                formId: id,
                data: formData
            });
            toast.success('Form submitted successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error submitting form.');
        }
    };

    if (!form) return <p>Loading...</p>;

    return (
        <div className="form-view-container">
            <h1 className="text-center">{form.title}</h1>
            <form className="form-view-content" onSubmit={handleSubmit}>
                {form.inputs.map((input, index) => (
                    index % 2 === 0 ? (
                        <div className="row" key={index}>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">{form.inputs[index].title}</label>
                                <input
                                    type={form.inputs[index].type}
                                    className="form-control"
                                    placeholder={form.inputs[index].placeholder}
                                    value={formData[form.inputs[index]._id] || ''}
                                    onChange={(e) => handleInputChange(form.inputs[index]._id, e)}
                                />
                                {form.inputs[index].type === 'email' && emailError && (
                                    <p className="text-danger">{emailError}</p>
                                )}
                            </div>
                            {index + 1 < form.inputs.length && (
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{form.inputs[index + 1].title}</label>
                                    <input
                                        type={form.inputs[index + 1].type}
                                        className="form-control"
                                        placeholder={form.inputs[index + 1].placeholder}
                                        value={formData[form.inputs[index + 1]._id] || ''}
                                        onChange={(e) => handleInputChange(form.inputs[index + 1]._id, e)}
                                    />
                                    {form.inputs[index + 1].type === 'email' && emailError && (
                                        <p className="text-danger">{emailError}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : null
                ))}
                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-success">Submit</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
