import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { AuthContext } from '../context/AuthContext';
import './DocumentViewer.css'; // Import the CSS file for styling

const DocumentViewer = () => {
    const { token, logout } = useContext(AuthContext);
    const [documentId, setDocumentId] = useState(null);
    const [originalContent, setOriginalContent] = useState('');
    const [improvedContent, setImprovedContent] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('document', file);

            const response = await axios.post('http://localhost:8000/api/upload/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setDocumentId(response.data.id);
            fetchDocument(response.data.id);
        } catch (err) {
            setError('Error uploading document.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDocument = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/documents/${id}/`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            setOriginalContent(response.data.original_content);
            setImprovedContent(response.data.improved_content);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                logout();
            } else {
                setError('Error fetching document content.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImprove = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8000/api/documents/${documentId}/improve/`, {}, {
                headers: { 'Authorization': `Token ${token}` },
            });
            setSuggestions(response.data.suggestions);
        } catch (err) {
            setError('Error fetching improvement suggestions.');
        } finally {
            setLoading(false);
        }
    };

    const exportDocument = async (format) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/documents/${documentId}/export/${format}/`, {
                headers: { 'Authorization': `Token ${token}` },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `improved_document.${format}`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            const message = format === 'txt'
                ? 'Error exporting document as .txt'
                : 'Error exporting document as .docx';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const acceptSuggestion = (index) => {
        const newContent = originalContent.replace(suggestions[index].text, suggestions[index].suggestions[0]);
        setOriginalContent(newContent);
        setSuggestions(suggestions.filter((_, i) => i !== index));
    };

    const rejectSuggestion = (index) => {
        setSuggestions(suggestions.filter((_, i) => i !== index));
    };

    const highlightText = (text, suggestions) => {
        let highlightedText = text;
        suggestions.forEach(suggestion => {
            const regex = new RegExp(`(${suggestion.text})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
        });
        return DOMPurify.sanitize(highlightedText);
    };

    if (!token) {
        return <p>Please log in to view this document.</p>;
    }

    return (
        <div className="document-viewer">
            <h2 className="title">AI Document Assistant</h2>

            {/* Upload Section */}
            <div className="upload-section">
                <input type="file" onChange={handleFileChange} />
                <button className="upload-button" onClick={handleFileUpload}>Upload Document</button>
            </div>

            {/* Actions */}
            <div className="action-buttons">
                <button className="action-button" onClick={() => exportDocument('txt')} disabled={!documentId}>Export as .txt</button>
                <button className="action-button" onClick={() => exportDocument('docx')} disabled={!documentId}>Export as .docx</button>
                <button className="action-button" onClick={handleImprove} disabled={!documentId}>Generate Suggestions</button>
                <button className="action-button logout" onClick={logout}>Logout</button>
            </div>

            {error && <p className="error">{error}</p>}
            {loading && <p className="loading">Loading...</p>}
            
            <div className="content-section">
                <div className="document-content">
                    <h3>Original Document</h3>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: highlightText(originalContent, suggestions),
                        }}
                        className="text-content"
                    />
                </div>
                <div className="suggestions">
                    <h3>Suggestions</h3>
                    <ul>
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="suggestion-item">
                                <p><strong>Issue:</strong> {suggestion.error}</p>
                                <p><strong>Text:</strong> {suggestion.text}</p>
                                <p><strong>Suggestion:</strong> {suggestion.suggestions.join(", ")}</p>
                                <button className="suggestion-button" onClick={() => acceptSuggestion(index)}>Accept</button>
                                <button className="suggestion-button reject" onClick={() => rejectSuggestion(index)}>Reject</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;
