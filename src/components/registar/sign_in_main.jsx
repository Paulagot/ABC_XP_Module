// sign_in_main_body.js
import React, { useState, useEffect } from 'react';
import SignUpForm from './sing_up_form';
import SignInForm from './sign_in_form';
import ResetPasswordForm from './reset_password';
import SetPasswordForm from './set_password';
import { useLocation } from 'react-router-dom';


function SignInMainBody() {
    const [view, setView] = useState('signIn');
    const [resetToken, setResetToken] = useState(null);
    const [message, setMessage] = useState(''); // Add a message state for confirmation messages
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlView = params.get('view');
        const urlToken = params.get('token');

        if (urlView) setView(urlView);
        if (urlView === 'setPassword' && urlToken) setResetToken(urlToken);

    }, [location]);

    const handleSignUp = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setView('signIn'); // Redirect to sign-in on successful sign-up
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Sign-up error:', error);
        }
    };

    const handleSignIn = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                // Redirect to /bites on successful login
            window.location.href = 'http://localhost:5173/bites';
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Sign-in error:', error);
        }
    };

    const handleResetPasswordRequest = async (email, captchaToken) => {
        try {
            const response = await fetch('http://localhost:3000/api/password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, captchaToken }),
            });
    
            if (response.ok) {
                console.log('Password reset email sent successfully.');
                return true;
            } else {
                const data = await response.json();
                console.error(data.error || 'Error sending reset email.');
                return false;
            }
        } catch (error) {
            console.error('Reset password request error:', error);
            return false;
        }
    };
    

    const handleSetNewPassword = async (password, token) => {
        try {
            const response = await fetch(`http://localhost:3000/api/password-reset/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (response.ok) {
                console.log('Password reset successful.');
                setView('signIn'); // Redirect to sign-in after resetting the password
            } else {
                const data = await response.json();
                console.error(data.error || 'Error resetting password.');
            }
        } catch (error) {
            console.error('Set new password error:', error);
        }
    };

    return (
        <main className="container__right" id="main">
            {/* Render message if it exists */}
            {message && <p className="confirmation-message">{message}</p>}

            {/* Render form based on current view */}
            {view === 'signIn' && <SignInForm onSignIn={handleSignIn} />}
            {view === 'signUp' && <SignUpForm onSignUp={handleSignUp} />}
            {view === 'resetPassword' && <ResetPasswordForm onReset={handleResetPasswordRequest} />}
            {view === 'setPassword' && <SetPasswordForm onSetPassword={handleSetNewPassword} token={resetToken} />}

            {/* Navigation buttons to switch views */}
            <div className="toggle-links">
                {view !== 'signIn' && <button onClick={() => setView('signIn')}>Sign In</button>}
                {view !== 'signUp' && <button onClick={() => setView('signUp')}>Sign Up</button>}
                {view !== 'resetPassword' && <button onClick={() => setView('resetPassword')}>Forgot Password?</button>}
            </div>
        </main>
    );
}

export default SignInMainBody;