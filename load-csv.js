const fs = require('fs'); 
const _ = require('lodash'); 
// S14L177
function loadCSV(filename, options) {
    let data = fs.readFileSync(filename, { encoding: 'utf-8'}); 
    data = data.split('\n').map(row => row.split(','))                                      // S14L178 splitting on each new line we return an array for each row 
    data = data.map(row => _.dropRightWhile(row, val => val === ''))                        // S14L179

    console.log(data);
}

loadCSV('data.csv');