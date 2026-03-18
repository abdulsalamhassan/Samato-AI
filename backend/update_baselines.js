const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'app', 'data', 'region_baselines.json');
let data;
try {
  data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
  console.error("Error reading file:", e);
  process.exit(1);
}

const drought_prone_regions = ['Galgaduud', 'Mudug', 'Bakool', 'Lower Shabelle', 'Hiraan', 'Hiran'];
const urban_regions = ['Banadir'];

for (const item of data) {
  const region = item.region || '';
  const district = item.district || '';
  
  item.drought_prone_region = drought_prone_regions.includes(region);

  const lowerDistrict = district.toLowerCase();
  
  if (urban_regions.includes(region) || ['mogadishu', 'hargeysa', 'garowe', 'bossaso', 'kismayo', 'kismaayo'].includes(lowerDistrict)) {
      item.district_type = 'urban';
      item.water_infrastructure_level = 'high';
      item.baseline_water_security = 'high';
  } else if (['dhusamareb', 'dhuusamarreeb', 'baidoa', 'baydhaba', 'belet weyne', 'gaalkacyo'].includes(lowerDistrict)) {
      item.district_type = 'town';
      item.water_infrastructure_level = 'medium';
      item.baseline_water_security = 'medium';
  } else {
      item.district_type = 'pastoral';
      item.water_infrastructure_level = 'low';
      item.baseline_water_security = 'low';
  }

  if (lowerDistrict === 'ceel buur') {
      item.district_type = 'pastoral';
      item.pastoral_population_estimate = 3200;
      item.livestock = 12000;
  }
}

try {
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated region_baselines.json in node');
} catch (e) {
  console.error("Error writing:", e);
  process.exit(1);
}
