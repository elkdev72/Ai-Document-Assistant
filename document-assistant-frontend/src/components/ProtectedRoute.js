import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Only import Navigate
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { token } = useContext(AuthContext);

    return token ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
