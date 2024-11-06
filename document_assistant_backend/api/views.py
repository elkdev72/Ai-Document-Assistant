import spacy
import language_tool_python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from .models import Document, Content
from rest_framework.permissions import IsAuthenticated
from docx import Document as DocxDocument  # For .docx files
import fitz  # PyMuPDF for .pdf files
# .......................................................
import spacy
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from .models import Document, Content
from .serializers import DocumentSerializer, ContentSerializer
from rest_framework.permissions import IsAuthenticated
import logging
import language_tool_python

logger = logging.getLogger(__name__)
nlp = spacy.load("en_core_web_sm")
tool = language_tool_python.LanguageTool('en-US')

def read_docx(file_path):
    """Extract text from a .docx file."""
    doc = DocxDocument(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)

def read_pdf(file_path):
    """Extract text from a .pdf file."""
    pdf_text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            pdf_text += page.get_text()
    return pdf_text



class UploadDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            file = request.FILES['document']
            file_path = default_storage.save(file.name, file)
            document = Document.objects.create(user=request.user, status='uploaded')
            with open(file_path, 'r') as f:
                original_content = f.read()
                Content.objects.create(document=document, original_content=original_content)
            return Response({'id': document.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error("Error uploading document", exc_info=True)
            return Response({'error': 'Failed to upload document'}, status=status.HTTP_400_BAD_REQUEST)

class GetDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            document = Document.objects.get(id=id, user=request.user)
            content = Content.objects.get(document=document)
            return Response({
                'original_content': content.original_content,
                'improved_content': content.improved_content
            })
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
        except Content.DoesNotExist:
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)
            
class ImproveDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def improve_text(self, text):
        # Run grammar and style checks
        matches = tool.check(text)

        suggestions = []
        for match in matches:
            suggestion = {
                "text": match.context,  # Part of the text where the issue is found
                "error": match.message,  # Description of the error
                "suggestions": match.replacements  # List of suggestions for correction
            }
            suggestions.append(suggestion)

        return suggestions

    def post(self, request, id):
        try:
            document = Document.objects.get(id=id, user=request.user)
            content = Content.objects.get(document=document)

            # Get suggestions from the improve_text function
            suggestions = self.improve_text(content.original_content)
            
            return Response({"suggestions": suggestions}, status=status.HTTP_200_OK)
        
        except Document.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class UserRegistrationView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        return Response({'id': user.id}, status=status.HTTP_201_CREATED)
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

class UserLoginView(ObtainAuthToken):
    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})



