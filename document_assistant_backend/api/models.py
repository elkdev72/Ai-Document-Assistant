from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=100, default="uploaded")

class Content(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    original_content = models.TextField()
    improved_content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=datetime.now)
