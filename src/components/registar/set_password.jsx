// SetPasswordForm.js
import React, { useState } from 'react';

/**
 * Component for setting a new password using a reset token.
 * @param {string} token - The reset token for verifying the password reset request.
 */
function SetPasswordForm({ token }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    // Handle form input changes for password and confirm password fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') setPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);
    };

    // Validate password and confirm password inputs
    const validate = () => {
        let formErrors = {};
        if (!password) formErrors.password = 'Password is required';
        else if (password.length < 8) formErrors.password = 'Password must be at least 8 characters';

        if (!confirmPassword) formErrors.confirmPassword = 'Please confirm your password';
        else if (confirmPassword !== password) formErrors.confirmPassword = 'Passwords do not match';

        return formErrors;
    };

    // Handle form submission to reset password
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            setMessage(''); // Clear previous messages

            try {
                const response = await fetch(`http://localhost:3000/api/password-reset/${token}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password }),
                });

                if (response.ok) {
                    setMessage('Password successfully reset! You can now log in with your new password.');
                    setPassword('');
                    setConfirmPassword('');
                } else {
                    const data = await response.json();
                    setMessage(data.error || 'Error resetting password. Please try again.');
                }
            } catch (error) {
                console.error('Password reset error:', error);
                setMessage('Error resetting password. Please try again.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Set New Password</h2>

            <div>
                <label>New Password</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div>
                <label>Confirm New Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit">Set Password</button>

            {message && <p>{message}</p>}
        </form>
    );
}

export default SetPasswordForm;

