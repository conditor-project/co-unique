'use strict';

const
  pkg = require('../package.json'),
  business = require('../index.js'),
  testData = require('./dataset/in/test.json'),
  chai = require('chai'),
  expect = chai.expect,
  _ = require('lodash');
 

  describe('#insert notice 1', function () {

    before(function (done) {

      business.beforeAnyJob(function (errBeforeAnyJob) {
        if (errBeforeAnyJob) {
          console.log('Erreur beforeAnyJob(), code ' + errBeforeAnyJob.errCode);
          console.log(errBeforeAnyJob.errMessage);
          process.exit(1);
        }
        console.log('before OK');
        done();
      });

    });
  
   
    let docObject;

    it('L id est bien stocké', function (done) {
      docObject = testData[0];
      business.doTheJob(docObject = testData[0], function (err) {
        expect(err).to.be.undefined;
        done();
      });
    });

    it('L id est rejeté', function (done) {
      docObject = testData[1];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.not.undefined;
        done();
      });
    });

    it('La source n est pas trouvée', function (done) {
      docObject = testData[2];
      business.doTheJob(docObject, function (err) {
        expect(err).to.be.not.undefined;
        done();
      });
    });
  });
