function getAmazonData() {
  const keyword = document.getElementById("keyword").value;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const resultDiv = document.getElementById("results");
        renderProducts(JSON.parse(xhr.responseText), resultDiv);

        const searchElement = document.getElementById("search");
        searchElement.style.display = "none";
      } else {
        console.error(
          "Error fetching Amazon search results:",
          xhr.status,
          xhr.statusText
        );
      }
    }
  };
  xhr.send();
}
function renderProducts(data, container) {
  container.innerHTML = "";
  for (let i = 1; i < data.results.length; i++) {
    const product = data.results[i];

    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("product-title");
    titleDiv.textContent = product.title;

    const ratingDiv = document.createElement("div");
    ratingDiv.classList.add("product-rating");
    ratingDiv.textContent = `Rating: ${product.rating}`;

    const reviewsDiv = document.createElement("div");
    reviewsDiv.classList.add("product-reviews");
    reviewsDiv.textContent = `Reviews: ${product.reviews}`;

    const imageDiv = document.createElement("div");
    const image = document.createElement("img");
    image.src = product.imageURL;
    imageDiv.appendChild(image);

    productDiv.appendChild(titleDiv);
    productDiv.appendChild(ratingDiv);
    productDiv.appendChild(reviewsDiv);
    productDiv.appendChild(imageDiv);

    container.appendChild(productDiv);
  }
}
