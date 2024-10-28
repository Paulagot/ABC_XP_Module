import React, { useState, useEffect, useRef } from 'react';

function ResetPasswordForm({ onReset }) {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [captchaToken, setCaptchaToken] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
    const [message, setMessage] = useState(''); // Success message after email is sent
    const captchaRenderedRef = useRef(false);

    // Handle changes in email input
    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    // Validate email input
    const validate = () => {
        let formErrors = {};
        if (!email) {
            formErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = 'Email address is invalid';
        }
        return formErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else if (!captchaToken) {
            setErrors({ captcha: 'Please complete the CAPTCHA' });
        } else {
            setErrors({});
            setIsLoading(true); // Set loading state to true
            setMessage(''); // Clear any previous message

            // Send email and CAPTCHA token to backend
            const success = await onReset(email, captchaToken); // Pass `onReset` to control success
            if (success) {
                setMessage('An email has been sent with instructions to reset your password. Please check your spam folder and mark the email as not junk.');
            } else {
                setMessage('There was an issue sending the reset email. Please try again.');
            }
            setIsLoading(false); // Stop loading after response
        }
    };

    // Render CAPTCHA once when the component mounts
    useEffect(() => {
        if (!captchaRenderedRef.current && window.turnstile) {
            window.turnstile.render('.cf-turnstile', {
                sitekey: '0x4AAAAAAAyTlqCXTIWAluQM', // Use your actual site key
                callback: (token) => setCaptchaToken(token), // Set the token upon successful CAPTCHA completion
            });
            captchaRenderedRef.current = true; // Prevent re-rendering CAPTCHA
        }
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>

            {/* Show loading message while sending the email */}
            {isLoading ? (
                <p>Hold tight while we prepare the email...</p>
            ) : message ? (
                // Show confirmation message after email is sent
                <p>{message}</p>
            ) : (
                // Show form if not loading and no success message
                <>
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

                    {/* CAPTCHA Widget */}
                    <div className="cf-turnstile" data-sitekey="0x4AAAAAAAyTlqCXTIWAluQM"></div>
                    {errors.captcha && <span className="error">{errors.captcha}</span>}

                    <button type="submit">Reset Password</button>
                </>
            )}
        </form>
    );
}

export default ResetPasswordForm;


