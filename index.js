'use strict';

const _ = require('lodash');
const metadataMappings = require('co-config/metadata-mappings.json');
const Redis = require('ioredis');

class CoUnique {
  constructor () {
    this.CONDITOR_SESSION = process.env.ISTEX_SESSION || 'TEST_1970-01-01-00-00-00';
    this.MODULEROOT = process.env.MODULEROOT || __dirname;
    this.redisHost = process.env.REDIS_HOST || 'localhost';
    this.redisPort = process.env.REDIS_PORT || 6379;
    this.redisClient = new Redis({
      'host': this.redisHost,
      'port': this.redisPort
    });
    this.redisKey = this.CONDITOR_SESSION + ':co-unique';
    this.keyName = this.redisKey + ':_listId';
  }

  beforeAnyJob (cbBefore) {
    this.redisClient.del(this.keyName)
      .then(() => cbBefore())
      .catch((err) => {
        if (err) {
          let error = {
            errCode: 1,
            errMessage: "Erreur de delete de la liste d'id : " + err
          };
          cbBefore(error);
        }
      });
  }

  doTheJob (jsonLine, next) {
    const source = jsonLine.source;
    const goodSource = _.find(metadataMappings, (mappingSource) => { return mappingSource.source === source; });
    if (goodSource === undefined || goodSource.nameID === undefined || goodSource.nameID.trim() === '') {
      let error = {
        errCode: 1,
        errMessage: 'Aucun mapping valide trouvé pour cette source.'
      };
      jsonLine.error = error;
      return next(error);
    }
    const idSource = jsonLine[goodSource.nameID];
    this.redisClient.sadd([this.keyName, idSource]).then(res => {
      if (res === 0) {
        const error = {
          errCode: 1,
          errMessage: 'Id source en doublon dans le corpus'
        };
        jsonLine.error = error;
        next(error);
      } else {
        next();
      }
    }).catch(err => {
      if (err) {
        const error = {
          errCode: 1,
          errMessage: "Erreur d'ajout d'id à la liste"
        };
        jsonLine.error = error;
        next(error);
      }
    });
  }

  finalJob (docObject, done) {
    this.redisClient.quit()
      .then(() => done())
      .catch(error => done(error));
  }

  afterAllTheJobs (done) {
    this.redisClient.del(this.keyName)
      .then(() => done())
      .catch(err => done(err));
  }
}

module.exports = new CoUnique();
