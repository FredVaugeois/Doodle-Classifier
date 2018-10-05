// This program is highly inspired by the Doodle Classifier made by
// Daniel Shiffman in "The coding train" as part of his toy neural
// network library. This is the Tensorflow version of his work with
// some tweaks and modifications.

// https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/examples/doodle_classification



// This function create the xs and ys tensors from the data tables
function prepareData(data, labels){
  // Local arrays that will contain the data to be converted to tensors
  let doodles = [];
  let labelsData = [];
  let returnedTensors = [];
  // For all doodles
  for (let i = 0; i < data.length; i++){
    // Let's create a pixel array to store each of them
    let pixels = [];
    // For all pixels in the Doodle
    for (let j = 0; j < dataLength; j++){
      // Let's add the pixel to the pixel array and normalize it (/255) to
      // get a value between 0 and 1.
      pixels[j] = data[i][j] / 255;
    }
    // Add the pixels of this doodle to the doodle array
    doodles[i] = pixels;

    // Let's look what's the doodleLabelList index of the label of this doodle
    let doodleIndex = doodleLabelList.indexOf(labels[i]);

    // Add this index to the labels array
    labelsData[i] = doodleIndex;
  }

  // Let's create the xs tensor with the doodles array
  xs = tf.tensor2d(doodles);
  // We need to use the "oneHot" function of tensorflow to process the labels
  let labelsTensor = tf.tensor1d(labelsData, 'int32');
  ys = tf.oneHot(labelsTensor, doodleLabelList.length).cast('float32');
  // Remove the labelsTensor (which was temporary) to avoid dataleaks
  labelsTensor.dispose();

  // Let's store these tensors in the returned array to return both of them
  // TODO: I know, I can create objects and make something way smarter than
  //       this. I'll do it someday. Maybe.
  returnedTensors[0] = xs;
  returnedTensors[1] = ys;
  console.log(xs.dataSync());
  return returnedTensors;
}


// This function splits the data array into testing and training data
// Be aware that this is not the "training" and "testing" set of the model
// per se, because TensorFlow already has that functionnality (see model.js).
// In this specific case, the testing set is used for the UI to show the
// accuracy of the model on data that he never saw.
function splitData(dataToSplit){
  // Let's do the same thing as the "prepareData" and use dope arrays to
  // return the data instead of using actual objects <3
  let training = [];
  let testing = [];
  let returnedArray = [];

  // For all data
  for (let i = 0; i < numberOfEachDoodle; i++){
    // We need to make an offset because the data length is 784 (for each doodle)
    let offset = (i * dataLength);
    // You can change the "data_proportion" to change the % of training vs
    // testing data.
    let treshold = floor(data_proportion * numberOfEachDoodle);

    // Split the data using the treshold
    if (i < treshold){
      training[i] = dataToSplit.bytes.subarray(offset, offset + dataLength);
    } else {
      testing[i - treshold] = dataToSplit.bytes.subarray(offset, offset + dataLength);
    }
  }
  // Let's store these arrays in the returned array to return both of them
  // TODO: I know, I can create objects and make something way smarter than
  //       this. I'll do it someday. Maybe.
  returnedArray[0] = training;
  returnedArray[1] = testing;
  return returnedArray;
}


// Creates an array that basically only contains the label of the data table
// with the same size. That exists because the data does not show what label
// it actually is, so I need to create an array manually.
function labelData(data, label){
  let labeledData = [];
  for (let i = 0 ; i < data.length; i++){
    labeledData[i] = label;
  }
  return labeledData;
}






// Do you know cancer? No? Read that and you will!
// If you want to make this viable, have fun, be my guest! :D
function initializeData(){
    // Don't panick: this shows that something's happening!
    console.log("Initializing data");

    // Let's split each doodle data in 2 sets (training and testing)
    let shovelSeparated = splitData(shovelData);
    let sawSeparated = splitData(sawData);
    let screwDriverSeparated = splitData(screwdriverData);
    let truckSeparated = splitData(truckData);
    let tractorSeparated = splitData(tractorData);
    let scissorsSeparated = splitData(scissorsData);
    let nailSeparated = splitData(nailData);
    let ladderSeparated = splitData(ladderData);
    let hammerSeparated = splitData(hammerData);
    let drillSeparated = splitData(drillData);

    // Let's label the training and testing data sets
    let shovelLabelTrain = labelData(shovelSeparated[0], "Pelle");
    let shovelLabelTest = labelData(shovelSeparated[1], "Pelle");

    let sawLabelTrain = labelData(sawSeparated[0], "Scie");
    let sawLabelTest = labelData(sawSeparated[1], "Scie");

    let screwDriverLabelTrain = labelData(screwDriverSeparated[0], "Tournevis");
    let screwDriverLabelTest = labelData(screwDriverSeparated[1], "Tournevis");

    let truckLabelTrain = labelData(truckSeparated[0], "Camion");
    let truckLabelTest = labelData(truckSeparated[1], "Camion");

    let tractorLabelTrain = labelData(tractorSeparated[0], "Tracteur");
    let tractorLabelTest = labelData(tractorSeparated[1], "Tracteur");

    let scissorsLabelTrain = labelData(scissorsSeparated[0], "Ciseaux");
    let scissorsLabelTest = labelData(scissorsSeparated[1], "Ciseaux");

    let nailLabelTrain = labelData(nailSeparated[0], "Clou");
    let nailLabelTest = labelData(nailSeparated[1], "Clou");

    let ladderLabelTrain = labelData(ladderSeparated[0], "Échelle");
    let ladderLabelTest = labelData(ladderSeparated[1], "Échelle");

    let hammerLabelTrain = labelData(hammerSeparated[0], "Marteau");
    let hammerLabelTest = labelData(hammerSeparated[1], "Marteau");

    let drillLabelTrain = labelData(drillSeparated[0], "Drill");
    let drillLabelTest = labelData(drillSeparated[1], "Drill");

    // Let's merge all these wonderful arrays into a single huge one
    training_labels = training_labels.concat(shovelLabelTrain);
    training_labels = training_labels.concat(sawLabelTrain);
    training_labels = training_labels.concat(screwDriverLabelTrain);
    training_labels = training_labels.concat(truckLabelTrain);
    training_labels = training_labels.concat(tractorLabelTrain);
    training_labels = training_labels.concat(scissorsLabelTrain);
    training_labels = training_labels.concat(nailLabelTrain);
    training_labels = training_labels.concat(ladderLabelTrain);
    training_labels = training_labels.concat(hammerLabelTrain);
    training_labels = training_labels.concat(drillLabelTrain);

    // Same logic
    testing_labels = testing_labels.concat(shovelLabelTest);
    testing_labels = testing_labels.concat(sawLabelTest);
    testing_labels = testing_labels.concat(screwDriverLabelTest);
    testing_labels = testing_labels.concat(truckLabelTest);
    testing_labels = testing_labels.concat(tractorLabelTest);
    testing_labels = testing_labels.concat(scissorsLabelTest);
    testing_labels = testing_labels.concat(nailLabelTest);
    testing_labels = testing_labels.concat(ladderLabelTest);
    testing_labels = testing_labels.concat(hammerLabelTest);
    testing_labels = testing_labels.concat(drillLabelTest);

    // Same logic
    training_data = training_data.concat(shovelSeparated[0]);
    training_data = training_data.concat(sawSeparated[0]);
    training_data = training_data.concat(screwDriverSeparated[0]);
    training_data = training_data.concat(truckSeparated[0]);
    training_data = training_data.concat(tractorSeparated[0]);
    training_data = training_data.concat(scissorsSeparated[0]);
    training_data = training_data.concat(nailSeparated[0]);
    training_data = training_data.concat(ladderSeparated[0]);
    training_data = training_data.concat(hammerSeparated[0]);
    training_data = training_data.concat(drillSeparated[0]);

    // Same logic (who would have guessed)
    testing_data = testing_data.concat(shovelSeparated[1]);
    testing_data = testing_data.concat(sawSeparated[1]);
    testing_data = testing_data.concat(screwDriverSeparated[1]);
    testing_data = testing_data.concat(truckSeparated[1]);
    testing_data = testing_data.concat(tractorSeparated[1]);
    testing_data = testing_data.concat(scissorsSeparated[1]);
    testing_data = testing_data.concat(nailSeparated[1]);
    testing_data = testing_data.concat(ladderSeparated[1]);
    testing_data = testing_data.concat(hammerSeparated[1]);
    testing_data = testing_data.concat(drillSeparated[1]);
    // Don't panick: this shows that something's happening!
    console.log("Done");
}
