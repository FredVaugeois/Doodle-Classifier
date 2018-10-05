// This program is highly inspired by the Doodle Classifier made by
// Daniel Shiffman in "The coding train" as part of his toy neural
// network library. This is the Tensorflow version of his work with
// some tweaks and modifications.

// https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/examples/doodle_classification



// Cree les tableaux de donnees
function prepareData(data, labels){
  // On cree des tableaux qui vont contenir nos donnees
  let doodles = [];
  let labelsData = [];
  let returnedTensors = [];

  // Pour tous les dessins
  for (let i = 0; i < data.length; i++){
    // On cree un tableau qui contiendra les pixels du dessins
    let pixels = [];
    // Pour tous les pixels du dessins
    for (let j = 0; j < dataLength; j++){
      // On ajoute chaque pixel a ce tableau
      pixels[j] = data[i][j] / 255;
    }
    // On ajoute les pixels de ce dessins
    doodles[i] = pixels;

    // On regarde quel est le label de ce doodle
    let doodleIndex = doodleLabelList.indexOf(labels[i]);

    // On ajoute le vecteur label de ce doodle dans notre tableau label
    labelsData[i] = doodleIndex;
  }

  // On cree un tensor pour les xs
  xs = tf.tensor2d(doodles);
  // On en cree un pour les ys en utilisant oneHot
  let labelsTensor = tf.tensor1d(labelsData, 'int32');
  ys = tf.oneHot(labelsTensor, doodleLabelList.length).cast('float32');
  // On elimine notre tensor de label (on ne s'en sert plus)
  labelsTensor.dispose();

  // On retourne nos Tensors
  returnedTensors[0] = xs;
  returnedTensors[1] = ys;
  return returnedTensors;
}


// Separe les donnees d'entrainement et de testing
function splitData(dataToSplit){
  let training = [];
  let testing = [];
  let returnedArray = [];

  for (let i = 0; i < totalData; i++){
    let offset = (i * dataLength);
    let treshold = floor(data_proportion * totalData);
    if (i < treshold){
      training[i] = dataToSplit.bytes.subarray(offset, offset + dataLength);
    } else {
      testing[i - treshold] = dataToSplit.bytes.subarray(offset, offset + dataLength);
    }
  }
  returnedArray[0] = training;
  returnedArray[1] = testing;
  return returnedArray;
}


// Cree un tableau contenant de taille egale au tableau recu avec pour seule
// donnee le label qui y est associe
function labelData(data, label){
  let labeledData = [];
  for (let i = 0 ; i < data.length; i++){
    labeledData[i] = label;
  }
  return labeledData;
}






// Cancer


function initializeData(){
    console.log("Initializing data");
    // On separe chaque donnee en 2
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

    // On cree un tableau label pour chaque data "splitee"
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

    // On cree un seul tableau label d'entrainement
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

    // On cree un seul tableau label de test
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

    // On cree un seul tableau de data d'entrainement
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

    // On cree un seul tableau de data de test
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
    console.log("Done");
}
