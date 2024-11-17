// src/components/AuthComponent.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthComponent.css';

const AuthComponent = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            if (isRegistering) {
                await axios.post('http://localhost:8000/api/register/', { username, password });
                alert('Registration successful! You can now log in.');
                setIsRegistering(false);
            } else {
                const response = await axios.post('http://localhost:8000/api/login/', { username, password });
                const { token } = response.data;
                login(token);  // Set token in context
                navigate('/'); // Redirect to homepage after login
            }
        } catch (err) {
            setError('Authentication failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="auth-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input"
                />
                <button type="submit" className="auth-button">
                    {isRegistering ? 'Register' : 'Login'}
                </button>
            </form>
            {error && <p className="auth-error">{error}</p>}
            <p className="toggle-text">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <span onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
                    {isRegistering ? 'Login here' : 'Register here'}
                </span>
            </p>
        </div>
    );
};

export default AuthComponent;
