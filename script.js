// open class is added/removed when hamburger icon is clicked
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll("section").forEach((section) => {
    section.classList.add("reveal");
    revealObserver.observe(section);
});

document.querySelectorAll(".about-containers, .work-experience-container, #projects .about-containers").forEach((container) => {
    container.classList.add("reveal-stagger");
    revealObserver.observe(container);
});

const backToTopButton = document.querySelector(".back-to-top");
const floatingNav = document.querySelector(".floating-nav");
const floatingNavToggle = document.querySelector(".floating-nav-toggle");
const floatingNavMenu = document.querySelector(".floating-nav-menu");
const floatingNavLinks = floatingNavMenu.querySelectorAll("a");

function closeFloatingNav() {
    floatingNavMenu.classList.remove("open");
    floatingNavToggle.setAttribute("aria-expanded", "false");
    floatingNavToggle.setAttribute("aria-label", "Open navigation menu");
}

function toggleFloatingNav() {
    const isOpen = floatingNavMenu.classList.toggle("open");
    floatingNavToggle.setAttribute("aria-expanded", String(isOpen));
    floatingNavToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

floatingNavToggle.addEventListener("click", toggleFloatingNav);
floatingNavLinks.forEach((link) => {
    link.addEventListener("click", closeFloatingNav);
});

function removeTouchFocus(event) {
    if (event.pointerType === "touch") {
        event.currentTarget.blur();
    }
}

floatingNavToggle.addEventListener("pointerup", removeTouchFocus);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeFloatingNav();
    }
});

function updateScrollUI() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    document.documentElement.style.setProperty("--scroll-progress", `${scrollProgress}%`);
    backToTopButton.classList.toggle("is-visible", window.scrollY > 500);
    floatingNav.classList.toggle("is-visible", window.scrollY > 500);

    if (window.scrollY <= 500) {
        closeFloatingNav();
    }
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});
backToTopButton.addEventListener("pointerup", removeTouchFocus);

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

initializeCarousel(".parkourse-carousel", [
    "./assets/projects/parkourse/ParkourseThumbnail.png",
    "./assets/projects/parkourse/Garena Ultimate Hackathon 2026 Certificate.jpg",
    "./assets/projects/parkourse/parkoursegamplayscreenshot.png"
], "Parkourse");

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
