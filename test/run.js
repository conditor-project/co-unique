'use strict';

const
  pkg = require('../package.json'),
  rewire = require('rewire'),
  business = rewire('../index.js'),
  testData = require('./dataset/in/test.json'),
  chai = require('chai'),
  expect = chai.expect,
  _ = require('lodash'),
 



describe(pkg.name + '/index.js', function () {

  this.timeout(10000);

  // Méthde d'initialisation s'exécutant en tout premier
  before(function (done) {

    checkAndDeleteIndex(function (errCheck) {

      if (errCheck) {
        console.log('Erreur checkAndDelete() : ' + errCheck.errMessage);
        process.exit(1);
      }

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

  });

  
  //test sur la création de règle 
  describe('#fonction buildQuery',function(){
    let docObject;
    let request = _.cloneDeep(baseRequest);

    it('Le constructeur de requête devrait pour la notice remonter 39 règles',function(done){

      docObject = testData[0];
      request = business.__get__("buildQuery")(docObject = testData[0],request);
      expect(request.query.bool.should.length).to.be.equal(39);
      done();
    });
  });
  
  
  
  // test sur l'insertion d'une 1ere notice
  describe('#insert notice 1', function () {

    let docObject;

  });

  describe('#tests des normalizer', function () {
    it('Titre normalizer retourne la bonne valeur',function(done){
      
      esClient.indices.analyze({
        index:esConf.index,
        body:{
          "field":"titre.normalized",
          "text":"Voici un test de titre caparaçonner aïoli ! "
        }
      },function(esError,response){
          expect(esError).to.be.undefined;
          expect(response).to.not.be.undefined;
          expect(response.tokens[0].token).to.be.equal('voiciuntestdetitrecaparaconneraioli');
          done();
        });
    });
  });
});
