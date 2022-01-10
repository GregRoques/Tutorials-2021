# Description

Experimenting with facial-detection and facial-recognition APIs...simply out of curiousity.

I am using the below tutorials as a guide to get started:

- [Smashing Magazine](https://www.smashingmagazine.com/2020/06/facial-recognition-web-application-react/)

# Technologies

- HTML/CSS/JavaScript
- React

# Packages

## Style Guide

- npm install eslint install-peerdeps eslint-plugin-react prettier --save-dev
  - ./node_modules/.bin/eslint --init (selected AirBnB style/eslint.json)

See .prettierrc and .eslintrc.json files for more specifics

## Front End

- npx i create-react-app
- npm install tachyons (this is a CSS interface library...more info here: [tachyons.io](https://tachyons.io/) )
- npm i clarifai
- npm i sweetalerts2

## APIs

- Test 1: https://www.clarifai.com/

## Omitted Files/Folders Needed

In the "src" folder, I use my ".gitignore" file to hide a folder called "keys", as it contains some personal information. If you decide to test out this exercise for yourself, you will want to add a folder with this name to your "src" folder, and include the following files:

- **clarifaiKey.js:** exports your Clarifia API key (**const cKey**) and custom Clarifai workflow ID (**const workflowId**).
- **faceArray.js:** exports a variable containing the 512-count array coordinates for a specific face ( or faces) you will try to detect when you submit an image url.

# Logic

## First, make a Clarifai workflow

Clarifai's recognition model is frighteningly deep, and is able to recognize scenarios in addition to individuals including more than 1,000 different types of food as well as 500+ items and settings specific to wedding photos. For this project, I want our API call to return both a 512-point vector map (a 512-character array of numbers), as well as any demographic data it can estimate on the individuals in our photo.

After creating your free test account, create an application (or click into the system-generated 'my-first-application' as I did). Next, under 'App Workflows', click on 'Create New Workflow'. Give your workflow a name under 'Workflow ID', and select the 'Face (detect-embed)' and 'Demographics (detect-concept)' models. Make a copy of your workflow ID, as you will need to reference it when calling your api with in your code.

![Create a workflow](/readMe/3.JPG)

## Face Calculation in App.js

```
const image = document.getElementById('inputimage');
const width = Number(image.width);
const height = Number(image.height);

clarifaiFaces.map((face, i) => {
    const faceInfo = face.region_info.bounding_box;
    box[i] = {
      stats: face.data.concepts ? formatStats(Object.values(face.data.concepts)) : 'N/A',
      leftCol: faceInfo.left_col * width,
      topRow: faceInfo.top_row * height,
      rightCol: width - faceInfo.right_col * width,
      bottomRow: height - faceInfo.bottom_row * height,
    };
  });

  this.setState({
    box,
  });
};
```

The calculateFaceLocation function recieves the response we get from the API when we call it in the onSubmit method. Inside the calculateFaceLocation method, we assign image to the element object we get from calling document.getElementById("inputimage") which we use to perform some calculation.

- **leftCol:** clarifaiFace.left_col is the % of the width multiply with the width of the image then we would get the actual width of the image and where the left_col should be.
- **topRow:** clarifaiFace.top_row is the % of the height multiply with the height of the image then we would get the actual height of the image and where the top_row should be.
- **rightCol:** This subtracts the width from (clarifaiFace.right_col width) to know where the right_Col should be.
- **bottomRow:** This subtract the height from (clarifaiFace.right_col height) to know where the bottom_Row should be.

## Facial Recognition in App.js

For each face the Clarifai API recognizes, I wanted it to see if I was in any of the photos. The Face (detect-embed) model returns a 512-character array mapping out an individual's face; having previously saved this array taken from my LinkedIn profile pic, (saved and exported from src > keys > faceArray.js), I use the below function to see if the two faces are similar. There are variations in a person's face ranging from picture to picture, so I did not want to do an exact compare of each character as this would return false — this function calculates an approximation and only returns a 'true' value if the chance the person is me is at least 90%.

There are no doubt more sophisticated mapping packages out there (such as [numjs](https://github.com/nicolaspanel/numjs)), but I wanted to keep the focus of this project on the facial recognition APIs, so I opted for this a basic solution for illustration purposes here. Actually, having tested this on nearly three-dozen photos from different social media pages, it recognizes me everytime and never mistakes someone else for me.

```
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
```

# Images

You can see the detection at work below, or [click here to watch a video demo](https://www.youtube.com/watch?v=NqeQZmqkXho&list=PLM2GdNHvfSCHPHRWbFlOst-EK8K4wkv5f&index=6).

![Squad at Jazz Fest](/readMe/1.JPG)

![Squad on hike in Colorado](/readMe/2.JPG)
