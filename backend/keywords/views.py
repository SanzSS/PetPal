from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_list_or_404, get_object_or_404
from django.views import View

from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from applications.models import Application
from petlistings.models import PetListing

from .models import Keyword
from .serializers import KeywordSerializer

# Create your views here.
class KeywordView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = KeywordSerializer

    def get_queryset(self):
        petlisting_id = self.kwargs['petlisting_id']
        test = get_list_or_404(Keyword, petlisting=petlisting_id)
        keyword_queryset = Keyword.objects.filter(petlisting=petlisting_id)

        return keyword_queryset

    def perform_create(self, serializer):
        petlisting_id = self.kwargs['petlisting_id']
        petlisting = get_object_or_404(PetListing, id=petlisting_id)

        keyword = self.request.data.get('keyword')
        weight = self.request.data.get('weight')

        try:
            curr_keyword = Keyword.objects.get(petlisting=petlisting_id, keyword=keyword)
            curr_keyword.weight = weight
        except Keyword.DoesNotExist:
            # keyword doesnt alr exist
            Keyword.objects.create(keyword=keyword, weight=weight, petlisting=petlisting)

    
# note the retrieve one is just bonus LOL
class EditKeywordView(RetrieveUpdateDestroyAPIView):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer
    
    # *copied from Victor's ManageListing view.. !
    def patch(self, request, pk):   
        keyword = get_object_or_404(Keyword, id=pk)
        
        serializer = self.serializer_class(keyword, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        keyword = serializer.save()
        return super().patch(request)
            
        
    def destroy(self, request, pk):
        keyword = get_object_or_404(Keyword, id=pk)
        return super().destroy(request)

class Score(View):
    def get(self, request, application_id):
        score = 0
        application = get_object_or_404(Application, id=application_id)

        # for keyword in the listings' keywords
        for keyword in application.pet.keywords.all():
            for answer in application.answers.all():
                if keyword.keyword in answer.answer:
                    score = score + keyword.weight
                    print(answer.answer)
                    break
        return JsonResponse({"score": score})        