const axios = require('axios');


const calculateDistanceAndEta = async (origin, destination) => {
    const apiKey = process.env.ORS_API_KEY;
    const url = 'https://openrouteservice.org/v2/matrix'
    try {
        const response = axios.post(url, {
            locations: [
                [origin.lng,origin.lat],
                [destination.lng,destination.lat]
            ],
            matrics: ['distance','duration'],
            units:'km'
        }, {
            headers: {
                'Authorization':apiKey,
                'content-type':'application/json'
            }
        })
        const distanceKm =(await response).data.distances[0][1]; //km
        const durationSec =(await response).data.duration[0][1]; //sec
        return {
            distance:`${distanceKm.toFixed(2)} km`,
            duration:`${Math.round(durationSec / 60)} min`,

        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = calculateDistanceAndEta  

exports.getRoute = async(req,res)=>{
    const {start,end} =  req.body;
    const apiKey = process.env.ORS_API_KEY;
    const url = 'https://openrouteservice.org/v2/directions/driving-car/geojson'
    try {
        const response = await axios,post(url,{
            coordinatets:[
                [start.lng,start.lat],
                [end.lng,end.lng]
            ]
        },{
            headers:{
                'Authorization':apiKey,
                'Content-Type':'application/json'
            }
        })
    } catch (error) {
        console.log(error)
    }
}