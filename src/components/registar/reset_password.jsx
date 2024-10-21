// ResetPasswordForm.js
import React, { useState } from 'react';

function ResetPasswordForm({ onReset }) {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const validate = () => {
        let formErrors = {};

        // Email validation
        if (!email) {
            formErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = 'Email address is invalid';
        }

        return formErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            // Pass validated email to parent or backend API to send reset link
            onReset(email);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>

            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <button type="submit">Reset Password</button>
        </form>
    );
}

export default ResetPasswordForm;
