from rest_framework.pagination import PageNumberPagination

class PetListingPagination(PageNumberPagination):
    page_size = 10