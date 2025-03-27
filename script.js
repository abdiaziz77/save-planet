let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
let header = document.querySelector("header");


menu.addEventListener("click", function () {
    navbar.classList.toggle("nav-toggle");

    
    menu.classList.toggle("fa-bars");
    menu.classList.toggle("fa-times");
});


window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    
    navbar.classList.remove("nav-toggle");
    menu.classList.add("fa-bars");
    menu.classList.remove("fa-times");
});


document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const thumbnails = document.querySelectorAll(".thumbnail img");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let currentIndex = 0;

    function showLightbox(index) {
        lightbox.style.display = "flex";
        lightboxImg.src = thumbnails[index].src;
        currentIndex = index;
    }

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    function changeImage(direction) {
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = thumbnails.length - 1;
        } else if (currentIndex >= thumbnails.length) {
            currentIndex = 0;
        }
        lightboxImg.src = thumbnails[currentIndex].src;
    }

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener("click", () => showLightbox(index));
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", () => changeImage(-1));
    nextBtn.addEventListener("click", () => changeImage(1));

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // External links for each service
    const readMoreLinks = {
        "Planting": "https://www.worldwildlife.org/initiatives/forests",
        "Recycle": "https://www.epa.gov/recycle",
        "Water saving": "https://www.worldwatercouncil.org/en",
        "Tree saving": "https://onetreeplanted.org/",
        "Animals saving": "https://www.worldanimalprotection.org/",
        "Solar panel": "https://www.energy.gov/eere/solar/how-does-solar-work",
        "Eco-Friendly Transportation": "https://www.transportation.gov/sustainability",
        "Waste Reduction": "https://www.nrdc.org/stories/reduce-reuse-recycle-most-effective-ways-save-planet"
    };

    // Select all service boxes
    const serviceBoxes = document.querySelectorAll(".box");

    serviceBoxes.forEach((box) => {
        const titleElement = box.querySelector("h3"); // Get the service title
        const readMoreButton = box.querySelector("a"); // Get "Read More" button

        if (titleElement && readMoreButton) {
            const serviceName = titleElement.textContent.trim(); // Get title text

            if (readMoreLinks[serviceName]) {
                readMoreButton.href = readMoreLinks[serviceName]; // Assign external link
                readMoreButton.target = "_blank"; // Open in new tab
            } else {
                readMoreButton.href = "#"; // Fallback if no link is found
            }
        }
    });
});







document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.querySelector(".latest-posts .row");
    const form = document.getElementById("postForm");

    const API_URL = "http://localhost:3000/posts"; 

    
    function fetchPosts() {
        fetch(API_URL)
            .then(response => response.json())
            .then(posts => {
                postsContainer.innerHTML = ""; 
                posts.forEach(post => createPostCard(post));
            })
            .catch(error => console.error("Error fetching posts:", error));
    }

    
    function createPostCard(post) {
        const postCard = document.createElement("div");
        postCard.classList.add("col-md-4", "mb-4");

        postCard.innerHTML = `
            <div class="post-card">
                <img src="${post.image}" alt="${post.title}">
                <div class="post-content">
                    <h5>${post.title}</h5>
                    <p>${post.description}</p>
                    <button class="btn-read-more">Read More</button>
                </div>
            </div>
        `;
        postsContainer.appendChild(postCard);
    }

    
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        
        const title = document.getElementById("postTitle").value;
        const description = document.getElementById("postDescription").value;
        const image = document.getElementById("postImage").value;

        if (!title || !description || !image) {
            alert("Please fill in all fields.");
            return;
        }

        const newPost = { title, description, image };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
        })
        .then(response => response.json())
        .then(post => {
            createPostCard(post); 
            form.reset();
        })
        .catch(error => console.error("Error adding post:", error));
    });

    
    fetchPosts();
});
