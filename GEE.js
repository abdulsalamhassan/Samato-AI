// ================================
// 1. CHIRPS (RAINFALL)
// ================================
var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
    .filterDate('2024-01-01', '2024-12-31')
    .select('precipitation');

print("CHIRPS size:", chirps.size());

var rainfall = chirps.mean();


// ================================
// 2. DISTRICTS (ADM2)
// ================================
var districts = ee.FeatureCollection(
    "projects/unimind-488713/assets/som_admin2"
);


// ================================
// 3. POPULATION (HDX)
// ================================
var population = ee.FeatureCollection(
    "projects/unimind-488713/assets/som_pplp_adm2_v2"
);


// ================================
// 4. RAINFALL PER DISTRICT
// ================================
var rainfallByDistrict = rainfall.reduceRegions({
    collection: districts,
    reducer: ee.Reducer.mean().setOutputs(['rainfall_mm']),
    scale: 5000
});


// ================================
// 5. NDVI (VEGETATION)
// ================================
var ndviCollection = ee.ImageCollection('MODIS/061/MOD13Q1')
    .filterDate('2024-01-01', '2024-12-31')
    .select('NDVI');

print("NDVI size:", ndviCollection.size());

var ndvi = ndviCollection.mean().multiply(0.0001);


// ================================
// 6. ADD NDVI TO DISTRICTS
// ================================
var withNDVI = ndvi.reduceRegions({
    collection: rainfallByDistrict,
    reducer: ee.Reducer.mean().setOutputs(['ndvi']),
    scale: 500
});


// ================================
// 7. DROUGHT CLASSIFICATION
// ================================
var classified = withNDVI.map(function (f) {
    var rain = ee.Number(f.get('rainfall_mm'));
    var ndviVal = ee.Number(f.get('ndvi'));

    var status = ee.String(
        ee.Algorithms.If(
            rain.lt(1).and(ndviVal.lt(0.2)), 'critical',
            ee.Algorithms.If(
                rain.lt(3).and(ndviVal.lt(0.3)), 'warning',
                'normal'
            )
        )
    );

    return f.set('drought_status', status);
});


// ================================
// 8. NORMALIZATION
// ================================
var normalized = classified.map(function (f) {
    var rainNorm = f.getNumber('rainfall_mm').divide(10);
    var ndviNorm = f.getNumber('ndvi');

    return f.set({
        rain_norm: rainNorm,
        ndvi_norm: ndviNorm
    });
});


// ================================
// 9. DROUGHT SCORE
// ================================
var droughtData = normalized.map(function (f) {
    var rain = f.getNumber('rain_norm');
    var ndvi = f.getNumber('ndvi_norm');

    var droughtScore = ee.Number(1)
        .subtract(rain.multiply(0.5))
        .subtract(ndvi.multiply(0.5));

    return f.set('drought_score', droughtScore);
});


// ================================
// 10. JOIN POPULATION (USING PCODE)
// ================================
var joined = droughtData.map(function (f) {

    var match = population
        .filter(ee.Filter.eq('admin2Pcode', f.get('adm2_pcode')))
        .first();

    var pop = ee.Number(
        ee.Algorithms.If(match, match.get('T_TL'), 0)
    );

    return f.set('population', pop);
});


// ================================
// 11. IMPACT SCORE (FINAL)
// ================================
var withImpact = joined.map(function (f) {
    var drought = f.getNumber('drought_score');
    var pop = f.getNumber('population');

    var impact = drought.multiply(pop);

    return f.set('impact_score', impact);
});


// ================================
// 12. FINAL RANKING
// ================================
var finalRanked = withImpact.sort('impact_score', false);

print("Top priority districts:", finalRanked.limit(10));
print("Top district:", finalRanked.first());


// ================================
// 13. VISUALIZATION
// ================================
Map.centerObject(districts, 6);

Map.addLayer(rainfall, {
    min: 0,
    max: 20,
    palette: ['white', 'blue', 'darkblue']
}, "Rainfall");

Map.addLayer(districts.style({
    color: 'black',
    fillColor: '00000000',
    width: 1
}), {}, "Districts");


// ================================
// 14. EXPORT (FINAL DATASET)
// ================================
Export.table.toDrive({
    collection: finalRanked,
    description: 'somalia_drought_impact_2024',
    fileFormat: 'CSV'
});

// ================================
// WATER DATA
// ================================
var waterPoints = ee.FeatureCollection(
    "projects/unimind-488713/assets/water_source"
);

print("Water points count:", waterPoints.size());
Map.addLayer(waterPoints, {}, "Water Points");

// ------------------------------
// CLEAN DATA (IMPROVED)
// ------------------------------
var cleanWater = waterPoints.filter(
    ee.Filter.or(
        ee.Filter.eq('amenity', 'drinking_water'),
        ee.Filter.eq('man_made', 'water_well'),
        ee.Filter.eq('water', 'well')
    )
);

// COUNT WATER POINTS PER DISTRICT
var waterPerDistrict = joined.map(function (district) {

    var pointsInDistrict = cleanWater.filterBounds(district.geometry());

    var count = pointsInDistrict.size();

    return district.set('water_points', count);
});

// USE DIRECTLY (NO RE-MAPPING BUG)
var waterData = waterPerDistrict;

// SAFE WATER ACCESS
var waterAccess = waterData.map(function (f) {
    var water = f.getNumber('water_points');
    var pop = f.getNumber('population');

    var access = ee.Number(
        ee.Algorithms.If(
            pop.gt(0),
            water.divide(pop.sqrt()),  // 🔥 key change
            0
        )
    );

    return f.set('water_access', access);
});

// ------------------------------
// FINAL PRIORITY MODEL
// ------------------------------
var finalModel = waterAccess.map(function (f) {
    var drought = f.getNumber('drought_score');
    var pop = f.getNumber('population');
    var water = f.getNumber('water_access');

    // avoid division by zero
    var popFactor = ee.Number(
        ee.Algorithms.If(pop.gt(0), ee.Number(1).divide(pop.sqrt()), 0)
    );

    var priority = drought
        .multiply(popFactor)
        .multiply(ee.Number(1).subtract(water.multiply(2)));

    return f.set('final_priority', priority);
});

// ------------------------------
// RANK
// ------------------------------
var rankedFinal = finalModel.sort('final_priority', false);

print("Top priority (FINAL):", rankedFinal.limit(10));


//freeze the model
var finalModel = waterAccess.map(function (f) {
    var drought = f.getNumber('drought_score');
    var pop = f.getNumber('population');
    var water = f.getNumber('water_access');

    var priority = drought
        .multiply(pop)
        .multiply(ee.Number(1).subtract(water.multiply(2))); // weighted

    return f.set('final_priority', priority);
});

//export
Export.table.toDrive({
    collection: finalModel,
    description: 'somalia_nomad_priority',
    fileFormat: 'CSV'
});