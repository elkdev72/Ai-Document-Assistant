

# AI-Powered Document Assistant

This application is an AI-powered document assistant that allows users to upload documents, view suggestions for improvements, and export optimized documents. It uses NLP to analyze text and provide suggestions for grammar, style, and clarity.

---

## Table of Contents

1. [Installation and Setup](#installation-and-setup)
2. [API Documentation](#api-documentation)
3. [User Guide](#user-guide)
4. [Testing](#testing)
5. [Folder Structure](#folder-structure)

---

## Installation and Setup

### Backend (Django + Django REST Framework)

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd <project_folder>
   ```

2. **Set Up Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   .\venv\Scripts\activate  # Windows
   ```

3. **Install Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Download NLP Models**:
   Install the language model for spaCy or any other required NLP model:
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Set Up the Database**:
   Run migrations to create necessary database tables:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a Superuser**:
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the Backend Server**:
   ```bash
   python manage.py runserver
   ```

### Frontend (React)

1. **Navigate to Frontend Directory**:
   ```bash
   cd document-assistant-frontend
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Frontend Server**:
   ```bash
   npm start
   ```

---

## API Documentation

The backend provides RESTful API endpoints for user authentication, document management, and NLP-powered document improvement. Here’s a detailed guide to each endpoint.

### Authentication Endpoints

#### 1. Register
- **Endpoint**: `POST /api/register/`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "username": "newuser",
    "password": "newpassword"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 1
  }
  ```

#### 2. Login
- **Endpoint**: `POST /api/login/`
- **Description**: Logs in an existing user and returns an authentication token.
- **Request Body**:
  ```json
  {
    "username": "newuser",
    "password": "newpassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "your-authentication-token"
  }
  ```

### Document Management Endpoints

#### 3. Upload Document
- **Endpoint**: `POST /api/upload/`
- **Description**: Uploads a document for processing.
- **Headers**:
  ```
  Authorization: Token <your-authentication-token>
  ```
- **Request (Form-Data)**:
  - `document`: File upload (supported formats: `.txt`, `.docx`, `.pdf`)
- **Response**: `201 Created`
  ```json
  {
    "id": 1
  }
  ```

#### 4. Get Document
- **Endpoint**: `GET /api/documents/{id}/`
- **Description**: Retrieves the original and improved versions of the document.
- **Headers**:
  ```
  Authorization: Token <your-authentication-token>
  ```
- **Response**: `200 OK`
  ```json
  {
    "original_content": "Original document text.",
    "improved_content": "Improved document text with suggestions."
  }
  ```

#### 5. Improve Document
- **Endpoint**: `POST /api/documents/{id}/improve/`
- **Description**: Generates improvement suggestions for the document.
- **Headers**:
  ```
  Authorization: Token <your-authentication-token>
  ```
- **Response**: `200 OK`
  ```json
  {
    "suggestions": [
      {
        "text": "exmple",
        "error": "Possible spelling mistake found.",
        "suggestions": ["example"]
      }
    ]
  }
  ```

#### 6. Export Document
- **Endpoint**: `GET /api/documents/{id}/export/{format_type}/`
- **Description**: Exports the improved document in the specified format (`txt` or `docx`).
- **Headers**:
  ```
  Authorization: Token <your-authentication-token>
  ```
- **Response**: `200 OK` (file download)

---

## User Guide

The frontend application offers a straightforward interface for interacting with the backend.

### 1. Register and Login

- **Register**: New users can create an account by providing a username and password.
- **Login**: Existing users can log in to access the document features. Upon login, a token is stored in `localStorage` for authentication.

### 2. Upload Document

- Navigate to the upload section and select a document file (`.txt`, `.docx`, or `.pdf`).
- Click **Upload** to submit the document.

### 3. View and Improve Document

- After uploading, the original and improved versions of the document will appear side-by-side.
- **Generate Suggestions**: Click to fetch improvement suggestions, which will display in a list.

### 4. Accept or Reject Suggestions

- For each suggestion, you can choose to **Accept** or **Reject**. Accepting applies the suggestion directly to the improved document view.

### 5. Export Document

- Click **Export** to download the improved document in either `.txt` or `.docx` format.

### 6. Logout

- Use the **Logout** button to end the session, removing the authentication token from `localStorage`.

---

## Testing

### Backend Tests

1. **Unit Tests**:
   - Test individual functions, like `improve_text`, for accurate NLP suggestions.

2. **Integration Tests**:
   - Test the entire flow, such as uploading a document, improving it, and exporting it.
   - Use Django’s `TestCase` and `APIClient`.

**Sample Integration Test**:
```python
from rest_framework.test import APIClient
from django.test import TestCase
from django.contrib.auth.models import User

class DocumentUploadTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.login(username='testuser', password='password')

    def test_document_upload(self):
        with open('sample.txt', 'rb') as file:
            response = self.client.post('/api/upload/', {'document': file})
            self.assertEqual(response.status_code, 201)
```

### Frontend Tests

1. **Unit Tests with Jest**:
   - Test UI components like `AuthComponent` and `DocumentViewer` for expected rendering and functionality.

2. **Integration Tests**:
   - Test interactions such as logging in, uploading a document, and accepting suggestions.

**Sample Jest Test for AuthComponent**:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import AuthComponent from '../components/AuthComponent';
import { AuthContext } from '../context/AuthContext';

test('renders login form', () => {
  render(
    <AuthContext.Provider value={{ login: jest.fn() }}>
      <AuthComponent />
    </AuthContext.Provider>
  );

  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
});
```

---

## Folder Structure

```plaintext
project-root/
├── document_assistant_backend/
│   ├── api/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── models.py
│   │   └── tests.py
│   ├── document_assistant_backend/
│   └── manage.py
├── document-assistant-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthComponent.js
│   │   │   └── DocumentViewer.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
├── README.md
└── requirements.txt
```

