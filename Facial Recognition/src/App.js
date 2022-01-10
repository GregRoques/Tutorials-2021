import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Swal from 'sweetalert2';
import ImageSearchForm from './Components/ImageSearchForm/ImageSearchForm';
import FaceDetect from './Components/FaceDetect/FaceDetect';
import { cKey, workflowId } from './keys/clarifaiKey'; // Clarifai key, name of clarifai workflow
import { gregFaceArray } from './keys/faceArray'; // 512 count array for representing points from my face..for face detection match
import './App.css';
import { getNodeText } from '@testing-library/react';

const app = new Clarifai.App({
  apiKey: cKey,
});

class App extends Component {
  state = {
    input: '',
    imageUrl: '',
    detectBox: {},
    demoBox: {},
  };

  calculateFaceLocations = (clarifaiFaces) => {
    //get image dimensions
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    let box = {}; // holding our faces
    // console.log(clarifaiFaces);
    clarifaiFaces.map((face, i) => {
      //map through faces
      const faceInfo = face.region_info.bounding_box;
      box[i] = {
        isGreg: face.data.embeddings ? this.faceDetect(face.data.embeddings[0].vector) : false,
        leftCol: faceInfo.left_col * width,
        topRow: faceInfo.top_row * height,
        rightCol: width - faceInfo.right_col * width,
        bottomRow: height - faceInfo.bottom_row * height,
      };
    });
    console.log(box);
    return box;
  };

  faceDetect = (B) => {
    const A = gregFaceArray;
    const arrayTotal = gregFaceArray.length;
    let count = 0;
    for (let i = 0; i < arrayTotal; i++) {
      if (Number.parseFloat(A[i]).toFixed(2) * 100 - B[i].toFixed(2) * 100 < 5) {
        count++;
      }
    }
    const percentage = Math.round((count / arrayTotal) * 100);
    return percentage;
  };

  formatStats = (results) => {
    console.log(results);
    let box = {};
    results.map((result, i) => {
      const clarifaiFaces = [result];
      box[i] = {
        bounding_box: this.calculateFaceLocations(clarifaiFaces),
        demographics: {},
      };
      const concepts = result.data.concepts;
      //console.log(concepts);
      concepts.map((concept) => {
        if (box[i].demographics[concept.vocab_id]) {
          if (concept.value > box[i].demographics[concept.vocab_id].value) {
            box[i].demographics[concept.vocab_id] = {
              name: concept.name,
              value: concept.value,
            };
          }
        } else {
          box[i].demographics[concept.vocab_id] = {
            name: concept.name,
            value: concept.value,
          };
        }
      });
    });
    // console.log(box);
    return box;
  };

  onInputChange = (e) => {
    // stores url link until submitted
    this.setState({
      input: e.target.value,
    });
  };

  onSubmit = () => {
    // submits url when ready
    const { input } = this.state;
    this.setState({
      imageUrl: input,
      detectBox: {},
      demoBox: {},
    });
    app.workflow
      .predict(workflowId, input)
      .then((res) => {
        console.log(res);
        const clarifaiFaces = res.results[0].outputs[0].data.regions; // face detection info
        const clarifaiDemos = res.results[0].outputs[1].data.regions; // age, gender, race demographics

        this.setState({
          detectBox: this.calculateFaceLocations(clarifaiFaces), // calculates and sorts face locations and inidividaul demographics
          demoBox: this.formatStats(clarifaiDemos), // formats individual demographic estimates returned (age, gender, race)
        });
      })
      .catch((err) => {
        console.log(`ERROR: ${err}`);
        // throw alert if error is returned
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'We could not analyze this url or image. Please submit a new url.',
        });
        //clears out state so a new url can be sumitted
        this.setState({
          input: '',
          imageUrl: '',
          detectBox: {},
          demoBox: {},
        });
      });
  };

  render() {
    const { detectBox, demoBox, imageUrl } = this.state;
    return (
      <div className="App">
        <ImageSearchForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
        <FaceDetect box={detectBox} profile={demoBox} imageUrl={imageUrl} />
      </div>
    );
  }
}
export default App;
