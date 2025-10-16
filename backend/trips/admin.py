from django.contrib import admin

# Register your models here.
from .models import Trip, TripLeg, RestStop, DailyLog

admin.site.register(Trip)
admin.site.register(TripLeg)
admin.site.register(RestStop)
admin.site.register(DailyLog)

