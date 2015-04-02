
'use strict';

  function buildJson(firstJSON, secJSON) {
    var finalJson = {};
    for (var keyInFirst in firstJSON) {
      var valid = true;
      for (var keyInSec in secJSON) {
        if (keyInSec === keyInFirst && finalJson[keyInFirst]) {
          valid = false;
          grunt.fail.warn('Duplicated PETRI experiment key: ' + keyInFirst + '!!!');
        }
      }
      if (valid) {
        finalJson[keyInFirst] = firstJSON[keyInFirst];
      }
    }

    return finalJson;
  }

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-merge-json');
  grunt.config('merge-json', {
    'merge-user': {
        src: ['app/petri-experiments/*.json'],
        dest: '.tmp/user-petri-experiments.json'
      },
      'merge-bower': {
        src: ['app/bower_components/*/dist/petri-experiments.json'],
        dest: '.tmp/bower-petri-experiments.json'
      }
  });

  grunt.loadNpmTasks('grunt-file-creator');
    grunt.config('file-creator', {
    'packageSpecs': {
        'dist/petri-experiments.json': function (fs, fd, done) {
          var packagedSpecs = [];

          function validateSpec(aSpec) {
            return typeof aSpec.name === 'string' && aSpec.name.length > 0 &&
                typeof aSpec.owner === 'string' && aSpec.owner.length > 0 &&
                typeof aSpec.scope === 'string' && aSpec.scope.length > 0 &&
                typeof aSpec.onlyForLoggedInUsers === 'boolean' &&
                Array.isArray(aSpec.testGroups) && aSpec.testGroups.length > 1;
          }

          function processSingle(abspath, rootdir, subdir, filename) {
            var singleSpec = grunt.file.readJSON(abspath);
            if (validateSpec(singleSpec)) {
              packagedSpecs.push(singleSpec);
            }
            else {
              grunt.fail.warn('Illegal petriSpec file: ' + abspath);
            }
          }

          grunt.file.recurse('petri-experiments', processSingle);
          fs.writeSync(fd, JSON.stringify(packagedSpecs, null, 4));

          done();
        }
      },
      compileSpecs: {
        'dist/petri-experiments.json': function (fs, fd, done) {
          var userJson = grunt.file.readJSON('.tmp/user-petri-experiments.json');
          var bowerJson = grunt.file.readJSON('.tmp/bower-petri-experiments.json');
          var extend = require('node.extend');
          var stringifyJSON = JSON.stringify(extend({}, buildJson(userJson, bowerJson), bowerJson), null, '\t');
          fs.writeSync(fd, stringifyJSON);

          done();
        },
        'app/petri-experiments.js': function (fs, fd, done) {

          var experiments = {};
          var scopes = [];
          var allSpecs = grunt.file.readJSON('dist/petri-experiments.json');
          var norepeat = require('array-norepeat');

          for (var spec in allSpecs) {
            var scope = allSpecs[spec].scope;
            scopes.push('\'' + scope + '\'');
            experiments[allSpecs[spec].name] = allSpecs[spec].name;
          }

          scopes = norepeat(scopes, false);
          console.log(scopes);
          fs.writeSync(fd, '//auto generated code, do not edit.\n');
          fs.writeSync(fd, '\'use strict\';\n');
          fs.writeSync(fd, 'var W = W || {};\n');
          fs.writeSync(fd, 'var PetriExperiments = W.PetriExperiments || function () {\n');
          fs.writeSync(fd, '\tvar experiments = {};\n');
          fs.writeSync(fd, '\tvar scopes = [];\n');
          for (var spec in experiments) {
            fs.writeSync(fd, '\texperiments.' + spec + ' = \'' + spec + '\' ;\n');
          }
          ;
          fs.writeSync(fd, '\tscopes = [' + scopes.join(', ') + '];\n');
          fs.writeSync(fd, '\treturn {\n');
          fs.writeSync(fd, '\t experiments : experiments,\n');
          fs.writeSync(fd, '\t scopes: scopes\n');
          fs.writeSync(fd, '\t}\n');
          fs.writeSync(fd, '};\n');
          fs.writeSync(fd, 'W.PetriExperiments = PetriExperiments;\n');
          fs.writeSync(fd, 'module.exports = W.PetriExperiments;\n');
         

          done();
        }
      }
  });

  grunt.registerTask('petriExperiments', ['merge-json','file-creator:compileSpecs']);

};
