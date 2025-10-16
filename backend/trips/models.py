from django.db import models

class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField(help_text="Hours used in current cycle")
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Calculated fields
    total_distance = models.FloatField(null=True, blank=True)
    estimated_duration = models.FloatField(null=True, blank=True)
    
    def __str__(self):
        return f"Trip from {self.current_location} to {self.dropoff_location}"

class TripLeg(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='legs')
    sequence = models.IntegerField()
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    distance = models.FloatField()
    duration = models.FloatField()
    instructions = models.TextField()
    
    class Meta:
        ordering = ['sequence']

class RestStop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='rest_stops')
    location = models.CharField(max_length=255)
    duration_hours = models.FloatField(default=10)
    sequence = models.IntegerField()

class DailyLog(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField()
    driving_hours = models.FloatField()
    on_duty_hours = models.FloatField()
    off_duty_hours = models.FloatField()
    total_cycle_hours = models.FloatField()