// open class is added/removed when hamburger icon is clicked
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Preload images to improve carousel performance
function preloadImage(src) {
    const preloadedImage = new Image();

    return new Promise((resolve, reject) => {
        preloadedImage.onload = () => {
            if (typeof preloadedImage.decode === "function") {
                preloadedImage.decode().then(resolve).catch(reject);
                return;
            }

            resolve();
        };
        preloadedImage.onerror = () => reject(new Error(`Unable to load carousel image: ${src}`));
        preloadedImage.src = src;
    });
}

function initializeCarousel(selector, images, projectName) {
    document.querySelectorAll(selector).forEach((carousel) => {
        const image = carousel.querySelector(".carousel-image");
        const counter = carousel.querySelector(".carousel-counter");
        const previousButton = carousel.querySelector(".carousel-button-previous");
        const nextButton = carousel.querySelector(".carousel-button-next");
        let currentImage = 0;
        let isLoading = false;
        const preloadedImages = images.map((src) => preloadImage(src));

        Promise.allSettled(preloadedImages).then((results) => {
            results
                .filter((result) => result.status === "rejected")
                .forEach((result) => console.error(result.reason));
        });

        async function showImage(imageIndex) {
            if (isLoading) {
                return;
            }

            const nextImage = (imageIndex + images.length) % images.length;
            isLoading = true;
            previousButton.disabled = true;
            nextButton.disabled = true;

            try {
                await preloadedImages[nextImage];
                currentImage = nextImage;
                image.src = images[currentImage];
                image.alt = `${projectName} project screenshot ${currentImage + 1} of ${images.length}`;
                counter.textContent = `${currentImage + 1} / ${images.length}`;
            } catch (error) {
                console.error(error);
            } finally {
                isLoading = false;
                previousButton.disabled = false;
                nextButton.disabled = false;
            }
        }

        previousButton.addEventListener("click", () => {
            void showImage(currentImage - 1);
        });
        nextButton.addEventListener("click", () => {
            void showImage(currentImage + 1);
        });
    });
}

initializeCarousel(".jolliville-carousel", [
    "./assets/projects/jolliville/jolliville1.png",
    "./assets/projects/jolliville/jolliville2.jpg",
    "./assets/projects/jolliville/jolliville3.png",
    "./assets/projects/jolliville/jolliville4.jpg",
    "./assets/projects/jolliville/jolliville5.jpg",
    "./assets/projects/jolliville/jolliville6.jpg"
], "Jolliville");

initializeCarousel(".dungeon-carousel", [
    "./assets/projects/dungeonluncheon/dungeon-luncheon.png",
    "./assets/projects/dungeonluncheon/dungeon1.png",
    "./assets/projects/dungeonluncheon/dungeon2.png",
    "./assets/projects/dungeonluncheon/dungeon3.png",
    "./assets/projects/dungeonluncheon/dungeon4.png",
    "./assets/projects/dungeonluncheon/dungeon5.png",
    "./assets/projects/dungeonluncheon/dungeon6.png"
], "Dungeon Luncheon");
