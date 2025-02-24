const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      "type": process.env.FIREBASE_TYPE,
      "project_id": process.env.FIREBASE_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_CLIENT_ID,
      "auth_uri": process.env.FIREBASE_AUTH_URI,
      "token_uri": process.env.FIREBASE_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
    })
  });
}

exports.handler = async function(event, context) {
  try {
    const db = admin.firestore();
    const metricsDoc = await db.collection('metrics').doc('current').get();
    
    if (!metricsDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No metrics data found' })
      };
    }
    
    // Get the main metrics data
    const metricsData = metricsDoc.data();
    
    // Get the hourly data from subcollection
    const hourlySnapshot = await db.collection('metrics')
      .doc('current')
      .collection('hourly_data')
      .orderBy('timestamp')
      .limit(100)  // Limit to recent entries
      .get();
    
    // Convert to array
    const hourlyData = [];
    hourlySnapshot.forEach(doc => {
      hourlyData.push(doc.data());
    });
    
    // Combine the data
    metricsData.hourly_data = hourlyData;
    
    return {
      statusCode: 200,
      body: JSON.stringify(metricsData)
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch metrics', details: error.message })
    };
  }
}; 