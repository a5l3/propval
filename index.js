require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs'); 
const loadCSV = require('./load-csv.js'); 

// S4L53
function knn(features, labels, predictionPoint, k){
    // S4L57
    const {mean, variance} = tf.moments(features, 0); 
    const scaledPrediction = predictionPoint.sub(mean).div(variance.pow(0.5)); 
    
    return features
        .sub(mean)
        .div(variance.pow(0.5))
        .sub(scaledPrediction)
        .pow(2)
        .sum(1)
        .pow(0.5)
        .expandDims(1)
        .concat(labels, 1)
        .unstack()
        .sort((a,b) => a.get(0) > b.get(0) ? 1 : -1)
        .slice(0, k)
        .reduce((acc, pair) => acc + pair.get(1), 0) / k; 
}


// S4L52
let {
    features,                   // rest of features 
    labels,                     // rest of labels 
    testFeatures,               // 10 features 
    testLabels                  // 10 labels 
    } = loadCSV('kc_house_data.csv', {
    shuffle: true,                  // we need to shuffle data when dealing with KNN, avoids bias 
    splitTest: 10,                  // two datasets, test and training, 10 records for testing the rest for training 
    dataColumns: [
        'date','bedrooms','bathrooms','sqft_living','sqft_lot','floors','view','condition','grade','sqft_above','sqft_basement','yr_built','yr_renovated','zipcode','lat','long','sqft_living15','sqft_lot15'
    ],   // specifying the columns we want 
    labelColumns: ['price']         // specifying our label data
}); 

// S4L53 
features = tf.tensor(features); 
labels = tf.tensor(labels);


// S4L54 
testFeatures.forEach((testPoint, i) => {
    const result = knn(features, labels, tf.tensor(testPoint), 10);
    const err = (testLabels[i][0] - result) / testLabels[i][0]; 
    console.log('Error percent:', err * 100, ' Result:', result, 'Actual:', testLabels[i][0]);
}); 




















// console.log('Test Features: \n', testFeatures);
// console.log('Test Labels: \n', testLabels);
