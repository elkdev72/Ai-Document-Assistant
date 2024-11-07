from django.urls import path
from .views import UploadDocumentView, GetDocumentView, ImproveDocumentView, UserRegistrationView, UserLoginView,ExportDocumentView

urlpatterns = [
    path('upload/', UploadDocumentView.as_view(), name='upload_document'),
    path('documents/<int:id>/', GetDocumentView.as_view(), name='get_document'),
    path('documents/<int:id>/improve/', ImproveDocumentView.as_view(), name='improve_document'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('documents/<int:id>/export/<str:format_type>/', ExportDocumentView.as_view(), name='export_document'),

]
