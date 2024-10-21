// sign_in_main_body.js
import React, { useState } from 'react';
import SignUpForm from './sing_up_form';
import SignInForm from './sign_in_form';
import ResetPasswordForm from './reset_password';

function Sign_in_main_body() {
    const [view, setView] = useState('signIn'); // Manage which form to show: signIn, signUp, reset

    const handleSignUp = (formData) => {
        // Submit sign-up data to the backend
        console.log('Sign Up Data:', formData);
    };

    const handleSignIn = (formData) => {
        // Submit sign-in data to the backend
        console.log('Sign In Data:', formData);
    };

    const handleReset = (email) => {
        // Submit reset request to the backend
        console.log('Reset Password Email:', email);
    };

    return (
        <main className="container__right" id="main">
            {/* Show the appropriate form based on view state */}
            {view === 'signIn' && <SignInForm onSignIn={handleSignIn} />}
            {view === 'signUp' && <SignUpForm onSignUp={handleSignUp} />}
            {view === 'reset' && <ResetPasswordForm onReset={handleReset} />}

            <div className="toggle-links">
                {view !== 'signIn' && (
                    <button onClick={() => setView('signIn')}>Sign In</button>
                )}
                {view !== 'signUp' && (
                    <button onClick={() => setView('signUp')}>Sign Up</button>
                )}
                {view !== 'reset' && (
                    <button onClick={() => setView('reset')}>Forgot Password?</button>
                )}
            </div>
        </main>
    );
}

export default Sign_in_main_body;
