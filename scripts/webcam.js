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
  webcam = new tmImage.Webcam(1200, 600, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  labelContainer = document.getElementById("label-container");
  document.getElementById("webcam-container").appendChild(webcam.canvas);

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
  let result = Object.keys(dict).reduce(function (a, b) {
    return dict[a] > dict[b] ? a : b;
  });

  if (result == "Compostable Foods") {
    document.getElementById("compost_box").style.backgroundColor = "#19c433";
    document.getElementById("cans_box").style.backgroundColor = "#ebebe2";
    document.getElementById("paper_box").style.backgroundColor = "#ebebe2";
    document.getElementById("garbage_box").style.backgroundColor = "#ebebe2";
  } else if (result == "Recyclable Cans/Plastic") {
    document.getElementById("cans_box").style.backgroundColor = "#1d7acf";
    document.getElementById("compost_box").style.backgroundColor = "#ebebe2";
    document.getElementById("paper_box").style.backgroundColor = "#ebebe2";
    document.getElementById("garbage_box").style.backgroundColor = "#ebebe2";
  } else if (result == "Paper") {
    document.getElementById("paper_box").style.backgroundColor = "#c7cf1d";
    document.getElementById("compost_box").style.backgroundColor = "#ebebe2";
    document.getElementById("cans_box").style.backgroundColor = "#ebebe2";
    document.getElementById("garbage_box").style.backgroundColor = "#ebebe2";
  } else if (result == "Garbage") {
    document.getElementById("garbage_box").style.backgroundColor = "#5b5c4e";
    document.getElementById("compost_box").style.backgroundColor = "#ebebe2";
    document.getElementById("cans_box").style.backgroundColor = "#ebebe2";
    document.getElementById("paper_box").style.backgroundColor = "#ebebe2";
  } else {
    document.getElementById("compost_box").style.backgroundColor = "#ebebe2";
    document.getElementById("cans_box").style.backgroundColor = "#ebebe2";
    document.getElementById("paper_box").style.backgroundColor = "#ebebe2";
    document.getElementById("garbage_box").style.backgroundColor = "#ebebe2";
  }
}

//if (result == "Other") {
  //   labelContainer.innerHTML = "";
  //   labelContainer.style.background = "none";
  // } else if (result == "Compostable Foods") {
  //   labelContainer.innerHTML = result;
  //   labelContainer.style.background = "green";
  // }
  // else if (result == "Recycable Cans/Plastic") {
  //   labelContainer.innerHTML = result;
  //   labelContainer.style.background = "blue";

  // }
  // else if (result == "Paper") {
  //   labelContainer.innerHTML = result;
  //   labelContainer.style.background = "yellow";
  // }
  // else if (result == "Garbage") {
  //   labelContainer.innerHTML = result;
  //   labelContainer.style.background = "grey";
  // }