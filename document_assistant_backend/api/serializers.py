from rest_framework import serializers
from .models import Document, Content

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'