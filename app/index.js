import angular from 'angular';
import ngFileUpload from 'ng-file-upload';
import editorComponent from './editor';
import 'normalize.css';

/* Goals

Use the MyEAN stack (MySQL, ExpressJS, AngularJS, NodeJS) along with fabric.js. 

Allow the ability for clients to
    upload, 
    rotate and 
    scale images 
    within the editor. 

Allow input text to be 
    created, 
    rotated and 
    scaled. 
Allow the designs to be saved and reopened. 

Implement an edit history for the editor. 
Aesthetically pleasing

*/

angular.module('shirtsApp', ['ngFileUpload'])
.component(editorComponent)

console.log(process.env);