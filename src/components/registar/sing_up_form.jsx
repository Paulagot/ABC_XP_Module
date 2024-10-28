import React, { useState, useEffect, useRef } from 'react';

function SignUpForm() {
    // State to hold form input data
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        agreedGDPR: false,
        agreedTnC: false,
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');

    // Ref to keep track of CAPTCHA rendering
    const captchaRenderedRef = useRef(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validate = () => {
        let formErrors = {};
        if (!formData.first_name) formErrors.first_name = 'First name is required';
        if (!formData.last_name) formErrors.last_name = 'Last name is required';
        if (!formData.email) formErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = 'Email is invalid';
        if (!formData.password) formErrors.password = 'Password is required';
        else if (formData.password.length < 8) formErrors.password = 'Password must be at least 8 characters';
        if (!formData.agreedGDPR) formErrors.agreedGDPR = 'You must agree to the GDPR';
        if (!formData.agreedTnC) formErrors.agreedTnC = 'You must agree to the Terms & Conditions';
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
                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...formData, captchaToken }),
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage('User registered successfully! You can now sign in.');
                    setFormData({
                        first_name: '',
                        last_name: '',
                        email: '',
                        password: '',
                        agreedGDPR: false,
                        agreedTnC: false,
                    });
                    setIsSignedUp(true);
                } else {
                    setMessage(data.error || 'An error occurred during sign-up');
                }
            } catch (error) {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    useEffect(() => {
        // Check if CAPTCHA has already been rendered to avoid duplicates
        if (!captchaRenderedRef.current && window.turnstile) {
            window.turnstile.render('.cf-turnstile', {
                sitekey: '0x4AAAAAAAyTlqCXTIWAluQM',
                callback: (token) => {
                    console.log('CAPTCHA success:', token);
                    setCaptchaToken(token);
                },
            });
            captchaRenderedRef.current = true; // Mark CAPTCHA as rendered
        }
    }, []);

    if (isSignedUp) {
        return (
            <div>
                <h2>Sign In</h2>
                <SignInForm />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <div>
                <label>First Name</label>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                {errors.first_name && <span className="error">{errors.first_name}</span>}
            </div>
            <div>
                <label>Last Name</label>
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                {errors.last_name && <span className="error">{errors.last_name}</span>}
            </div>
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
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="agreedGDPR"
                        checked={formData.agreedGDPR}
                        onChange={handleChange}
                        required
                    />
                    I agree to the GDPR terms
                </label>
                {errors.agreedGDPR && <span className="error">{errors.agreedGDPR}</span>}
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="agreedTnC"
                        checked={formData.agreedTnC}
                        onChange={handleChange}
                        required
                    />
                    I agree to the Terms & Conditions
                </label>
                {errors.agreedTnC && <span className="error">{errors.agreedTnC}</span>}
            </div>

            {/* Explicitly rendered Turnstile CAPTCHA widget */}
            <div className="cf-turnstile" data-sitekey="0x4AAAAAAAyTlqCXTIWAluQM"></div>

            <button type="submit">Sign Up</button>

            {message && <p>{message}</p>}
        </form>
    );
}

// Example SignInForm component for after successful registration
function SignInForm() {
    return (
        <div>
            <h3>Sign In</h3>
            <form>
                <div>
                    <label>Email</label>
                    <input type="email" required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" required />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

export default SignUpForm;
