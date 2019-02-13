/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';
const business = require('../index.js');
const testData = require('./dataset/in/test.json');
const chai = require('chai');
const expect = chai.expect;

describe('#insert notice 1', function () {
  before(function (done) {
    business.beforeAnyJob(function (errBeforeAnyJob) {
      if (errBeforeAnyJob) {
        console.log('Erreur beforeAnyJob(), code ' + errBeforeAnyJob.errCode);
        console.log(errBeforeAnyJob.errMessage);
        done(errBeforeAnyJob);
      }
      console.log('before OK');
      done();
    });
  });

  it('L id est bien stocké', (done) => {
    const docObject = testData[0];
    business.doTheJob(docObject, (err) => {
      expect(err).to.be.undefined;
      done();
    });
  });

  it('L id est rejeté', (done) => {
    const docObject = testData[1];
    business.doTheJob(docObject, (err) => {
      expect(err).to.be.not.undefined;
      done();
    });
  });

  it('La source n est pas trouvée', (done) => {
    const docObject = testData[2];
    business.doTheJob(docObject, (err) => {
      expect(err).to.be.not.undefined;
      done();
    });
  });
});

after(function (done) {
  // Nettoyage du corpusRoot;
  business.finalJob(null, done);
});
