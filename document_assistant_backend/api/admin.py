from django.contrib import admin

# Register your models here.
from .models import Document,Content

admin.site.register(Document)
admin.site.register(Content)