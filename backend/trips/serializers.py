from rest_framework import serializers
from .models import Trip, TripLeg, RestStop, DailyLog

class TripLegSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripLeg
        fields = '__all__'

class RestStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestStop
        fields = '__all__'

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    legs = TripLegSerializer(many=True, read_only=True)
    rest_stops = RestStopSerializer(many=True, read_only=True)
    daily_logs = DailyLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'