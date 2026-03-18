import json
import os

path = r'c:\Users\cshii\OneDrive\Desktop\production Apps\samato\backend\app\data\region_baselines.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

drought_prone_regions = ['Galgaduud', 'Mudug', 'Bakool', 'Lower Shabelle', 'Hiraan', 'Hiran']
urban_regions = ['Banadir']
town_regions = []

for item in data:
    region = item.get('region', '')
    district = item.get('district', '')
    
    # Drought Prone
    item['drought_prone_region'] = region in drought_prone_regions

    # Classifications
    if region in urban_regions or district.lower() in ['mogadishu', 'hargeysa', 'garowe', 'bossaso', 'kismayo', 'kismaayo']:
        item['district_type'] = 'urban'
        item['water_infrastructure_level'] = 'high'
        item['baseline_water_security'] = 'high'
    elif district.lower() in ['dhusamareb', 'dhuusamarreeb', 'baidoa', 'baydhaba', 'belet weyne', 'gaalkacyo']:
        item['district_type'] = 'town'
        item['water_infrastructure_level'] = 'medium'
        item['baseline_water_security'] = 'medium'
    else:
        item['district_type'] = 'pastoral'
        item['water_infrastructure_level'] = 'low'
        item['baseline_water_security'] = 'low'
        
    # As per user request example:
    if district.lower() == 'ceel buur':
        item['district_type'] = 'pastoral'
        item['pastoral_population_estimate'] = 3200
        item['livestock'] = 12000

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print('Updated region_baselines.json successfully.')
