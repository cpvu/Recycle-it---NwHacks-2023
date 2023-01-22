// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "../models/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(screen.width - 100, screen.height - 100, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  // for (let i = 0; i < maxPredictions; i++) {
  //   // and class labels 
  //   labelContainer.appendChild(document.createElement("div"));
  // }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  setInterval(window.requestAnimationFrame(loop), 1000);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  let dict = {};
  for (let i = 0; i < maxPredictions; i++) {
    dict[prediction[i].className] = prediction[i].probability.toFixed(2);
    // if (prediction[i].probability.toFixed(2) > highest) {
    //   highest = prediction[i].probability.toFixed(2);
    //   classPrediction = prediction[i].className;
    // }
    //prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //labelContainer.innerHTML = classPrediction;
  }
  let result = Object.keys(dict).reduce(function(a, b){ return dict[a] > dict[b] ? a : b });
  labelContainer.innerHTML = result;
}
