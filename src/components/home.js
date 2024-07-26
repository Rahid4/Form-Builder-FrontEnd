import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function Home() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get('http://localhost:7786/getAll');
                setForms(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching forms:', error);
                setLoading(false);
            }
        };

        fetchForms();
    }, []);

    const handleCreateClick = () => {
        navigate('/form/create');
    };

    const handleView = (id) => {
        navigate(`/form/view/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/form/edit/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:7786/form/delete/${id}`);
            setForms(forms.filter(form => form._id !== id));
        } catch (error) {
            console.error('Error deleting form:', error);
        }
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center">
            <div className="text-center">
                <h1>Welcome to Form.com</h1>
                <p>This is a simple form builder</p>
                <button type="button" className="btn btn-success" onClick={handleCreateClick}>
                    CREATE NEW FORM
                </button>
                <hr />
                <div>
                    <h1>Forms</h1>
                    {loading ? (
                        <p>Loading...</p>
                    ) : forms.length === 0 ? (
                        <p>No forms to show</p>
                    ) : (
                        <ul className="list-group">
                            {forms.map(form => (
                                <li key={form._id} className="list-group-item">
                                    <div className="d-flex flex-column align-items-start">
                                        <span className="mb-2">{form.title}</span>
                                        <div>
                                            <button
                                                className="btn btn-info me-2 btn-sm"
                                                onClick={() => handleView(form._id)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-warning me-2 btn-sm"
                                                onClick={() => handleEdit(form._id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(form._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
