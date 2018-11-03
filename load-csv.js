const fs = require('fs'); 
const _ = require('lodash'); 
const shuffleSeed = require('shuffle-seed');


// S14L182 helper function for dataColumns & labelColumns, extract column names from data set 
function extractColumns(data, columnNames) {
    const headers = _.first(data);  
    const indexes = _.map(columnNames, column => headers.indexOf(column));  
    const extracted = _.map(data, row => _.pullAt(row, indexes));
    return extracted;
}

// S14L177
function loadCSV(
    filename,
    { 
        converters = {}, 
        dataColumns = [],
        labelColumns= [], 
        shuffle = true
    }
    ) {                                                                                     // S14L181 set converts to an empty obj
    let data = fs.readFileSync(filename, { encoding: 'utf-8'}); 
    data = data.split('\n').map(row => row.split(','))                                      // S14L178 splitting on each new line we return an array for each row 
    data = data.map(row => _.dropRightWhile(row, val => val === ''))                        // S14L179
    const headers = _.first(data)                                                            // S14L180
    
    data = data.map((row, index) => {    // S14L180
        if(index === 0){
            return row
        }
        return row.map((element, index) => {
            if(converters[headers[index]]) {                                                 // S14L181
                const converted = converters[headers[index]](element)
                return _.isNaN(converted) ? element : converted;
            }           

            const result = parseFloat(element)
            return _.isNaN(result) ? element : result;
        });
    }); 

    let labels = extractColumns(data, labelColumns);                                          // S14L182
    data = extractColumns(data, dataColumns); 

    data.shift()
    labels.shift()

    if (shuffle) {                                                                             // S14L183 
        data = shuffleSeed.shuffle(data, 'hakunamatata');
        labels = shuffleSeed.shuffle(labels, 'hakunamatata');
    }

    console.log(data)
    console.log(labels) 
}

loadCSV('data.csv', {
    dataColumns: ['height', 'value'],                                                           // S14L182
    labelColumns: ['passed'], 
    converters: {
        passed: val => (val === 'TRUE' ? true : false)                                          // S14L181 the key is the name of the header that will be passed this custom func 
    }, 
    shuffle: true
});