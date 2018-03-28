import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
  transportId:
      unique id of this transport
      format: [generated UUID]
  driverId:
      identifies the driver (a username from the UserSchema)
  vehicleId:
      identifies the vehicle (a vehicleId from the VehicleSchema)
  passengerName:
      name of passenger being transported
  passengerPhone:
      phone number to passenger being transported
  gender:
      gender of passenger being transported
  reason:
      reason for transport
  coordinates:
      array of coordinate objects
      should go in this format:
          { lat: 12.333333, lng: 63.33444 }
  distance:
      distance travelled in meters
  duration:
      duration in seconds
  startedTime:
      timestamp of when transport started
      format: right now: '2017-05-31 12:15:12' but probably will change
              to unix timestamp
  endedTime:
      timestamp of when transport ended
      format: right now: '2017-05-31 12:15:12' but probably will change
              to unix timestamp
  createdServerTime:
      server timestamp of when transport started (set by api)

 */

const TransportSchema = new Schema({
  transportId: {
    type: String,
    unique: true,
    required: [ true, 'transportId required' ],
    minlength: [ 10, 'transportId must be at least 10 chars']
  },
  driverId: {
    type: String,
    required: [ true, 'driverId required' ],
    minlength: [ 5, 'driverId must be at least 5 chars']
  },
  vehicleId: {
    type: String,
    required: [ true, 'vehicleId required' ],
    minlength: [ 2, 'vehicleId must be at least 2 chars']
  },
  passengerName: String,
  passengerPhone: String,
  gender: String,
  reason: String,
  coordinates: [ {
    lat: {
      type: Number,
      required: [ true, 'lat required' ],
    },
    lng: {
      type: Number,
      required: [ true, 'lng required' ],
    },
  } ],
  distance: {
    type: Number,
    required: [ true, 'distance required' ],
    min: 0
  },
  duration: {
    type: Number,
    required: [ true, 'duration required' ],
    min: 0
  },
  started: {
    type: String,
    required: [ true, 'started required' ]
  },
  ended: {
    type: String,
    required: [ true, 'ended required' ],
  },
  createdServerTime: {
    type: Date,
    default: Date.now
  }
});

TransportSchema.index({ transportId: 1 });

module.exports = mongoose.model('Transport', TransportSchema);
