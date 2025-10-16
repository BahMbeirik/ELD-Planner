from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Trip, TripLeg, RestStop, DailyLog
from .serializers import TripSerializer
from .services import RouteCalculator, ELDCalculator
import requests
import json

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            trip = serializer.save()
            
            # Calculate route and ELD data
            route_calculator = RouteCalculator()
            eld_calculator = ELDCalculator()
            
            # Get route information
            route_data = route_calculator.calculate_route(
                trip.current_location,
                trip.pickup_location,
                trip.dropoff_location
            )
            
            # Calculate ELD logs
            eld_data = eld_calculator.calculate_eld_logs(
                trip.current_cycle_used,
                route_data['total_distance'],
                route_data['total_duration']
            )
            
            # Create trip legs
            for i, leg in enumerate(route_data['legs']):
                TripLeg.objects.create(
                    trip=trip,
                    sequence=i,
                    start_location=leg['start'],
                    end_location=leg['end'],
                    distance=leg['distance'],
                    duration=leg['duration'],
                    instructions=leg['instructions']
                )
            
            # Create rest stops
            for i, stop in enumerate(eld_data['rest_stops']):
                RestStop.objects.create(
                    trip=trip,
                    location=stop['location'],
                    duration_hours=stop['duration'],
                    sequence=i
                )
            
            # Create daily logs
            for i, log in enumerate(eld_data['daily_logs']):
                DailyLog.objects.create(
                    trip=trip,
                    date=log['date'],
                    driving_hours=log['driving_hours'],
                    on_duty_hours=log['on_duty_hours'],
                    off_duty_hours=log['off_duty_hours'],
                    total_cycle_hours=log['total_cycle_hours']
                )
            
            trip.total_distance = route_data['total_distance']
            trip.estimated_duration = route_data['total_duration']
            trip.save()
            
            return Response(TripSerializer(trip).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)