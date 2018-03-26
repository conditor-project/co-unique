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
          done(errBeforeAnyJob);
        }
        console.log('before OK');
        done();
      });

    });
 
   
    let docObject;

    it('L id est bien stocké', (done)=> {
      docObject = testData[0];
      business.doTheJob(docObject = testData[0],(err)=> {
        expect(err).to.be.undefined;
        done();
      });
    });

    it('L id est rejeté', (done)=> {
      docObject = testData[1];
      business.doTheJob(docObject,(err)=> {
        expect(err).to.be.not.undefined;
        done();
      });
    });

    it('La source n est pas trouvée', (done)=> {
      docObject = testData[2];
      business.doTheJob(docObject, (err)=> {
        expect(err).to.be.not.undefined;
        done();
        

      });
    });
  });


after(function(done) {

  // Nettoyage du corpusRoot;
  business.finalJob(null,done);

});



 