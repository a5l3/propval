const fs = require('fs'); 
const _ = require('lodash'); 
// S14L177
function loadCSV(filename, { converters = {} }) {                                           // S14L181 set converts to an empty obj
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
                return _.isNaN(converted) ? element : converted
            }           

            const result = parseFloat(element)
            return _.isNaN(result) ? element : result 
        })
    }); 

    console.log(data)
}

loadCSV('data.csv', {
    converters: {
        passed: val => (val === 'TRUE' ? true : false)                                          // S14L181 the key is the name of the header that will be passed this custom func 
    }
});