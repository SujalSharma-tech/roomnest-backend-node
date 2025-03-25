const axios = require('axios');

const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = process.env.GEOCODING_API_KEY;

const getGeocode = async (address) => {
    try {
        const response = await axios.get(GEOCODING_API_URL, {
            params: {
                address: address,
                key: API_KEY
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching geocode data: ' + error.message);
    }
};

const getAddressFromCoordinates = async (lat, lng) => {
    try {
        const response = await axios.get(GEOCODING_API_URL, {
            params: {
                latlng: `${lat},${lng}`,
                key: API_KEY
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching address data: ' + error.message);
    }
};

module.exports = {
    getGeocode,
    getAddressFromCoordinates
};