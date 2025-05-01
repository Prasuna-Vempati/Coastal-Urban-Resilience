// Create an information panel.
var infoPanel = ui.Panel({
  style: {width: '300px', position: 'bottom-left', padding: '10px'}
});
infoPanel.add(ui.Label({
  value: 'Climate Risk Assessment Info',
  style: {fontWeight: 'bold', fontSize: '16px'}
}));
Map.add(infoPanel);

// Load FAO/GAUL Level 2 boundaries for India using the public asset.
// Level 2 boundaries are more detailed (e.g., districts), which can serve as city names.
var admin = ee.FeatureCollection("FAO/GAUL/2015/level2")
              .filter(ee.Filter.eq('ADM0_NAME','India'));

// Print a sample feature to the Console to inspect its properties.
var firstFeature = admin.first();
print('First admin feature:', firstFeature);
print('Properties:', firstFeature.toDictionary());

// 1. Define the coastal zone using provided coordinates.
var coastalCoordinates = [
  [72.61040300143297,22.283809187948133],
  [72.42363542330797,21.85619547846138],
  [72.67632097018297,21.927554134132993],
  [72.44560807955797,21.73378342866882],
  [72.70927995455797,21.682747584951137],
  [72.57744401705797,21.181644779760745],
  [72.89604753268297,20.586303019229195],
  [72.62138932955797,19.86468585386498],
  [72.71582316233625,19.635127558788323],
  [72.96301554514875,19.007938848824526],
  [72.83667277171125,18.76886039990694],
  [72.91357706858625,18.29490432375741],
  [73.06189249827375,17.835336659284106],
  [73.23096118190902,17.311233267816387],
  [73.31335864284652,16.6597978811409],
  [73.42871508815902,16.13268736705283],
  [73.62097583034652,15.836964684545759],
  [73.75830493190902,15.567268364538535],
  [73.91760668972152,15.127596165455493],
  [74.1538077317461,14.726084761097917],
  [74.3625479661211,14.492200119577799],
  [74.5273428879961,14.029022775855175],
  [74.6426993333086,13.831753527863112],
  [74.7031241379961,13.37793713425515],
  [74.82744976531443,12.830534684480725],
  [75.05816265593943,12.396328051292425],
  [75.16499277113451,12.06580545760924],
  [75.47810312269701,11.764816614124618],
  [75.62641855238451,11.474265062921466],
  [75.78572031019701,11.118740648119743],
  [75.94502206800951,10.67642528958558],
  [76.14667935125198,10.230904388240946],
  [76.27851528875198,9.711528125181955],
  [76.46240625093277,9.136504822013883],
  [76.74805078218277,8.615478103475166],
  [77.13257226655777,8.240543685158988],
  [77.54455957124527,8.08829404755282],
  [77.89612207124527,8.34382264769789],
  [78.15979394624527,8.555730426750863],
  [78.16528711030777,8.865229033375085],
  [78.34656152437027,9.131081309332853],
  [78.71460351655777,9.20700295628383],
  [78.98376855562027,9.310013375711094],
  [78.91785058687027,9.467181178177709],
  [78.89587793062027,9.597196790707757],
  [79.14307031343277,9.90578282097973],
  [79.26941308687027,10.219484949927981],
  [79.51660546968277,10.338394984107182],
  [79.83520898530777,10.300564831035466],
  [79.85718164155777,10.597678178214895],
  [79.85168847749527,10.81897573663413],
  [79.86816796968277,11.298787393158323],
  [79.74182519624527,11.675605881330556],
  [79.82971582124527,11.901452488230579],
  [79.93957910249527,12.20765810533485],
  [80.13183984468277,12.502784519398805],
  [80.24170312593277,12.824356338273226],
  [80.32172888419278,13.277111934060416],
  [80.29426306388028,13.464161263804485],
  [80.06355017325528,13.5869999697343],
  [80.12946814200528,13.869819995295568],
  [80.17341345450528,13.949801170907067],
  [80.16242712638028,14.391858574230422],
  [80.15693396231778,14.721501557016628],
  [80.09650915763028,14.928603340519151],
  [80.12397497794278,15.35959598337508],
  [80.26679724356778,15.735338721326547],
  [80.51948279044278,15.835772672142582],
  [80.80512732169278,15.8727620875432],
  [80.90949743888028,15.735338721326547],
  [81.04133337638028,15.86747830065639],
  [81.11823767325528,16.02065171915247],
  [81.27753943106778,16.252828077214737],
  [81.57417029044278,16.35827243104092],
  [81.85981482169278,16.374084181949666],
  [82.24982947013028,16.590049160683737],
  [82.36518591544278,16.816288705366446],
  [82.32124060294278,17.005491297451194],
  [82.33222693106778,17.136769788958624],
  [82.63984411856778,17.32040383336672],
  [83.11774939200528,17.556235083717237],
  [83.43132166312458,17.88120452018067],
  [83.71696619437458,18.184157835289255],
  [84.04655603812458,18.30936461320603],
  [84.29374842093708,18.57512795933671],
  [84.78264002249958,19.172872648030495],
  [85.12321619437458,19.46834884167734],
  [85.52421717093708,19.721925175975255],
  [86.07353357718708,19.86147954243655],
  [86.52397303031208,20.176316253570146],
  [86.78764490531208,20.387571803844935],
  [86.73820642874958,20.475080926306664],
  [86.86454920218708,20.60882187352662],
  [87.02385095999958,20.742445527857228],
  [86.90300135062458,21.02984901549849],
  [86.85905603812458,21.229678599591082],
  [87.02385095999958,21.465027350678525],
  [87.41935877249958,21.577451500177798],
  [87.79838709281208,21.710203988828614],
  [72.52189783499958,22.255237156524533],
  [72.61040300143297,22.283809187948133]
];
var coastalZone = ee.Geometry.Polygon(coastalCoordinates);
Map.centerObject(coastalZone, 7);
Map.addLayer(coastalZone, {color: 'blue'}, 'Coastal Zone');

// 2. Define time period for climate data.
var startDate = '2022-01-01';
var endDate   = '2022-12-31';

// 3. Load Temperature Data (MODIS LST), convert to °C, compute anomaly, and clip.
var modisLST = ee.ImageCollection("MODIS/006/MOD11A1")
                 .filterDate(startDate, endDate)
                 .filterBounds(coastalZone)
                 .select('LST_Day_1km')
                 .mean()
                 .clip(coastalZone);
var lstCelsius = modisLST.multiply(0.02).subtract(273.15).rename('temp');
var baselineTemp = 25; 
var tempAnomaly = lstCelsius.subtract(baselineTemp).rename('tempAnom').clip(coastalZone);

// 4. Load Precipitation Data (CHIRPS Daily), sum over time, compute anomaly, and clip.
var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
                .filterDate(startDate, endDate)
                .filterBounds(coastalZone)
                .sum()
                .rename('precip')
                .clip(coastalZone);
var baselinePrecip = 800; 
var precipAnomaly = chirps.subtract(baselinePrecip).rename('precipAnom').clip(coastalZone);

// 5. Visualize the Climate Anomaly Maps.
Map.addLayer(tempAnomaly, {min: -5, max: 5, palette: ['blue', 'white', 'red']}, 'Temp Anomaly (°C)');
Map.addLayer(precipAnomaly, {min: -200, max: 200, palette: ['blue', 'white', 'red']}, 'Precip Anomaly (mm)');

// 6. Additional criteria: Elevation & Slope Risk.
var dem = ee.Image("USGS/SRTMGL1_003").clip(coastalZone);
var slope = ee.Terrain.slope(dem);
var elevRisk = dem.lt(10).multiply(1);   // 1 if elevation < 10 m.
var slopeRisk = slope.lt(5).multiply(1);    // 1 if slope < 5°.

// 7. Base risk from climate (adjusted thresholds for more unsafe zones):
//    - Base risk = 2 if (tempAnomaly > 0.5°C AND precipAnomaly < 50 mm)
//    - Base risk = 1 if (tempAnomaly > 0°C AND precipAnomaly < 200 mm)
//    - Else base risk = 0.
var baseRisk = tempAnomaly.expression(
  "(temp > 0.5 && precip < 50) ? 2 : ((temp > 0 && precip < 200) ? 1 : 0)",
  { 'temp': tempAnomaly, 'precip': precipAnomaly }
);

// 8. Combine risk factors.
var totalRisk = baseRisk.add(elevRisk).add(slopeRisk).rename('totalRisk');

// Reclassify total risk into risk classes:
//   - High Risk (2): total risk >= 3
//   - Medium Risk (1): total risk is 2
//   - Safe (0): total risk <= 1.
var riskClass = totalRisk.expression(
  "risk >= 3 ? 2 : (risk >= 2 ? 1 : 0)",
  {"risk": totalRisk}
).rename('riskClass').clip(coastalZone);
  
Map.addLayer(riskClass, {min: 0, max: 2, palette: ['green', 'yellow', 'red']}, 'Risk Map');

// Helper function to get the area name for a given point.
// It first finds an admin polygon that contains the point,
// or if none, finds the nearest polygon.
function getAreaName(point, callback) {
  var adminAtPoint = admin.filterBounds(point);
  var selectedAdmin = ee.Algorithms.If(
    adminAtPoint.size().gt(0),
    adminAtPoint.first(),
    // Else, sort by distance and take the nearest.
    admin.map(function(feat) {
      return feat.set('distance', point.distance(feat.geometry()));
    }).sort('distance').first()
  );
  selectedAdmin = ee.Feature(selectedAdmin);
  // Use ADM2_NAME property for more granular names.
  selectedAdmin.get('ADM2_NAME').evaluate(function(name) {
    callback(name);
  });
}

// 9. Interactive Risk Assessment via Map Click.
Map.onClick(function(coords) {
  var lon = parseFloat(coords.lon);
  var lat = parseFloat(coords.lat);
  var clickPoint = ee.Geometry.Point([lon, lat]);
  
  infoPanel.clear();
  infoPanel.add(ui.Label({
    value: 'Climate Risk Assessment Info',
    style: {fontWeight: 'bold', fontSize: '16px'}
  }));
  
  // Get area name for the clicked location.
  getAreaName(clickPoint, function(placeName) {
    infoPanel.add(ui.Label('Selected Place: ' + placeName));
  });
  
  // Extract anomaly and risk values.
  var tempValue = tempAnomaly.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: clickPoint,
    scale: 1000
  });
  var precipValue = precipAnomaly.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: clickPoint,
    scale: 1000
  });
  var riskValue = riskClass.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: clickPoint,
    scale: 1000
  });
  
  tempValue.evaluate(function(t){
    print("Temperature Anomaly (°C) at clicked point:", t.tempAnom);
  });
  precipValue.evaluate(function(p){
    print("Precipitation Anomaly (mm) at clicked point:", p.precipAnom);
  });
  
  riskValue.evaluate(function(r){
    var riskVal = r.riskClass;
    var riskLabel = riskVal === 2 ? "High Risk" :
                    riskVal === 1 ? "Medium Risk" : "Safe";
    print("Risk Assessment at clicked point:", riskLabel);
    infoPanel.add(ui.Label('Risk Level: ' + riskLabel));
    
    // If high risk, find the nearest safe zone.
    if (riskVal === 2) {
      var nearestSafeLabel = ui.Label('Nearest Safe Place: Computing...');
      infoPanel.add(nearestSafeLabel);
      
      var sampledPoints = riskClass.addBands(tempAnomaly).addBands(precipAnomaly)
                          .sample({
                            region: coastalZone,
                            scale: 1000,
                            numPixels: 300,
                            seed: 1,
                            geometries: true
                          });
      var safePoints = sampledPoints.filter(ee.Filter.eq('riskClass', 0));
      safePoints = safePoints.map(function(feature) {
        var d = clickPoint.distance(feature.geometry());
        return feature.set('distance', d);
      });
      var nearestSafe = ee.Feature(safePoints.sort('distance').first());
      print("Nearest Safe Zone:", nearestSafe);
      Map.addLayer(nearestSafe.geometry(), {color: 'green'}, 'Nearest Safe Zone');
      
      // Get area name for the nearest safe zone.
      getAreaName(nearestSafe.geometry(), function(safeName) {
        nearestSafeLabel.setValue("Nearest Safe Place: " + safeName);
      });
    }
  });
  
  Map.addLayer(clickPoint, {color: 'purple'}, 'Selected Point');
});
