
// This program is highly inspired by the Doodle Classifier made by
// Daniel Shiffman in "The coding train" as part of his toy neural
// network library. This is the Tensorflow version of his work with
// some tweaks and modifications.

// https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/examples/doodle_classification



// Public variables
let totalData = 6000;
let dataLength = 784;

// Liste des doodles que l'on va traiter
let doodleLabelList = [
  'Pelle',
  'Scie',
  'Tournevis',
  'Camion',
  'Tracteur',
  'Ciseaux',
  'Clou',
  'Échelle',
  'Marteau',
  'Drill'
]


// Tableaux de donnees
let training_data = [];
let testing_data = [];
let training_labels = [];
let testing_labels = [];

// Tableaux de bytes loades par loadBytes
let shovelData = {};
let sawData = {};
let screwdriverData = {};
let truckData = {};
let tractorData = {};
let scissorsData = {};
let nailData = {};
let ladderData = {};
let hammerData = {};
let drillData = {};


// Modele
let model;

// Tensors
xs = {};
ys = {};
testing_xs = {};
testing_ys = {};

// Fonction qui va loader les fichiers de donnees ou sont stockes les doodles
function preload(){
  // On load les donnees
  shovelData = loadBytes('./datasets/shovel.bin');
  sawData = loadBytes('./datasets/saw.bin');
  screwdriverData = loadBytes('./datasets/screwdriver.bin');
  truckData = loadBytes('./datasets/truck.bin');
  tractorData = loadBytes('./datasets/tractor.bin');
  scissorsData = loadBytes('./datasets/scissors.bin');
  nailData = loadBytes('./datasets/nail.bin');
  ladderData = loadBytes('./datasets/ladder.bin');
  hammerData = loadBytes('./datasets/hammer.bin');
  drillData = loadBytes('./datasets/drill.bin');
}

// Fonction de setup pour p5.js
function setup(){
  // On cree notre interface
  createCanvas(280, 280);
  background(0);

  // On initialise les donnees
  initializeData();

  console.log("Creating training tensors");

  // On cree les tensors pour les donnees d'entrainement et de tests
  let trainingTensors = prepareData(training_data, training_labels);
  console.log("Done");
  console.log("Creating testing tensors");
  let testingTensors = prepareData(testing_data, testing_labels);
  console.log("Done");

  // On affecte nos xs et ys
  xs = trainingTensors[0];
  ys = trainingTensors[1];
  testing_xs = testingTensors[0];
  testing_ys = testingTensors[1];

  // On construit le modele
  console.log("Creating model");
  // On construit notre modele
  model = buildModel();
  console.log("Done");


  console.log("Training model");
  // On entraine notre modele
  train().then(() => {
      console.log("Done");
      // On evalue notre modele
      const evaluation = model.evaluate(testing_xs, testing_ys);
      evaluation[0].print();
  });

  // On s'amuse avec notre modele!
  let guessButton = select('#guess');
  // Si on appuie sur le bouton "Guess"
  guessButton.mousePressed(function() {
    // Declaration des variables
    let inputs = [];
    let inputImage = [];

    // On prend l'image dessinee, on la redimensionne et on en prend les pixels
    let img = get();
    img.resize(28, 28);
    img.loadPixels();

    // Pour tous les pixels, on inverse la couleur pour blanc sur noir et
    // on normalise la valeur que cela donne
    for (let i = 0; i < dataLength; i++) {
      let bright = img.pixels[i * 4];
      inputs[i] = bright / 255.0;
    }
    // On cree un tableau 2D avec les pixels de cette image
    inputImage[0] = inputs;

    // On demande a notre modele de predire a quel indice du tableau cela
    // appartient et on affiche le resultat
    let tensorToPredict = tf.tensor2d(inputImage);
    let guess = model.predict(tensorToPredict);
    let argMax = guess.argMax(1);
    let index = argMax.dataSync()[0];

    // On va voir a quoi cela appartient!
    let classification = doodleLabelList[index];
    console.log(classification);
  });


  // Bouton pour effacer le dessin actuel
  let clearButton = select('#clear');
  clearButton.mousePressed(function() {
    background(0);
  });




  // Bouton pour aller chercher un dessin dans le testing data
  let generateButton = select("#generate");
  generateButton.mousePressed(function() {
    background(0);

    // On genere on nombre aleatoire entre 0 et le nombre de donnees de test
    let randomIndex = floor(random((totalData * 10) * (1-data_proportion)));
    let offset = randomIndex * dataLength;

    // On va chercher l'objet qui correspond a cette valeur
    let doodlePixels = [];
    doodlePixels = testing_xs.dataSync().subarray(offset, offset + dataLength);

    // On cree l'objet d'image
    let img = createImage(28, 28);
    img.loadPixels();

    console.log(randomIndex);
    // On affecte les bons pixels
    for (let i = 0; i < dataLength; i++){
      let val = doodlePixels[i] * 255;
      img.pixels[i*4 + 0] = val;
      img.pixels[i*4 + 1] = val;
      img.pixels[i*4 + 2] = val;
      img.pixels[i*4 + 3] = 255;
    }
    // On met a jours les pixels et on affiche l'image
    img.updatePixels();
    img.resize(280, 280);
    image(img, 0, 0);

    let labelsResult = testing_ys.dataSync().subarray(randomIndex * doodleLabelList.length, (randomIndex * doodleLabelList.length) + doodleLabelList.length);

    let doodleIndex;
    // Pour tout le vecteur resultant
    for(let i = 0; i < labelsResult.length; i++){
      if(labelsResult[i] === 1){
        doodleIndex = i;
      }
    }
    // On indque ce que c'est reellement cense etre
    console.log(doodleLabelList[doodleIndex]);
  });
}


// Methode draw (qui est executee non-stop)
function draw() {
  strokeWeight(8);
  stroke(255);

  // Si on appuie sur la souris, on dessine une ligne a cet endroit. C'est
  // ce qui permet de faire des beaux petits dessins
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
