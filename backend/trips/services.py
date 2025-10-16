import requests
from datetime import datetime, timedelta
import math

class RouteCalculator:
    def __init__(self):
        self.api_key = "your_openroute_service_api_key"  # openrouteservice.org
    
    def calculate_route(self, current_loc, pickup_loc, dropoff_loc):
        try:
            
            leg1 = self._get_route_leg(current_loc, pickup_loc, "Drive to pickup location")
            
            
            leg2 = self._get_route_leg(pickup_loc, dropoff_loc, "Drive to dropoff location")
            
            total_distance = leg1['distance'] + leg2['distance']
            total_duration = leg1['duration'] + leg2['duration']
            
            return {
                'legs': [leg1, leg2],
                'total_distance': total_distance,
                'total_duration': total_duration
            }
        except Exception as e:
            # Fallback to estimated calculations
            return self._get_estimated_route(current_loc, pickup_loc, dropoff_loc)
    
    def _get_route_leg(self, start, end, instruction):
        #  OpenRouteService API
        url = "https://api.openrouteservice.org/v2/directions/driving-car"
        headers = {
            'Authorization': self.api_key,
            'Content-Type': 'application/json'
        }
        body = {
            "coordinates": [
                [self._geocode_location(start)[1], self._geocode_location(start)[0]],
                [self._geocode_location(end)[1], self._geocode_location(end)[0]]
            ]
        }
        
        try:
            response = requests.post(url, json=body, headers=headers)
            data = response.json()
            
            distance = data['features'][0]['properties']['segments'][0]['distance'] / 1000  # km
            duration = data['features'][0]['properties']['segments'][0]['duration'] / 3600  # hours
            
            return {
                'start': start,
                'end': end,
                'distance': distance,
                'duration': duration,
                'instructions': instruction
            }
        except:
            return {
                'start': start,
                'end': end,
                'distance': 100,  
                'duration': 1.5,  
                'instructions': instruction
            }
    
    def _geocode_location(self, location):
        return (0, 0)  # lat, lng
    
    def _get_estimated_route(self, current_loc, pickup_loc, dropoff_loc):
        return {
            'legs': [
                {
                    'start': current_loc,
                    'end': pickup_loc,
                    'distance': 50,
                    'duration': 1,
                    'instructions': 'Drive to pickup location - Estimated'
                },
                {
                    'start': pickup_loc,
                    'end': dropoff_loc,
                    'distance': 300,
                    'duration': 5,
                    'instructions': 'Drive to dropoff location - Estimated'
                }
            ],
            'total_distance': 350,
            'total_duration': 6
        }

class ELDCalculator:
    def calculate_eld_logs(self, current_cycle_used, total_distance, total_duration):
        MAX_CYCLE_HOURS = 70
        MAX_DAILY_DRIVING = 11
        MIN_REST_BREAK = 0.5  # 30 minutes after 8 hours
        DAILY_REST = 10  # hours
        
        rest_stops = []
        daily_logs = []
        
        remaining_hours = MAX_CYCLE_HOURS - current_cycle_used
        driving_hours_needed = total_duration + 2  # +2 hours for pickup/dropoff
        
        current_day = datetime.now()
        daily_driving = 0
        total_driven = 0
        
        if driving_hours_needed > remaining_hours:
        
            rest_hours_needed = driving_hours_needed - remaining_hours
            rest_stops.append({
                'location': 'Intermediate Rest Stop',
                'duration': DAILY_REST,
                'reason': 'Cycle hours limit reached'
            })
        
        
        fuel_stops = math.ceil(total_distance / 1000) - 1
        for i in range(fuel_stops):
            rest_stops.append({
                'location': f'Fuel Stop {i+1}',
                'duration': 0.5,  # 30 minutes for fueling
                'reason': 'Fueling required'
            })
        
        day_count = math.ceil((total_duration + 2) / 11) 
        
        for day in range(day_count):
            date = current_day + timedelta(days=day)
            driving_hours = min(MAX_DAILY_DRIVING, driving_hours_needed - total_driven)
            total_driven += driving_hours
            
            daily_logs.append({
                'date': date.strftime('%Y-%m-%d'),
                'driving_hours': driving_hours,
                'on_duty_hours': driving_hours + 2,  # +2 for pickup/dropoff
                'off_duty_hours': 24 - (driving_hours + 2),
                'total_cycle_hours': current_cycle_used + total_driven
            })
        
        return {
            'rest_stops': rest_stops,
            'daily_logs': daily_logs
        }