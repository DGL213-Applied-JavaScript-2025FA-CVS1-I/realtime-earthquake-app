# Real-Time Earthquake Visualization

An interactive web application that visualizes real-time earthquake data from the USGS (United States Geological Survey) using Leaflet.js for interactive maps and D3.js for data visualization charts.

## Features

- **Real-time Data**: Fetches the latest 100 earthquakes from USGS API
- **Interactive Map**: Click on earthquake markers to see detailed information
- **Color-coded Severity**: Visual representation based on magnitude (green to red)
- **Dynamic Chart**: D3.js bar chart showing magnitude distribution
- **Interactive Highlighting**: Hover over chart bars to highlight corresponding earthquakes on the map
- **Auto-refresh**: Automatically updates data every 5 minutes
- **Manual Refresh**: Button to manually fetch the latest data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the project files**

2. **Navigate to the project directory**
   ```bash
   cd earthquake-visualization
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Using http-server (Recommended)

```bash
npm start
```

This will start a local server at `http://localhost:8080` and automatically open it in your browser.


#### Option 2: Using VS Code Live Server

If you're using VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 4: Direct file opening

Simply open the `index.html` file directly in your browser. Note: Some features may not work due to CORS restrictions.

## 🧪 ESLint Integration

This project includes ESLint configuration for code quality and consistency.

### Running ESLint

**Check for linting errors:**
```bash
npm run lint
```

**Automatically fix linting errors:**
```bash
npm run lint:fix
```

### ESLint Configuration

The project uses `.eslintrc.json` with the following rules:
- ES2021 syntax support
- Browser environment
- Single quotes for strings
- 2-space indentation
- Semicolons required
- No unused variables (warning)
- Enforced use of `const` and `let` over `var`

## Project Structure

```
earthquake-visualization/
│
├── index.html          # Main HTML file
├── app.js              # JavaScript application logic
├── style.css           # CSS styling
├── package.json        # Node.js dependencies and scripts
├── .eslintrc.json      # ESLint configuration
```

## Color-Coding System

The application uses a color-coded system to represent earthquake severity:

| Magnitude | Color | Description |
|-----------|-------|-------------|
| < 3       | 🟢 Green | Minor earthquakes |
| 3 - 4     | 🟢 Light Green | Light earthquakes |
| 4 - 5     | 🟡 Yellow | Moderate earthquakes |
| 5 - 6     | 🟠 Orange | Strong earthquakes |
| 6+        | 🔴 Red | Severe earthquakes |

## 🔧 Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Application logic and async data fetching
- **Leaflet.js (v1.9.4)**: Interactive mapping library
- **D3.js (v7)**: Data visualization and charting
- **USGS Earthquake API**: Real-time earthquake data source
- **ESLint**: Code quality and linting

## 📊 API Information

**Data Source**: [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)

**API Endpoint**: 
```
https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=100&orderby=time
```

**Parameters**:
- `format=geojson`: Returns data in GeoJSON format
- `limit=100`: Fetches the 100 most recent earthquakes
- `orderby=time`: Sorts results by time (most recent first)

## Interactive Features

### Map Interactions
- **Pan**: Click and drag to move around the map
- **Zoom**: Use scroll wheel or zoom controls
- **Click Markers**: View detailed earthquake information
- **Marker Size**: Proportional to earthquake magnitude

### Chart Interactions
- **Hover**: Highlights corresponding earthquakes on the map
- **Click**: Shows magnitude range details and count
- **Visual Feedback**: Color changes on hover

## Data Refresh

The application refreshes earthquake data:
- **Automatically**: Every 5 minutes
- **Manually**: Click the "🔄 Refresh Data" button
- **Last Updated**: Displayed in the info bar

## 🌐 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer (not supported)

## Mobile Support

The application is fully responsive and works on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktop computers

## Troubleshooting

### Problem: Earthquakes not loading

**Solution**: 
- Check your internet connection
- Verify the USGS API is accessible
- Check browser console for errors
- Try manual refresh

### Problem: Map tiles not loading

**Solution**:
- Ensure you have an active internet connection
- Check if OpenStreetMap is accessible in your region
- Try refreshing the page

### Problem: ESLint errors

**Solution**:
```bash
npm run lint:fix
```

## Future Enhancements

Potential improvements for the application:

- [ ] Filter earthquakes by magnitude range
- [ ] Time-based filtering (last 24 hours, last week, etc.)
- [ ] Heatmap visualization option
- [ ] Search for earthquakes by location
- [ ] Export data to CSV/JSON
- [ ] Multiple chart types (pie chart, line chart)
- [ ] Clustering for dense earthquake areas
- [ ] Historical data comparison
- [ ] Email/SMS alerts for major earthquakes
- [ ] Multi-language support

## Acknowledgments

- **USGS**: For providing free, real-time earthquake data
- **Leaflet.js**: For the excellent mapping library
- **D3.js**: For powerful data visualization capabilities
- **OpenStreetMap**: For map tiles and data

---

**Happy Earthquake Tracking! 🌍📊**
