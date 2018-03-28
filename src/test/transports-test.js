import mongoose from 'mongoose';
import Transport from '../db/models/transport';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
let should = chai.should();

import getConfig from '../config/config'
import { API_PATH_STORE, API_PATH_ALL,
  API_PATH_COORDS, API_PATH_REMOVE } from '../config/constants';
import { getTransport } from './test-utils';

const config = getConfig();

const STORE = `${config.apiRootEndpoint}/${API_PATH_STORE}`;
const ALL = `${config.apiRootEndpoint}/${API_PATH_ALL}`;
const COORDS = `${config.apiRootEndpoint}/${API_PATH_COORDS}`;
const REMOVE = `${config.apiRootEndpoint}/${API_PATH_REMOVE}`;

chai.use(chaiHttp);


describe('Transports', () => {
    beforeEach((done) => { //Before each test we empty the database
        Transport.remove({}, (err) => {
           done();
        });
    });

    /*
     * Test the /GET all transports route
     */
    describe('/GET transports', () => {
        it('should GET all the transports', (done) => {
          chai.request(server)
            .get(ALL)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(0);
                done();
            });
        });
    });

    /*
     * Test the /POST transport route
     */
    describe('/POST transport', () => {
        it('should POST a transport to the db', (done) => {

          const transport = getTransport('001');
          transport.coordinates = [ { lng: 1, lat: 2 } ];

          chai.request(server)
              .post(STORE)
              .send(transport)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.success.should.be.eql(true);

                  res.body.data.should.have.property('transportId').eql(transport.transportId);
                  res.body.data.should.have.property('distance').eql(transport.distance);
                  res.body.data.should.have.property('duration').eql(transport.duration);

                  done();
              });
        });

        it('cannot POST two transports with same transportId', (done) => {

          const transport = getTransport('001');

          const firstTransport = new Transport(transport);

          // We first save a transport...
          firstTransport.save((err, res) => {

            // And then try to insert the same again...
            chai.request(server)
                .post(STORE)
                .send(transport)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.success.should.be.eql(false);
                    res.body.should.have.property('message');
                  done();
                });
          });
        });
    });

    /*
     * Test the /GET coordinates for a specific transport
     */
    describe('/GET coords', () => {
        it('should GET the coordinates for a transport', (done) => {

          const transport = getTransport('001');
          transport.coordinates = [ { lat: 10, lng: 20 } ];

          const transportWithCoords = new Transport(transport);

          transportWithCoords.save((err, res) => {

            chai.request(server)
              .get(`${COORDS}/${transport.transportId}`)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.success.should.be.eql(true);
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.be.eql(1);

                  // Check if the coordinates are correct
                  res.body.data[0].lat.should.be.eql(10);
                  res.body.data[0].lng.should.be.eql(20);

                  done();
              });

          });
        });
    });

    /*
     * Test the /DELETE transport route
     */
    describe('/DELETE transport', () => {
        it('should DELETE a transport of given id', (done) => {

          const transport1 = getTransport('001');
          const transport2 = getTransport('002');
          const transport3 = getTransport('003');

          const transport1schema = new Transport(transport1);
          const transport2schema = new Transport(transport2);
          const transport3schema = new Transport(transport3);

          transport1schema.save((err, res) => {
            transport2schema.save((err, res) => {
              transport3schema.save((err, res) => {
                // this is what's referred to as 'callback hell' :S

                chai.request(server)
                  // remove the second document
                  .delete(`${REMOVE}/${transport2.transportId}`)
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.success.should.be.eql(true);

                      const query = Transport.find({}, { coordinates: 0 }, (err, res) => {
                        res.should.be.a('array');
                        res.length.should.be.eql(2);

                        let ids = []
                        res.forEach((e) => {
                            ids.push(e.transportId);
                        });

                        // Check that we've got the right objects.
                        ids.should.have.members([transport1.transportId, transport3.transportId]);

                        done();
                      });
                  });

              });
            });
          });
        });
    });

    /*
     * Test that coords doesn't get mixed up between transports.
     */
    describe('data integrity', () => {
        it('should not mix up coords between transports', (done) => {

          const transport1 = getTransport('001');
          transport1.coordinates = [ { lat: 1, lng: 2 }, { lat: 3, lng: 4 } ];

          const transport2 = getTransport('002');
          transport2.coordinates = [ { lat: 5, lng: 6 }, { lat: 7, lng: 8 } ];

          const transport3 = getTransport('003');
          transport3.coordinates = [ { lat: 9, lng: 10 }, { lat: 11, lng: 12 } ];

          const transport1schema = new Transport(transport1);
          const transport2schema = new Transport(transport2);
          const transport3schema = new Transport(transport3);

          // Save all the transports to db
          transport1schema.save((err, res) => {
            transport2schema.save((err, res) => {
              transport3schema.save((err, res) => {

                chai.request(server)
                  .get(`${COORDS}/${transport2.transportId}`)
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.success.should.be.eql(true);
                      res.body.data.should.be.a('array');
                      res.body.data.length.should.be.eql(2);

                      // Check if the coordinates are correct
                      res.body.data[0].lat.should.be.eql(5);
                      res.body.data[0].lng.should.be.eql(6);

                      res.body.data[1].lat.should.be.eql(7);
                      res.body.data[1].lng.should.be.eql(8);

                      // check one more...
                      chai.request(server)
                        .get(`${COORDS}/${transport3.transportId}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.success.should.be.eql(true);
                            res.body.data.should.be.a('array');
                            res.body.data.length.should.be.eql(2);

                            // Check if the coordinates are correct
                            res.body.data[0].lat.should.be.eql(9);
                            res.body.data[0].lng.should.be.eql(10);

                            res.body.data[1].lat.should.be.eql(11);
                            res.body.data[1].lng.should.be.eql(12);

                            done();
                        });
                  });
              });
            });
          });
        });
    });

});
