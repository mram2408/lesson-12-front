class Cars {
  constructor(containerId, itemsPerPage) {
    this.containerId = containerId;
    this.itemsPerPage = itemsPerPage;
    this.page = 0;
    this.loading = false;
    this.carsCount;
  }
  async loadItems() {
    if (this.itemsPerPage * this.page > this.carsCount) return;
    if (this.loading) return;
    this.loading = true;

    const container = document.querySelector(this.containerId);
    const loading = document.createElement("h3");
    loading.textContent = "Завантаження даних..";
    const loadingContainer = document.querySelector("#loading");
    loadingContainer.append(loading);

    const queryParams = new URLSearchParams(window.location.search);
    const queryString = queryParams.toString() ?? "";
    console.log(queryString);

    const data = await RequestManager.fetchData(
      `/autopark?page=${this.page}&perPage=${this.itemsPerPage}&` + queryString
    );
    this.carsCount = data.count;
    this.loading = false;
    loading.remove();
    for (const car of data.carsList) {
      container.append(this.getCard(car));
    }
    this.page++;
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
  async init() {
    this.loadItems();
    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        this.loadItems();
      }
    });
  }
}

new Cars("#cars-container", 6).init();
