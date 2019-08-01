import Vehicle from '../db/models/vehicle';
import { toError, toResponse, toValidationError } from '../utils/response-utils';
import { EEZER_DOCUMENT_NOT_FOUND } from '../utils/error-codes';

/* Set up all the routes related to users. */
module.exports = {

  // POST /addvehicle | Add a new vehicle to the db.
  addVehicle: (req, res) => {

    const newVehicle = new Vehicle();

    newVehicle.vehicleId          = req.body.vehicleId;
    newVehicle.country            = req.body.country;
    newVehicle.region             = req.body.region;
    newVehicle.organization       = req.body.organization;
    newVehicle.contact            = req.body.contact;
    newVehicle.phone              = req.body.phone;
    newVehicle.email              = req.body.email;
    newVehicle.address            = req.body.address;
    newVehicle.yearOfManufacture  = req.body.yearOfManufacture;
    newVehicle.handoverDate       = req.body.handoverDate;
    newVehicle.runningTime        = req.body.runningTime;

    const validationError = newVehicle.validateSync();

    if (validationError) {
      res.status(400).json(toValidationError(validationError));
      return;
    }

    newVehicle.save((err, doc) => {

      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      const vehicle = {
        vehicleId:          doc.vehicleId,
        country:            doc.country,
        region:             doc.region,
        organization:       doc.organization,
        contact:            doc.contact,
        phone:              doc.phone,
        email:              doc.email,
        address:            doc.address,
        yearOfManufacture:  doc.yearOfManufacture,
        handoverDate:       doc.handoverDate,
        runningTime:        doc.runningTime
      };

      res.json(toResponse(vehicle));
    });
  },

  // DELETE /rmvehicle | Remove a vehicle from the db.
  deleteVehicle: (req, res) => {   
    Vehicle.remove({ vehicleId: req.params.vehicleId }, (err, doc) => {    
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

  // GET /getvehicles | Get all existing vehicles in system.
  getVehicles: (req, res) => {

    Vehicle.find({}, '-_id -__v', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      res.json(toResponse(doc));
    });
  },

  // GET /getnumbervehicles | Get the number of all existing vehicles in system.
  getNumberVehicles: (req, res) => {

    
    Vehicle.find({}, '-_id -__v', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }
      
      var lengthDoc = doc.length;
      res.json(toResponse(lengthDoc));
    });
  }
};
