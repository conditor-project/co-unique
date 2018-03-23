'use strict'

const _ = require('lodash'),
  metadataMappings = require('co-config/metadata-mappings.json'),
  Redis = require('ioredis');


class CoUnique{


  constructor() {

    this.CONDITOR_SESSION = process.env.ISTEX_SESSION || "TEST_1970-01-01-00-00-00";
    this.MODULEROOT = process.env.MODULEROOT || __dirname;
    this.redisHost = process.env.REDIS_HOST || "localhost";
    this.redisPort = process.env.REDIS_PORT || 6379;
    this.redisClient = Redis.createClient({
      "host": this.redisHost,
      "port": this.redisPort
    });
    this.redisKey = this.CONDITOR_SESSION + ":co-unique";
    
  }

  doTheJob(jsonLine, cb) {

    let source = jsonLine.source;
    let idSource;
    let nameId;

    _.each(metadataMappings,(mappingSource)=>{
      if (mappingSource.source === source) { nameId = mappingSource.nameID; }
    });

    if ( nameId === undefined || nameId.trim() ==="") {

      let error = {
        errCode: 1,
        errMessage: "Aucun mapping valide trouvé pour cette source."
      };
      jsonLine.error = error;
      cb(error);

    }
    else {
      idSource = jsonLine[nameId].value;
      this.redisClient.sadd(["Module:"+this.redisKey+":_listId",idSource])
        .then(res=>{
          if (res === 0){
            let error = {
              errCode: 1,
              errMessage: "Id source en doublon dans le corpus"
            };
            jsonLine.error = error;
            cb(error);
          }
          else if (res ===1){
            cb();
          }
        });
       
    }
  }
}


module.exports = new CoUnique();