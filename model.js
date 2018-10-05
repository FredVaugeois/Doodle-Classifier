// This program is highly inspired by the Doodle Classifier made by
// Daniel Shiffman in "The coding train" as part of his toy neural
// network library. This is the Tensorflow version of his work with
// some tweaks and modifications.

// https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/examples/doodle_classification


// Go see the tensforflow.js API reference and use CTRL+F to find the activation
// functions, optimizers, etc.

// https://js.tensorflow.org/api/0.13.0/


// These are the wonderful variables you can change to actually toy with Tensorflow
// and see that kind of neural networks you can make with this library. If you're
// just the kind of person that doesn't want to learn how to mess with the data
// of a ML project, this is the part that you'll love and cherish.



// This is the number of images of each doodle.
// That means the total number of images is 6000 x (number of doodles).
let numberOfEachDoodle = 6000;

// Doodle list (you can change this bad boy). If you change it, though, you'll
// need to load some more data in dataPrep and add the binary file to the project
// from google quick draw. Go see the README file in the github repo for a
// link to a tutorial on how to do it.
// Just kidding: https://www.youtube.com/watch?v=gX7U6WA7Ffk
let doodleLabelList = [
  'Shovel',
  'Saw',
  'Screwdriver',
  'Truck',
  'Tractor',
  'Scissors',
  'Nail',
  'Ladder',
  'Hammer',
  'Drill'
]

// Hidden layers
// You can add and remove layers or change their neurons as you wish.
// This is the best combination I've found yet: three layers 256-128-64
// You can also change the hidden layers' activation function or even make
// a different one for each one of them. Won't make a tutorial on how to do
// that, because dude, if you're looking at this code as of right now, you're
// better than that.

//const hiddenLayer1_Units = 512;   // -> This is commented because it sucked.
const hiddenLayer2_Units = 256;
const hiddenLayer3_Units = 128;
const hiddenLayer4_Units = 64;
const hiddenLayers_Activation = "sigmoid";


// Output layer
// You can change the output layer activation over here! By the way, the output
// layer size is already set as the length of the doodleLabelList. So yeah.
const outputLayer_Activation = "softmax";



// Model.compile (creates the model)
// You can change the optimizer function, the loss function and the learning
// rate here. This is probably the most important modifications you can do.
// Sequantial means that the outputs of the previous layer is the input of the
// actual layer.
const model_Type = tf.sequential();
const model_LearningRate = 0.10;
const model_Optimizer = tf.train.adagrad(model_LearningRate);
const model_Loss = "meanSquaredError";



// Model.fit (trains the model)
// You can change all these parameters, which are actually pretty important too.
// Don't change the doshuffle because that would be stupid: the AI needs to be
// fed data randomly, not in the same order for each epoch or he'll actually
// base his decision on the order in which the doodle appears.
// The validation split is the % of training vs testing data (this is managed
// by TF.js and has nothing to do with my data split, which is only used for
// the UI). Epochs: Number of times the whole data set is going to be used for
// training. Batchsize: Number of doodles tested at the same time (faster than
// doing one at the time, but less precise)
const training_DoShuffle = true;
const training_ValidationSplit = 0.1;
const training_BatchSize = 8;
const training_NumEpochs = 15;

// Training vs testing data FOR THE UI ONLY
const data_proportion = 0.9;


// Method that build the model (Yeah that's why I called it that way)
function buildModel(){
  // Let's use the model type sequential for now
  let tempModel = model_Type;


  // Let's create the hidden layers of the model

  /*
  const hiddenLayer1 = tf.layers.dense({
    units: hiddenLayer1_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });
  */ // This is commented because it sucked.

  const hiddenLayer2 = tf.layers.dense({
    units: hiddenLayer2_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });

  const hiddenLayer3 = tf.layers.dense({
    units: hiddenLayer2_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });

  const hiddenLayer4 = tf.layers.dense({
    units: hiddenLayer2_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });

  // Let's create the output layer (see, as I said earlier, I use the
  // doodleLabelList's length for its size. I'm smart AF).
  const output = tf.layers.dense({
    units: doodleLabelList.length,
    activation: outputLayer_Activation
  })

  // Let's add all these layers to the model. By the way, the order is actually
  // important. Don't add the output layer at the beginning... pls.
  //tempModel.add(hiddenLayer1);
  tempModel.add(hiddenLayer2);
  tempModel.add(hiddenLayer3);
  tempModel.add(hiddenLayer4);
  tempModel.add(output);

  // Let's complile this bad boy (basically creates the NN with the configs
  // that we just set)
  tempModel.compile({
    optimizer: model_Optimizer,
    loss: model_Loss,
    metrics: ['accuracy']
  })
  // Return the model!
  return tempModel;
}

// Function that is used to do what? The training. Yeah!
// Btw, it's async because tensorflow uses promises since it transfers data
// from the CPU to the GPU and vice versa, which takes time if you have a toaster.
async function train(){
  // Let's call the TF.js function fit, which is basically a fancy word for
  // train. The model will "fit" its training data. How cute.
  // Btw again, await tells JS to wait for this function to be over before
  // doing anything else. Because promises are fun to work with.
  await model.fit(xs, ys, {
    // Training parameters (you set them earlier)
    shuffle: training_DoShuffle,
    validationSplit: training_ValidationSplit,
    batchSize: training_BatchSize,
    epochs: training_NumEpochs,

    // Training callbacks
    callbacks:{
      // When an epoch ends, we log the number of the epoch (remove + 1 if you're
      // butthurt that I don't start at 0), the loss of this epoch and the
      // accuracy at this epoch. If this starts to stabilize too much, that means
      // that it can't really get better, so you should consider lowering the
      // epoch number.
      onEpochEnd: (epochs, logs) => {
        console.log('Epoch: ' + (epochs + 1));
        console.log('Loss: ' + logs.loss);
        console.log('Accuracy: ' + logs.acc.toFixed(2));
      }
    }
  });
}
