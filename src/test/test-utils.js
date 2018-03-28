module.exports = {

  // Export test function to generate a transport.
  getTransport: (uuid) => {

    return {
        transportId: `driver01-vehicle01-${uuid}`,
        driverId: 'driver01',
        vehicleId: 'vehicle01',
        passengerName: 'passengerName',
        passengerPhone: 'passengerPhone',
        gender: 'GENDER',
        reason: 'reason',
        coordinates: [],
        distance: 1,
        duration: 2,
        startedTime: '2017-05-31 12:12:12',
        endedTime: '2017-06-32 13:13:13',

        //required for saving directly to mongodb
        started: '2017-05-31 12:12:12',
        ended: '2017-06-32 13:13:13'
    };
  }

}
