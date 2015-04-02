'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var userJsonData;
var bowerJsonData;
var petriExperimentJsonData;

exports.petriExperiments =  {
 check_to_see_that_user_json_exist : function (test) {
 
   userJsonData =  JSON.parse(grunt.file.read('.tmp/user-petri-experiments.json'));
   test.equal(typeof userJsonData === 'object', true, 'check to see that user-petri-experiments.json content is json object');
   test.done();
 },
  check_to_see_that_bower_json_exist : function (test) {
 
   bowerJsonData =  JSON.parse(grunt.file.read('.tmp/bower-petri-experiments.json'));
   test.equal(typeof bowerJsonData === 'object', true, 'check to see that .tmp/bower-petri-experiments.json content is json object');
   test.done();
 },
  check_to_see_that_dist_json_exist : function (test) {
 
   petriExperimentJsonData = JSON.parse(grunt.file.read('dist/petri-experiments.json'));
   test.equal(typeof bowerJsonData === 'object', true, 'check to see that dist/petri-experiments.json content is json object');
   test.done();
 },
 check_to_see_that_all_user_json_in_dist_json : function (test) {

  for(var key in userJsonData) {
   test.equal(userJsonData[key].scope, petriExperimentJsonData[key].scope, 'check to see that the user json data is included in the final json file');
  } 
  test.done();
 },
 check_dev_experiment_js : function (test) {
    var petriExperimentsJS = require('../app/petri-experiments.js');
    var petriExperimentsObj = petriExperimentsJS ();
    for(var key in petriExperimentsObj.experiments) {
     test.equal(petriExperimentJsonData[key].name, key, 'check to see that the petri experiment name appear in the internal js file that was generated');
    } 
    test.done();
 }
  
};
