import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
  vehicleId:          a unique identifier for this vehicle
  country:            geographical operating country of this vehicle
  region:             geographical operating region of this vehicle
  organization:       organization that uses this vehicle
  contact:            contact person of this vehicle
  phone:              phone number to contact person
  email:              email address to contact person
  address:            physical address to contact person
  yearOfManufacture:  year of manufacture of this vehicle
  handoverDate:       date of when vehicle was handed over
  runningTime:        contractual running time (date)
  createdTime:        server timestamp of creation of this vehicle (set by api)
 */

const VehicleSchema = new Schema({
  vehicleId: {
    type: String,
    unique: true,
    required: [ true, 'vehicleId required' ],
    minlength: [ 2, 'vehicleId must be at least 2 chars']
  },
  country: {
    type: String,
    required: [ true, 'country required' ],
  },
  region: {
    type: String,
    required: [ true, 'region required' ],
  },
  organization: {
    type: String,
    required: [ true, 'organization required' ],
  },
  contact: {
    type: String,
    required: [ true, 'contact required' ],
  },
  email: {
    type: String,
    required: [ true, 'email required' ],
  },
  phone: {
    type: String,
    required: [ true, 'phone required' ],
  },
  email: {
    type: String,
    required: [ true, 'email required' ],
  },
  address: {
    type: String,
    required: [ true, 'address required' ],
  },
  yearOfManufacture: {
    type: String,
    required: [ true, 'yearOfManufacture required' ],
  },
  handoverDate: {
    type: String,
    required: [ true, 'handoverDate required' ],
  },
  runningTime: {
    type: String,
    required: [ true, 'runningTime required' ],
  },
  createdTime: {
    type: Date,
    default: Date.now
  }
});

VehicleSchema.index({ vehicleId: 1 });

module.exports = mongoose.model('Vehicle', VehicleSchema);
