# grunt-petri-experiments 

> Define experiments in client side json. 

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-petri-experiments --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-petri-experiments');
```

## The "petriExperiments" task

### Overview
In your project just add the 'petriExperiments' to the different grutn tasks such as 'test', 'serve', etc'.

The task itself run two different tasks:

1- merge-json : read all Petri JSON files in your app folder, where you declaired the Petri Experiment, and will get all Petri Experiments as were declaired in any other bower_component dist folder.

The task will create 2 files in .tmp folder: user-petri-experiments.json & bower-petri-experiments.json.

2- file-creator : will create 2 files: dist/petri-experiments.json & app/petri-experiments.js.

in the first file (dist/petri-experiments.json) we will have one single JSON file that will merge both Petri Experiment JSON files (that were created in the merge-json task), and in the secound file (app/petri-experiments.js) we have generated an object for you to mock during your develop process:
```js
"var W = W || {};
var PetriExperiments = W.PetriExperiments || function () {
  var experiments = {};
  var scopes = [];
  experiments.petri1 = 'petri1' ;
  experiments.petri2 = 'petri2' ;
  experiments.bower_petri = 'bower_petri' ;
  experiments.bower_petri_2 = 'bower_petri_2' ;
  scopes = ['myscope1', 'myscope'];
  return {
   experiments : experiments,
   scopes: scopes
  }
};
W.PetriExperiments = PetriExperiments;
module.exports = W.PetriExperiments;"
```
### Duplicated Petri Experiment in your app/ and bower_comopnent/

In case that you have duplicated JSON element in your local app/ folder and in any bower_component/*/dist folder, you will get a grunt alert: "Duplicated PETRI experiment key" + the key name.

### How to declare a single Petri Experiment in yout app/ folder?

important key notes:

1- for each Petri Experiment use a single JSON file.

2- make sure that the Object declaration name will be the same name property.

3- the dontExport property is must have even if left blank.
```js
{
  "petri1" : {
    "scope": "myscope1",
    "onlyForLoggedInUsers": true,
    "name": "petri1",
    "owner": "morp@wix.com",
    "testGroups": [
      "true",
      "false"
    ],
    "dontExport": ""
  }
}
```

### A third hidden task

Although you will not use it, it is nice to know what it does.

this task will use on build process, to create the petri experiment that you generated in you project at Petri.

#### in case that you dont want to export your experiment to petri set the "dontExport": "false".

## License
Copyright (c) 2015 Oron Mozes. Licensed under the MIT license.
