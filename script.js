document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("petTrack");
    const previous = document.getElementById("previousPet");
    const next = document.getElementById("nextPet");
    const dotsContainer = document.getElementById("petDots");
    const viewport = document.querySelector(".carousel-viewport");

    if (!track || !previous || !next || !dotsContainer || !viewport) {
        return;
    }

    const pages = Array.from(track.children);
    const total = pages.length;

    if (total === 0) {
        return;
    }

    let currentPage = 0;
    let isMoving = false;
    let touchStartX = null;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const lastClone = pages[total - 1].cloneNode(true);
    const firstClone = pages[0].cloneNode(true);

    lastClone.setAttribute("aria-hidden", "true");
    firstClone.setAttribute("aria-hidden", "true");

    track.prepend(lastClone);
    track.append(firstClone);

    const dots = [];

    function updateDots() {
        dots.forEach((dot, index) => {
            const active = index === currentPage;

            dot.classList.toggle("active", active);
            dot.setAttribute("aria-pressed", String(active));
        });
    }

    function setPosition(position, animated = true) {
        track.style.transition = animated
            ? ""
            : "none";

        track.style.transform =
            `translateX(-${(position + 1) * 100}%)`;
    }

    function snapToPage(position) {
        setPosition(position, false);
        void track.offsetWidth;
        track.style.transition = "";
    }

    function finishMove() {
        if (currentPage >= total) {
            currentPage = 0;
            snapToPage(currentPage);
        }

        if (currentPage < 0) {
            currentPage = total - 1;
            snapToPage(currentPage);
        }

        isMoving = false;
        updateDots();
    }

    function goToPage(position) {
        if (isMoving) {
            return;
        }

        if (position === currentPage) {
            return;
        }

        isMoving = true;
        currentPage = position;

        setPosition(currentPage, true);
        updateDots();

        if (reducedMotion.matches) {
            finishMove();
        }
    }

    function changePage(direction) {
        if (isMoving) {
            return;
        }

        isMoving = true;
        currentPage += direction;

        setPosition(currentPage, true);
        updateDots();

        if (reducedMotion.matches) {
            finishMove();
        }
    }

    for (let i = 0; i < total; i++) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.setAttribute("aria-label", `Група фотографій ${i + 1}`);

        dot.addEventListener("click", () => {
            goToPage(i);
        });

        dotsContainer.appendChild(dot);
        dots.push(dot);
    }

    previous.addEventListener("click", () => {
        changePage(-1);
    });

    next.addEventListener("click", () => {
        changePage(1);
    });

    track.addEventListener("transitionend", (event) => {
        if (
            event.target === track &&
            event.propertyName === "transform"
        ) {
            finishMove();
        }
    });

    viewport.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewport.addEventListener("touchend", (event) => {
        if (touchStartX === null) {
            return;
        }

        const touchEndX = event.changedTouches[0].clientX;
        const difference = touchEndX - touchStartX;

        if (Math.abs(difference) > 40) {
            changePage(difference < 0 ? 1 : -1);
        }

        touchStartX = null;
    }, { passive: true });

    snapToPage(0);
    updateDots();
});
