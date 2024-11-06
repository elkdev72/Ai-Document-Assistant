import spacy
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Document
from .serializers import DocumentSerializer
nlp = spacy.load("en_core_web_sm")

class UploadDocumentView(APIView):
    def post(self, request):
        file = request.FILES['document']
        file_path = default_storage.save(file.name, file)
        document = Document.objects.create(user=request.user, status='uploaded')
        with open(file_path, 'r') as f:
            original_content = f.read()
            Content.objects.create(document=document, original_content=original_content, improved_content="")
        return Response({'id': document.id}, status=status.HTTP_201_CREATED)

class GetDocumentView(APIView):
    def get(self, request, id):
        try:
            document = Document.objects.get(id=id)
            content = Content.objects.get(document=document)
            return Response({
                'original_content': content.original_content,
                'improved_content': content.improved_content
            })
        except Document.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ImproveDocumentView(APIView):
    def post(self, request, id):
        try:
            document = Document.objects.get(id=id)
            content = Content.objects.get(document=document)
            improved_content = self.improve_text(content.original_content)
            content.improved_content = improved_content
            content.save()
            return Response({'improved_content': improved_content}, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def improve_text(self, text):
        doc = nlp(text)
        improved = " ".join([sent.text for sent in doc.sents])
        return improved




class UserRegistrationView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request
        password = request.data.get('password')
        user = User.objects.create_user(username=username, password=password)
        return Response({'id': user.id}, status=status.HTTP_201_CREATED)



class UserLoginView(ObtainAuthToken):
       def post(self, request):
           serializer = self.serializer_class(data=request.data)
           if serializer.is_valid():
               user = serializer.validated_data['user']
               token, created = Token.objects.get_or_create(user=user)
               return Response({'token': token.key})
           return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)