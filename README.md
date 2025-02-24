# Personal Activity Dashboard

A minimalist, monochrome dashboard that displays my daily computer activity statistics and usage patterns. Built with React and Chart.js.

## Features

- Real-time activity tracking visualization
- Focus distribution radar chart
- Daily activity timeline
- Click and keypress statistics
- Weekly activity breakdown table
- Responsive design for mobile and desktop
- Monochrome aesthetic with ASCII art

## Tech Stack

- React
- Chart.js / react-chartjs-2
- CSS Modules
- JetBrains Mono font

## Local Development

1. Clone the repository:
bash
git clone https://github.com/yourusername/personal-activity-dashboard.git
cd personal-activity-dashboard

2. Install dependencies:
bash
npm install

3. Start the development server:
bash
npm start

The app will be available at `http://localhost:3000`

## Configuration

Create a `.env` file in the root directory with the following variables:
```
REACT_APP_UPDATE_INTERVAL=5000
REACT_APP_DATA_SOURCE=http://localhost:8080
```

## Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `build` directory.

## Data Collection

The dashboard requires a companion data collection service running locally. See the [activity-tracker](https://github.com/yourusername/activity-tracker) repository for setup instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Chart.js](https://www.chartjs.org/) for the visualization library
- [JetBrains](https://www.jetbrains.com/) for the JetBrains Mono font

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Go to Project Settings > Service Accounts
3. Click "Generate new private key" and save the file as `firebase-key.json` in the metrics_collector directory
4. Set up Firestore database in your Firebase project

## Netlify Setup

1. Add the following environment variables in your Netlify site settings:
   - FIREBASE_TYPE
   - FIREBASE_PROJECT_ID
   - FIREBASE_PRIVATE_KEY_ID
   - FIREBASE_PRIVATE_KEY
   - FIREBASE_CLIENT_EMAIL
   - FIREBASE_CLIENT_ID
   - FIREBASE_AUTH_URI
   - FIREBASE_TOKEN_URI
   - FIREBASE_AUTH_PROVIDER_CERT_URL
   - FIREBASE_CLIENT_CERT_URL

   (All these values can be found in your firebase-key.json file)

## Migrating Existing Data

Run the migration script to upload your existing data to Firebase:

```python metrics_collector/migrate_to_firebase.py
```
