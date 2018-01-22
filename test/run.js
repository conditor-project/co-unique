'use strict';

const
  pkg = require('../package.json'),
  business = require('../index.js'),
  testData = require('./dataset/in/test.json'),
  chai = require('chai'),
  expect = chai.expect,
  _ = require('lodash');
 

  describe('#insert notice 1', function () {

    let docObject;

    it('L id est bien stocké', function (done) {
      docObject = testData[0];
      business.doTheJob(docObject = testData[0], function (err) {
        expect(err).to.be.undefined;
        done();
      });
    });

    it('La notice 2 matche bien', function (done) {
      docObject = testData[1];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.undefined;
        done();
      });
    });

    it('La notice 3 matche bien', function (done) {
      docObject = testData[2];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.undefined;
        done();
      });
    });

    it('La notice 4 matche bien', function (done) {
      docObject = testData[3];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.undefined;
        done();
         
      });
    });

    it('La notice 5 matche bien', function (done) {
      docObject = testData[4];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.undefined;
        done();
        
      });
    });

    it('La notice 6 matche bien', function (done) {
      docObject = testData[5];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.undefined;
        //expect(docObject.conditor_ident).to.be.equal(5);
        done();
      });
    });

    it('La notice 7 matche bien', function (done) {
      docObject = testData[5];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.undefined;
        //expect(docObject.conditor_ident).to.be.equal(5);
        done();
      });
    });

    it('La notice 8 matche bien', function (done) {
      docObject = testData[5];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.undefined;
        //expect(docObject.conditor_ident).to.be.equal(5);
        done();
      });
    });

  });
