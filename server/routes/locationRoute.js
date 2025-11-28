import { getRoute } from '../controllers/locationController';

const express = require('express');
const route = express.Router();

route.post('/route',getRoute)



export default route;