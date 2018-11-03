const fs = require('fs'); 

// S14L177
function loadCSV(filename, options) {
    const data = fs.readFileSync(filename, { encoding: 'utf-8'}); 
    console.log(data.split('\n').map(row => row.split(',')))              // S14L178 splitting on each new line we return an array for each row 
    
}

loadCSV('data.csv');