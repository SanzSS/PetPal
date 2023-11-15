from rest_framework.pagination import PageNumberPagination

class ApplicationPagination(PageNumberPagination):
    page_size = 5