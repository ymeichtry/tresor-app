import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { postResetPasswordEmail } from '../../comunication/FetchUser';

/**
 * LoginUser
 * @author Peter Rutschmann
 */
function LoginUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginValues),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store user ID in localStorage or context for future use
            localStorage.setItem('userId', data.userId);
            
            // Navigate to home page on successful login
            navigate('/');
        } catch (error) {
            setError(error.message);
            console.error('Login error:', error);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetMessage('');
        setError('');

        if (!resetEmail) {
            setResetMessage('Please enter your email address.');
            return;
        }

        try {
            const message = await postResetPasswordEmail(resetEmail);
            setResetMessage(message);
            setResetEmail(''); // Clear email field on success
            setShowResetForm(false); // Hide form on success
        } catch (error) {
            setResetMessage(error.message);
            console.error('Password reset error:', error);
        }
    };

    return (
        <div>
            <h2>Login user</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            {!showResetForm ? (
                <form onSubmit={handleSubmit}>
                    <section>
                        <aside>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={loginValues.email}
                                    onChange={(e) =>
                                        setLoginValues(prevValues => ({...prevValues, email: e.target.value}))}
                                    required
                                    placeholder="Please enter your email *"
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    value={loginValues.password}
                                    onChange={(e) =>
                                        setLoginValues(prevValues => ({...prevValues, password: e.target.value}))}
                                    required
                                    placeholder="Please enter your password *"
                                />
                            </div>
                        </aside>
                    </section>
                    <button type="submit">Login</button>
                    <p><button type="button" onClick={() => setShowResetForm(true)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>Forgot password?</button></p>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <h3>Reset Password</h3>
                    {resetMessage && <div style={{ color: resetMessage.includes('successful') ? 'green' : 'red', marginBottom: '10px' }}>{resetMessage}</div>}
                    <div>
                        <label>Enter your email:</label>
                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            placeholder="Enter email for reset *"
                        />
                    </div>
                    <button type="submit">Reset Password</button>
                    <p><button type="button" onClick={() => setShowResetForm(false)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>Back to Login</button></p>
                </form>
            )}
        </div>
    );
}

export default LoginUser;