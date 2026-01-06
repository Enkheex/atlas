from flask import Flask, jsonify, request
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c 

# NUM Building Data
NUM_BUILDINGS = [
    {
        "building": "Main Building",
        "building_code": "MB",
        "coords": [106.919000736241, 47.92269453067302],  # [longitude, latitude]
        "rooms": ["MB-101", "MB-102", "MB-201", "MB-202"]
    },
    {
        "building": "Law, Engineering and Applied Science Building",
        "building_code": "LEAB", 
        "coords": [106.9185, 47.9190],
        "rooms": ["EB-101", "EB-102", "EB-201"]
    },
    {
        "building": "Library",
        "building_code": "LIB",
        "coords": [106.9170, 47.9180],
        "rooms": ["LIB-Reading Room", "LIB-Study Hall"]
    }
]

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "NUM Atlas API is working!"})

@app.route('/api/open-classrooms', methods=['GET', 'POST'])
def get_buildings():
    user_lat = 0
    user_lng = 0

    if request.method == 'POST':
        user_location = request.get_json()
        if user_location:
            user_lat = user_location.get('lat', 0)
            user_lng = user_location.get('lng', 0)
    
    building_info_list = []
    
    for building in NUM_BUILDINGS:
        distance = 0
        if user_lat != 0 and user_lng != 0:
            # coords are [lng, lat], so we use [1] for lat, [0] for lng
            distance = haversine(user_lat, user_lng, building['coords'][1], building['coords'][0])
        
        building_info = {
            "building": building["building"],
            "building_code": building["building_code"],
            "building_status": "available",  # Simplified - always available
            "rooms": {room: {"slots": []} for room in building["rooms"]},  # Empty slots for now
            "coords": building["coords"],
            "distance": distance
        }
        building_info_list.append(building_info)
    
    # Sort by distance if user location provided
    if user_lat != 0 and user_lng != 0:
        building_info_list = sorted(building_info_list, key=lambda x: x['distance'])
    
    return jsonify(building_info_list)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)