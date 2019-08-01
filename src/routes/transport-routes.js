import Transport from '../db/models/transport';
import { toError, toResponse, toValidationError } from '../utils/response-utils';
import { EEZER_DOCUMENT_NOT_FOUND } from '../utils/error-codes';
import moment from 'moment';
import momentFormat from 'moment-duration-format';

//function to import all date and time (started and ended) in the same format
const dateConverter = (dateIn) => {
  const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
  if (moment(dateIn, DATE_FORMAT).format(DATE_FORMAT) === dateIn){
  return dateIn;}
  else {
  let dateOk = Date.parse(dateIn);

  if ( dateOk > 0 ) {
      let dateLongFormat = moment(dateOk);
      var dateFormatted = moment(dateLongFormat).format(DATE_FORMAT);
      return dateFormatted;
  }
  else {
      return "";
  } 
}
};

/* Set up all the routes related to transports */
module.exports = {

  /* POST: /store | Store a transport into the database */
  storeTransport: (req, res) => {
    const transport = new Transport();

    transport.transportId     = req.body.transportId;
    transport.driverId        = req.body.driverId;
    transport.vehicleId       = req.body.vehicleId;
    transport.passengerName   = req.body.passengerName;
    transport.passengerPhone  = req.body.passengerPhone;
    transport.gender          = req.body.gender;
    transport.reason          = req.body.reason;
    transport.coordinates     = req.body.coordinates;
    transport.distance        = req.body.distance;
    transport.duration        = req.body.duration;
    transport.started         = dateConverter(req.body.startedTime);
    transport.ended           = dateConverter(req.body.endedTime);

    const validationError = transport.validateSync();

    if (validationError) {
      res.status(400).json(toValidationError(validationError));
      return;
    }

    transport.save((err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      const result = {
        transportId:  doc.transportId,
        distance:     doc.distance || 0,
        duration:     doc.duration
      };

      res.json(toResponse(result));
    });
  },

  /* DELETE: /remove/:id | Remove a transport by its transportId (should be access restricted later) */
  removeTransport: (req, res) => {
    Transport.remove({ transportId: req.params.id }, (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      if (doc.result.n === 1) {
          res.json(toResponse(""));
      } else {
        res.json(toError(EEZER_DOCUMENT_NOT_FOUND));
      }
    });
  },

  /* GET: /all | Get all transports (coordinates are not included) */
  getAll: (req, res) => {
    Transport.find({}, '-_id -__v -coordinates', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      res.json(toResponse(doc));
    });
  },

  /* GET: /coords/:id | Fetch coordinates for a given transport using transport id */
  getCoordinates: (req, res) => {
    Transport.findOne({ transportId: req.params.id }, { _id: 0, coordinates: 1 }, (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      // Strip the _id field of the coordinates array.
      const newCoords = (doc || { coordinates: [] }).coordinates.map(coord => {
        return { lng: coord.lng, lat: coord.lat };
      });

      res.json(toResponse(newCoords));
    });
  },

  /* GET: /totaldistance | Fetch total distance for all transports*/
  getTotalDistance: (req, res) => {
    Transport.find({}, 'distance', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      var stringDistance = JSON.stringify(doc);
      var jsonDistance = JSON.parse(stringDistance);
      var totalDistance = 0;
      var numberTransports = jsonDistance.length;
      for (var i=0; i<numberTransports; i++){
        totalDistance += jsonDistance[i].distance;
      }
      res.json(toResponse(Math.round(totalDistance)));
    });
  },

  /* GET: /totalduration | Fetch total duration for all transports - in hours*/
  getTotalDuration: (req, res) => {
    Transport.find({}, 'duration', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      let stringDuration = JSON.stringify(doc);
      let jsonDuration = JSON.parse(stringDuration);
      let totalDuration = 0;
      let numberTransports = jsonDuration.length;
      for (let i=0; i<numberTransports; i++){
        if (jsonDuration[i].duration != null && jsonDuration[i].duration != "" ) {
          totalDuration += jsonDuration[i].duration;
        }
      }

      let duration = moment.duration(totalDuration, "seconds");
      let formatted = duration.format("hh");
      res.json(formatted);
    });
  },

  /* GET: /latestroute | Get latest route where coordinates excist */
  getLatestRoute: (req, res) => {
    Transport.find({}, '-_id -__v', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      let stringTransport = JSON.stringify(doc);
      let jsonTransport = JSON.parse(stringTransport);
      
      jsonTransport.sort(function(a,b){
        return b.started.localeCompare(a.started);
      });

      for (var i = 0; i< jsonTransport.length; i++){
        
        if (jsonTransport[i].coordinates != ""){
          break;
        }
      }

      res.json(toResponse(jsonTransport[i]));
    });
  }
  
};
