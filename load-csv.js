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
    labelColumns = [],
    shuffle = true,
    splitTest = false
  }
) {                                                                                         // S14L181 set converts to an empty obj
  let data = fs.readFileSync(filename, { encoding: 'utf-8' });
  data = data.split('\n').map(row => row.split(','));                                       // S14L178 splitting on each new line we return an array for each row
  data = data.map(row => _.dropRightWhile(row, val => val === ''));                         // S14L179
  const headers = _.first(data);                                                             // S14L180

  data = data.map((row, index) => {                                                         // S14L180
    if (index === 0) {
      return row;
    }

    return row.map((element, index) => {
      if (converters[headers[index]]) {                                                     // S14L181
        const converted = converters[headers[index]](element);
        return _.isNaN(converted) ? element : converted;
      }

      const result = parseFloat(element);
      return _.isNaN(result) ? element : result;
    });
  });

  let labels = extractColumns(data, labelColumns);                                          // S14L182
  data = extractColumns(data, dataColumns);

  data.shift();
  labels.shift();

  if (shuffle) {                                                                             // S14L183 
    data = shuffleSeed.shuffle(data, 'phrase');
    labels = shuffleSeed.shuffle(labels, 'phrase');
  }

  if (splitTest) {                                                                          // S14L182
    const trainSize = _.isNumber(splitTest)
      ? splitTest
      : Math.floor(data.length / 2);

    return {
      features: data.slice(0, trainSize),
      labels: labels.slice(0, trainSize),
      testFeatures: data.slice(trainSize),
      testLabels: labels.slice(trainSize)
    };
  } else {
    return { features: data, labels };
  }
}

const { features, labels, testFeatures, testLabels } = loadCSV('data.csv', {
  dataColumns: ['height', 'value'],
  labelColumns: ['passed'],
  shuffle: true,
  splitTest: true,
  converters: {
    passed: val => (val === 'TRUE' ? 1 : 0)
  }
});

console.log('propval:')
console.log('Features', features);
console.log('Labels', labels);
console.log('testFeatures', testFeatures);
console.log('testLabels', testLabels);
