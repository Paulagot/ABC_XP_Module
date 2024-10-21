import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

function SignInForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(''); // To show success or error messages
    const navigate = useNavigate(); // Initialize navigate hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let formErrors = {};

        // Email validation
        if (!formData.email) {
            formErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Email address is invalid';
        }

        // Password validation
        if (!formData.password) {
            formErrors.password = 'Password is required';
        }

        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include session cookies
                    body: JSON.stringify(formData),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setMessage('Logged in successfully!');
                    // navigate('/bites'); // Redirect on successful login
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
        <form onSubmit={handleSubmit}>
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

            {message && <p>{message}</p>} {/* Show success or error messages */}
        </form>
    );
}

export default SignInForm;


