import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UploadComponent = ({ setDocumentId }) => {
    const { token } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await axios.post('http://localhost:8000/api/upload/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,  // Include token here
                    'Content-Type': 'multipart/form-data'
                }
            });
            setDocumentId(response.data.id);
            setError('');
        } catch (err) {
            setError('Error uploading document. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2>Upload Document</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UploadComponent;
