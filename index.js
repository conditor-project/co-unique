'use strict'

const _ = require('lodash'),
  metadataMappings = require('co-config/metadata-mappings.json'),
  Promise = require("bluebird"),
  Redis = require('ioredis');


class CoUnique{


  constructor() {

    this.CONDITOR_SESSION = process.env.ISTEX_SESSION || "TEST_1970-01-01-00-00-00";
    this.MODULEROOT = process.env.MODULEROOT || __dirname;
    this.redisHost = process.env.REDIS_HOST || "localhost";
    this.redisPort = process.env.REDIS_PORT || 6379;
    this.redisClient = new Redis({
      "host": this.redisHost,
      "port": this.redisPort
    });
    this.redisKey = this.CONDITOR_SESSION + ":co-unique";
    this.keyName = this.redisKey+":_listId";
  }

  beforeAnyJob(cbBefore){
    this.redisClient.del(this.keyName)
    .catch((err)=>{
      if (err){
        let error = {
          errCode: 1,
          errMessage: "Erreur de delete de la liste d'id : "+err
        };
        cbBefore(error);
      }}).then(()=>{

        cbBefore();

      });
  }


  doTheJob(jsonLine, next) {

    let source = jsonLine.source;
    let idSource;
    let goodSource;

    goodSource=_.find(metadataMappings,(mappingSource)=>{ return mappingSource.source === source});

    if ( goodSource === undefined || goodSource.nameID === undefined || goodSource.nameID.trim() ===""  ) {

      let error = {
        errCode: 1,
        errMessage: "Aucun mapping valide trouvé pour cette source."
      };
      jsonLine.error = error;
     next(error);
    }
    else {
      idSource = jsonLine[goodSource.nameID];
      this.redisClient.sadd([this.keyName,idSource])
      .catch((err)=>{
        if (err) {
          let error = {
            errCode: 1,
            errMessage: "Erreur d'ajout d'id à la liste"
          };
          jsonLine.error = error;
          next(error);
        }
      })
      .then((res)=>{
        //console.log('res : '+res);
        if (res === 0){
          let error = {
            errCode: 1,
            errMessage: "Id source en doublon dans le corpus"
          };
          jsonLine.error = error;
          next(error);
        }
        else {
          next();
        }
      });
    }
  }


  finalJob(docObject,done){
    Promise.try(()=>{
     return this.redisClient.disconnect();
    })
    .catch(err=>{
      done(err);
    })
    .then(()=>{
      done();
    })
  }

  afterAllTheJobs(done){
   
    this.redisClient.del(this.keyName) 
    .catch(err=>{
      done(err);
    })
    .then(()=>{
      done();
    });
  }
}


module.exports = new CoUnique();