// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentViewer from './components/DocumentViewer';
import AuthComponent from './components/AuthComponent';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<AuthComponent />} />
            <Route path="/" element={<ProtectedRoute component={DocumentViewer} />} />
        </Routes>
    );
};

export default App;
