// sign_in_main_body.js
import React, { useState, useEffect } from 'react';
import SignUpForm from './sing_up_form';
import SignInForm from './sign_in_form';
import ResetPasswordForm from './reset_password';
import SetPasswordForm from './set_password';
import { useLocation } from 'react-router-dom';

/**
 * Main container component for handling sign-in, sign-up, reset password, and set password views.
 * Dynamically renders the appropriate form based on the 'view' state and URL parameters.
 */
function SignInMainBody() {
    const [view, setView] = useState('signIn'); // Default to 'signIn' to show SignInForm first
    const [resetToken, setResetToken] = useState(null); // Stores token for password reset
    const location = useLocation();

    // Effect to parse URL parameters on component mount and set initial view/token if provided
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlView = params.get('view');
        const urlToken = params.get('token');

        if (urlView) {
            setView(urlView); // Sets initial view based on URL param if available
        }

        if (urlView === 'setPassword' && urlToken) {
            setResetToken(urlToken); // Sets token for setting a new password
        }
    }, [location]);

    // Callback to switch to sign-in view after successful registration
    const handleSignUp = () => {
        setView('signIn');
    };

    // Callback to handle sign-in and redirect on successful login
    const handleSignIn = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                window.location.href = 'http://localhost:5173/bytes'; // Redirect to /bytes after login
            } else {
                const data = await response.json();
                console.error(data.error);
            }
        } catch (error) {
            console.error('Sign-in error:', error);
        }
    };

    return (
        <main className="container__right" id="main">
            {/* Render the form based on the current view */}
            {view === 'signIn' && <SignInForm onSignIn={handleSignIn} />}
            {view === 'signUp' && <SignUpForm onSignUp={handleSignUp} />}
            {view === 'resetPassword' && <ResetPasswordForm />}
            {view === 'setPassword' && <SetPasswordForm token={resetToken} />}

            {/* Conditional rendering of navigation buttons */}
            <div className="toggle-links">
                {view !== 'signIn' && (
                    <button onClick={() => setView('signIn')}>Sign In</button>
                )}
                {view !== 'signUp' && (
                    <button onClick={() => setView('signUp')}>Sign Up</button>
                )}
                {view !== 'resetPassword' && (
                    <button onClick={() => setView('resetPassword')}>Forgot Password?</button>
                )}
            </div>
        </main>
    );
}

export default SignInMainBody;
