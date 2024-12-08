class Cars {
  constructor(containerId) {
    this.containerId = containerId;
  }
  async getList() {
    const queryParams = new URLSearchParams(window.location.search);
    const queryString = queryParams.toString();
    console.log(queryString);

    return await RequestManager.fetchData(`/autopark?${queryString}`);
  }
  getCard(carObj) {
    const card = document.createElement("div");
    card.className = "car-card";

    const img = document.createElement("img");
    img.setAttribute("src", `data:image;base64,${carObj.imgSrc}`);
    card.append(img);

    const title = document.createElement("h3");
    title.textContent = `${carObj.make} ${carObj.model}`;
    card.append(title);

    const year = document.createElement("div");
    year.className = "car-year";
    year.textContent = `Рік випуску: ${carObj.year}`;
    card.append(year);

    const numberPlate = document.createElement("div");
    numberPlate.className = "number-plate";
    const label = document.createElement("img");
    label.setAttribute("src", "images/image.png");
    numberPlate.append(label);
    const number = document.createElement("div");
    number.textContent = carObj.numberPlate;
    numberPlate.append(number);
    card.append(numberPlate);

    const ownerName = document.createElement("div");
    ownerName.textContent = carObj.owner?.name || "Немає власника";
    card.append(ownerName);

    const ownerAddress = document.createElement("div");
    ownerAddress.textContent = carObj.owner?.address;
    card.append(ownerAddress);

    return card;
  }
  async render() {
    const container = document.querySelector(this.containerId);
    const loading = document.createElement("h3");
    loading.textContent = "Завантаження даних..";
    container.append(loading);

    const data = await this.getList();
    const carsList = data.carsList;
    console.log(data);

    new Pagination("#pagination", data.count).render();

    loading.remove();

    for (const car of carsList) {
      container.append(this.getCard(car));
    }
  }
}

new Cars("#cars-container").render();
