class Card {
  constructor({ imageUrl }) {
    this.imageUrl = imageUrl;
    this.#init();
  }

  #startPoint = null;
  #offsetX = 0;
  #offsetY = 0;
  #isDragging = false;

  #init = () => {
    this.element = document.createElement("div");
    this.element.classList.add("card");

    // การ์ดหลัก
    this.imgElement = document.createElement("img");
    this.imgElement.src = this.imageUrl;
    this.element.append(this.imgElement);

    // การ์ดที่อยู่ด้านหลัง (ภาพถัดไป)
    this.nextElement = document.createElement("div");
    this.nextElement.classList.add("next-card");
    this.nextImg = document.createElement("img");

    this.#updateNextImage(); // โหลดภาพถัดไป
    this.nextElement.append(this.nextImg);

    stack.appendChild(this.nextElement);
    stack.appendChild(this.element);

    this.#listenToEvents();
  };

  #listenToEvents = () => {
    this.element.addEventListener("touchstart", this.#handleStart);
    document.addEventListener("touchmove", this.#handleMove);
    document.addEventListener("touchend", this.#handleEnd);

    this.element.addEventListener("mousedown", this.#handleStart);
    document.addEventListener("mousemove", this.#handleMove);
    document.addEventListener("mouseup", this.#handleEnd);
  };

  #handleStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    this.#startPoint = { x: clientX };
    this.#isDragging = true;
    this.element.style.transition = "transform 0s";
  };

  #handleMove = (e) => {
    if (!this.#isDragging || !this.#startPoint) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    this.#offsetX = clientX - this.#startPoint.x;
    const rotate = this.#offsetX * 0.1;

    this.element.style.transform = `translate(${
      this.#offsetX
    }px, 0) rotate(${rotate}deg)`;

    // แสดงการ์ดถัดไปโดยปรับ opacity ตามระยะเลื่อน
    const opacity = Math.min(
      Math.abs(this.#offsetX) / (window.innerWidth * 0.3),
      1
    );
    this.nextElement.style.opacity = opacity;
  };

  #handleEnd = () => {
    this.#isDragging = false;

    if (Math.abs(this.#offsetX) > window.innerWidth * 0.3) {
      this.#changeImage();
    } else {
      this.element.style.transition = "transform 0.5s ease-out";
      this.element.style.transform = "translate(0, 0) rotate(0deg)";
      this.nextElement.style.opacity = 0; // ซ่อนภาพถัดไป
    }
  };

  #changeImage = () => {
    this.element.style.transition = "transform 0.3s ease-out";
    this.element.style.transform = `translate(${
      this.#offsetX * 2
    }px, 0) rotate(${this.#offsetX * 0.2}deg)`;

    setTimeout(() => {
      if (images.length === 0) {
        images.push(...allImages); // ถ้าหมดก็โหลดใหม่
      }

      this.imgElement.src = images.shift();
      this.#updateNextImage(); // โหลดภาพถัดไปใหม่

      // รีเซ็ตค่าตำแหน่งให้เริ่มต้นใหม่
      this.#offsetX = 0;
      this.element.style.transform = "translate(0, 0) rotate(0deg)";
      this.element.style.transition = "transform 0s"; // ป้องกันการกระตุก
      this.nextElement.style.opacity = 0; // รีเซ็ต next-card
    }, 300);
  };

  #updateNextImage = () => {
    if (images.length > 0) {
      this.nextImg.src = images[0]; // รูปถัดไปที่จะแสดง
    } else {
      this.nextImg.src = allImages[0]; // ถ้าหมดให้กลับไปที่รูปแรก
    }
  };
}

const stack = document.getElementById("stack");
const allImages = [
  "/img/8618_0.jpg",
  "/img/8616_0.jpg",
  "/img/8617_0.jpg",
  "/img/8619_0.jpg",
  "/img/S__4997123_0.jpg",
  "/img/S__4997125_0.jpg",
  "/img/S__4997126_0.jpg",
  "/img/S__4997127_0.jpg",
];

const images = [...allImages];

const card = new Card({ imageUrl: images.shift() });
