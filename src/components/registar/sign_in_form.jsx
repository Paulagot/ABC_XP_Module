// sign_in_form.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SignInForm component handles user login requests.
 * Validates email and password inputs, and sends them to the backend for authentication.
 */
function SignInForm({ onSignIn }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({}); // Stores validation errors for form inputs
    const [message, setMessage] = useState(''); // Success or error message for login response
    const navigate = useNavigate(); // Used for page navigation on successful login

    // Handles input change and updates formData state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Validates email and password inputs, adding errors to 'errors' state if needed
    const validate = () => {
        let formErrors = {};

        if (!formData.email) {
            formErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Email address is invalid';
        }

        if (!formData.password) {
            formErrors.password = 'Password is required';
        }

        return formErrors;
    };

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Submits form data to backend API if inputs are valid
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
    
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                const response = await fetch(`${API_BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                    credentials: 'include', // Send cookies for session handling
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setMessage('Logged in successfully!');
                    navigate('/bytes'); // Redirect to /bytes or dashboard
                } else {
                    const errorData = await response.json();
                    setMessage(errorData.error || 'An error occurred during sign-in');
                }
            } catch (error) {
                setMessage('An error occurred. Please try again.');
            }
        }
    };
    

    return (
        <form className="registerForm" onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <button type="submit">Sign In</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default SignInForm;
