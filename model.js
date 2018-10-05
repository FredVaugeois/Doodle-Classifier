// This program is highly inspired by the Doodle Classifier made by
// Daniel Shiffman in "The coding train" as part of his toy neural
// network library. This is the Tensorflow version of his work with
// some tweaks and modifications.

// https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/examples/doodle_classification


// Variables a changer dans le cas ou on veut faire des tests

// Hidden layer
//const hiddenLayer1_Units = 512;
const hiddenLayer2_Units = 256;
const hiddenLayer3_Units = 128;
const hiddenLayer4_Units = 64;
const hiddenLayers_Activation = "sigmoid";

// Output layer
const outputLayer_Activation = "softmax";

// Model.compile
const model_LearningRate = 0.10;
const model_Optimizer = tf.train.adagrad(model_LearningRate);
const model_Loss = "meanSquaredError";

// Model.fit
const training_DoShuffle = true;
const training_ValidationSplit = 0.1;
const training_BatchSize = 8;
const training_NumEpochs = 20;

// Training vs testing data
const data_proportion = 0.8;


// Methode qui va contruire notre modele
function buildModel(){
  // On veut un modele sequentiel
  let tempModel = tf.sequential();

  /*
  // On cree nos layers du reseau de neurone
  const hiddenLayer1 = tf.layers.dense({
    units: hiddenLayer1_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });
  */

  // On cree un autre hidden layer
  const hiddenLayer2 = tf.layers.dense({
    units: hiddenLayer2_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });


  // On cree un autre hidden layer
  const hiddenLayer3 = tf.layers.dense({
    units: hiddenLayer2_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });

  // On cree un autre hidden layer
  const hiddenLayer4 = tf.layers.dense({
    units: hiddenLayer2_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });

  const output = tf.layers.dense({
    units: doodleLabelList.length,
    activation: outputLayer_Activation
  })

  // On ajoute les layers a notre modele
  //tempModel.add(hiddenLayer1);
  tempModel.add(hiddenLayer2);
  tempModel.add(hiddenLayer3);
  tempModel.add(hiddenLayer4);
  tempModel.add(output);

  // On compile notre modele
  tempModel.compile({
    optimizer: model_Optimizer,
    loss: model_Loss,
    metrics: ['accuracy']
  })
  // On retourne le modele
  return tempModel;
}

// Fonction d'entrainement du modele
async function train(){
  // On appelle la methode fit pour se rapprocher du model ideal
  await model.fit(xs, ys, {
    // Parametres de l'entrainement
    shuffle: training_DoShuffle,
    validationSplit: training_ValidationSplit,
    batchSize: training_BatchSize,
    epochs: training_NumEpochs,

    // Gestion des retour d'entrainement
    callbacks:{
      onEpochEnd: (epochs, logs) => {
        console.log('Epoch: ' + (epochs + 1));
        console.log('Loss: ' + logs.loss);
        console.log('Accuracy: ' + logs.acc.toFixed(2));
      }
    }
  });
}
