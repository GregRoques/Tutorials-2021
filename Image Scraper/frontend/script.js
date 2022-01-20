const responseDiv = document.getElementById("response");
const button = document.getElementById("instaFormButton");
let isError = false;

document.getElementById("instaForm").addEventListener("submit", (e) => {
  e.preventDefault();
  clearPrevValues();
  const value = e.target.instaUrl.value;
  if (!value) return;
  button.disabled = true;
  const url = "http://localhost:2000/scrapper";
  const params = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: value,
    }),
  };
  fetch(url, params)
    .then((res) => {
      if (!res.ok) {
        isError = true;
      }
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      if (isError) {
        return throwError(data);
      }

      return imageUpdate(data);
    })
    .catch((err) => {
      console.log(`ERROR: ${err}`);
      throwError({ msg: "Error: Check Logs for Details" });
    })
    .finally(() => {
      isError = false;
      document.getElementById("instaUrl").value = "";
      button.disabled = false;
    });
});

const throwError = (err) => {
  const paragraph = document.createElement("p");
  const errMsg = document.createTextNode(err.msg);
  paragraph.appendChild(errMsg);
  paragraph.classList.add("errMsgStyle");

  responseDiv.appendChild(paragraph);
};

const clearPrevValues = () => {
  const resDiv = document.getElementById("response");
  if (resDiv) {
    resDiv.innerHTML = "";
  }
};

const imageUpdate = (images) => {
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("imageBox");
  images.forEach((img, i) => {
    console.log(img);
    const image = document.createElement("img");
    image.src = img;
    imageContainer.appendChild(image);
    if (i === images.length - 1) {
      responseDiv.appendChild(imageContainer);
    }
  });
};
