/* eslint-env browser */
/* global L, d3 */

/**
 * Earthquake Visualization Application
 * Uses Leaflet.js for mapping and D3.js for data visualization
 */

// Initialize the map centered on the world
const map = L.map('map').setView([20, 0], 2);

// Set world bounds to prevent excessive panning
const bounds = [
  [-90, -180], // Southwest coordinates
  [90, 180]    // Northeast coordinates
];

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  noWrap: true // Prevent the map from repeating
}).addTo(map);

// Set max bounds to prevent panning outside the world view
map.setMaxBounds(bounds);

// Store earthquake data globally for reference
let earthquakeData = [];
let lastUpdated = '';
let markers = [];

/**
 * Get color based on earthquake magnitude
 * @param {number} magnitude - Earthquake magnitude
 * @returns {string} Color hex code
 */
function getColor(magnitude) {
  if (magnitude >= 6) {
    return '#FF0000';
  } // Red for severe (6+)
  if (magnitude >= 5) {
    return '#FF8000';
  } // Orange for strong (5-6)
  if (magnitude >= 4) {
    return '#FFFF00';
  } // Yellow for moderate (4-5)
  if (magnitude >= 3) {
    return '#90EE90';
  } // Light Green for light (3-4)
  return '#00FF00'; // Green for minor (<3)
}

/**
 * Get radius based on magnitude (exponential scaling)
 * @param {number} magnitude - Earthquake magnitude
 * @returns {number} Radius in meters
 */
function getRadius(magnitude) {
  return Math.pow(2, magnitude) * 1000; // Radius scaled by magnitude (exponential)
}

/**
 * Fetch real-time earthquake data from USGS API
 * @returns {Promise<void>}
 */
async function fetchEarthquakeData() {
  const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=100&orderby=time';

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    // Log the entire earthquake data to the console
    console.log('Fetched earthquake data:', data);

    earthquakeData = data.features; // Store data globally
    
    // Format last updated date correctly
    if (data.metadata && data.metadata.generated) {
      lastUpdated = new Date(data.metadata.generated).toLocaleString('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short'
      });
    }
    
    updateMap(data); // Update map with fetched data
    updateD3Chart(data); // Update D3 chart with fetched data
    updateLastUpdated(); // Update last updated display
    updateTotalCount(data.features.length); // Update total count
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    document.getElementById('last-updated').innerText = 'Error loading data';
  }
}

/**
 * Update last updated time display
 */
function updateLastUpdated() {
  document.getElementById('last-updated').innerText = lastUpdated || 'N/A';
}

/**
 * Update total earthquake count display
 * @param {number} count - Total number of earthquakes
 */
function updateTotalCount(count) {
  document.getElementById('total-earthquakes').innerText = count;
}

/**
 * Update map with earthquake markers
 * @param {Object} data - GeoJSON earthquake data
 */
function updateMap(data) {
  // Clear previous markers
  markers.forEach((marker) => {
    map.removeLayer(marker);
  });
  markers = [];

  // Add new markers for earthquakes
  data.features.forEach((feature) => {
    const coords = feature.geometry.coordinates;
    const magnitude = feature.properties.mag;
    const place = feature.properties.place || 'Unknown location';
    const time = feature.properties.time;

    // Create circle for each earthquake
    const circle = L.circle([coords[1], coords[0]], {
      color: getColor(magnitude),
      fillColor: getColor(magnitude),
      fillOpacity: 0.5,
      radius: getRadius(magnitude),
      weight: 1
    }).addTo(map);

    // Add a popup with earthquake details
    circle.bindPopup(`
      <b>Location:</b> ${place}<br/>
      <b>Magnitude:</b> ${magnitude.toFixed(1)}<br/>
      <b>Depth:</b> ${coords[2].toFixed(1)} km<br/>
      <b>Time:</b> ${new Date(time).toLocaleString()}
    `);

    // Store magnitude for interactivity
    circle.magnitude = magnitude;
    circle.originalStyle = {
      weight: 1,
      color: getColor(magnitude)
    };
    
    markers.push(circle);
  });
}

/**
 * Update D3 Chart for Earthquake Magnitudes
 * @param {Object} data - GeoJSON earthquake data
 */
function updateD3Chart(data) {
  // Prepare data for D3 chart
  const magnitudeCounts = {};

  // Group data into ranges
  data.features.forEach((feature) => {
    const magnitude = feature.properties.mag;
    const range = Math.floor(magnitude);
    magnitudeCounts[range] = (magnitudeCounts[range] || 0) + 1;
  });

  const chartData = Object.keys(magnitudeCounts)
    .map((range) => ({
      magnitude: parseFloat(range),
      count: magnitudeCounts[range]
    }))
    .sort((a, b) => a.magnitude - b.magnitude);

  // Set up the chart dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 300 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Remove existing chart if present
  d3.select('#chart').select('svg').remove();

  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Set up scales
  const x = d3.scaleBand()
    .domain(chartData.map((d) => d.magnitude))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(chartData, (d) => d.count)])
    .range([height, 0]);

  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('.1f')))
    .append('text')
    .attr('x', width / 2)
    .attr('y', 35)
    .attr('fill', '#000')
    .attr('text-anchor', 'middle')
    .text('Magnitude');

  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -35)
    .attr('x', -height / 2)
    .attr('fill', '#000')
    .attr('text-anchor', 'middle')
    .text('Count');

  // Add bars to the chart
  svg.selectAll('.bar')
    .data(chartData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d.magnitude))
    .attr('width', x.bandwidth())
    .attr('y', (d) => y(d.count))
    .attr('height', (d) => height - y(d.count))
    .attr('fill', (d) => getColor(d.magnitude))
    .on('mouseover', function(event, d) {
      // Highlight the hovered bar
      d3.select(this).attr('fill', '#FF6347');
      highlightMarkers(d.magnitude);
    })
    .on('mouseout', function(event, d) {
      // Reset color of the bar when not hovering
      d3.select(this).attr('fill', getColor(d.magnitude));
      resetMarkers();
    })
    .on('click', function(event, d) {
      // Show information in an alert
      alert(`Magnitude Range: ${d.magnitude}-${d.magnitude + 1}\nCount: ${d.count}\nLast Updated: ${lastUpdated}`);
    });

  // Add chart title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text('Magnitude Distribution');
}

/**
 * Highlight markers based on magnitude range
 * @param {number} magnitude - Lower bound of magnitude range
 */
function highlightMarkers(magnitude) {
  const lowerBound = magnitude;
  const upperBound = magnitude + 1;

  markers.forEach((marker) => {
    const layerMagnitude = marker.magnitude;
    if (layerMagnitude >= lowerBound && layerMagnitude < upperBound) {
      marker.setStyle({ weight: 5, color: '#0000FF' });
    }
  });
}

/**
 * Reset marker styles to original
 */
function resetMarkers() {
  markers.forEach((marker) => {
    if (marker.originalStyle) {
      marker.setStyle(marker.originalStyle);
    }
  });
}

/**
 * Initialize the application
 */
function init() {
  // Fetch data initially
  fetchEarthquakeData();

  // Set up refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn.addEventListener('click', () => {
    console.log('Refreshing earthquake data...');
    fetchEarthquakeData();
  });

  // Optionally, set an interval to refresh data every 5 minutes
  setInterval(fetchEarthquakeData, 300000); // Refresh every 5 minutes
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}