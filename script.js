document.addEventListener("DOMContentLoaded", function () {
    
    let menu = document.querySelector("#menu-icon");
    let navbar = document.querySelector(".navbar");
    let header = document.querySelector("header");

    if (menu && navbar && header) {
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
    }

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const thumbnails = document.querySelectorAll(".thumbnail img");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let currentIndex = 0;

    function showLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        lightbox.style.display = "flex";
        lightboxImg.src = thumbnails[index].src;
        currentIndex = index;
    }

    function closeLightbox() {
        if (lightbox) lightbox.style.display = "none";
    }

    function changeImage(direction) {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = thumbnails.length - 1;
        else if (currentIndex >= thumbnails.length) currentIndex = 0;
        lightboxImg.src = thumbnails[currentIndex].src;
    }

    if (thumbnails) {
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener("click", () => showLightbox(index));
        });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", () => changeImage(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => changeImage(1));

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

    document.querySelectorAll(".box").forEach((box) => {
        const titleElement = box.querySelector("h3");
        const readMoreButton = box.querySelector("a");

        if (titleElement && readMoreButton) {
            const serviceName = titleElement.textContent.trim();
            if (readMoreLinks[serviceName]) {
                readMoreButton.href = readMoreLinks[serviceName];
                readMoreButton.target = "_blank";
            } else {
                readMoreButton.href = "#";
            }
        }
    });

    const postForm = document.getElementById("postForm");
    const postList = document.getElementById("postList");
    // const searchInput = document.getElementById("searchInput");

    const API_URL = "http://localhost:3000/posts"; 
    const postsContainer = document.querySelector(".latest-posts .row");

    function fetchPosts(query = "") {
        fetch(API_URL)
            .then(response => response.json())
            .then(posts => {
                postsContainer.innerHTML = ""; 
                posts
                    .filter(post => post.title.toLowerCase().includes(query.toLowerCase()) || post.description.toLowerCase().includes(query.toLowerCase()))
                    .forEach(post => createPostCard(post));
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
                postList.innerHTML = `<p class="text-center text-danger">Error loading posts. Please try again later.</p>`;
            });
    }

    function createPostCard(post) {
        let postCard = document.querySelector(`[data-id="${post.id}"]`);

        if (!postCard) {
            postCard = document.createElement("div");
            postCard.classList.add("col-md-4", "mb-4");
            postCard.setAttribute("data-id", post.id);
            postsContainer.appendChild(postCard);
        }

        postCard.innerHTML = `
            <div class="post-card">
                <img src="${post.image}" alt="${post.title}" class="img-fluid">
                <div class="post-content">
                    <h5>${post.title}</h5>
                    <p>${post.description}</p>
                    <div class="post-actions">
                        <button class="like-btn" data-id="${post.id}">❤️ ${post.likes}</button>
                        <button class="comment-btn" data-id="${post.id}">💬 ${post.comments.length}</button>
                        <button class="share-btn" data-id="${post.id}">🔗 Share</button>
                    </div>
                    <div class="comments-section" id="comments-${post.id}" style="display: none;">
                        <input type="text" id="comment-input-${post.id}" class="form-control" placeholder="Write a comment...">
                        <button class="submit-comment" data-id="${post.id}">Post Comment</button>
                        <div class="comment-list">
                            ${post.comments.map(comment => `<p>🗨️ ${comment}</p>`).join("")}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    if (postForm) {
        postForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const title = document.getElementById("postTitle").value.trim();
            const description = document.getElementById("postDescription").value.trim();
            const image = document.getElementById("postImage").value.trim() || "default-image.jpg";

            if (!title || !description) {
                alert("Please fill in all fields.");
                return;
            }

            const newPost = { title, description, image, likes: 0, comments: [], shares: 0 };

            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost),
            })
                .then(response => response.json())
                .then(post => {
                    createPostCard(post);
                    postForm.reset(); 
                })
                .catch(error => console.error("Error adding post:", error));
        });
    }

    document.addEventListener("click", (event) => {
        const postId = event.target.dataset.id;

        if (event.target.classList.contains("like-btn")) {
            toggleLike(postId, event.target);
        } else if (event.target.classList.contains("comment-btn")) {
            toggleComments(postId);
        } else if (event.target.classList.contains("submit-comment")) {
            submitComment(postId);
        } else if (event.target.classList.contains("share-btn")) {
            copyToClipboard(`http://localhost:3000/posts/${postId}`);
        } else if (event.target.classList.contains("delete-btn")) {
            deletePost(postId);
        }
    });

    function toggleLike(postId, button) {
        fetch(`${API_URL}/${postId}`)
            .then(response => response.json())
            .then(post => {
                const updatedLikes = post.likes + 1;
                return fetch(`${API_URL}/${postId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ likes: updatedLikes })
                });
            })
            .then(() => button.textContent = `❤️ ${parseInt(button.textContent.split(' ')[1]) + 1}`)
            .catch(error => console.error("Error liking post:", error));
    }

    function toggleComments(postId) {
        const section = document.getElementById(`comments-${postId}`);
        section.style.display = section.style.display === "none" ? "block" : "none";
    }

    function submitComment(postId) {
        const input = document.getElementById(`comment-input-${postId}`);
        const comment = input.value.trim();
        if (!comment) return;

        fetch(`${API_URL}/${postId}`)
            .then(response => response.json())
            .then(post => {
                const updatedComments = [...post.comments, comment];
                return fetch(`${API_URL}/${postId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ comments: updatedComments })
                });
            })
            .then(() => {
                input.value = ""; 
                fetchPosts(searchInput.value); 
            })
            .catch(error => console.error("Error posting comment:", error));
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => alert("🔗 Post link copied to clipboard!"))
            .catch(err => console.error("Copy failed", err));
    }


    fetchPosts();

    const donationForm = document.getElementById("donationForm");
    const customAlert = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");
  
    donationForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const firstName = donationForm.querySelector('input[placeholder="First Name"]').value.trim();
      const lastName = donationForm.querySelector('input[placeholder="Last Name"]').value.trim();
      const email = donationForm.querySelector('input[placeholder="Enter Your Email"]').value.trim();
      const amount = donationForm.querySelector('select').value;
      const method = document.getElementById("paymentMethod").value;
      const paymentDetails = document.getElementById("paymentDetails").value.trim();
  
      if (!firstName || !lastName || !email || !amount || !method || !paymentDetails) {
        showAlert("❗ Please fill in all required fields.");
        return;
      }
  
      // Create unique ID
      const id = Math.random().toString(36).substring(2, 6);
  
      const donationData = {
        firstName,
        lastName,
        email,
        amount,
        method,
        id
      };
  
      fetch("http://localhost:3000/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(donationData)
      })
      .then(response => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then(data => {
        showAlert(`🎉 Thank you, ${firstName}! Your donation of ${amount} via ${method.toUpperCase()} was successful.`);
        donationForm.reset();
      })
      .catch(error => {
        console.error("Error saving donation:", error);
        showAlert("❌ Something went wrong. Please try again.");
      });
    });
  
    function showAlert(message) {
        console.log('showAlert called with message:', message);  // Debugging line
        alertMessage.textContent = message;
        customAlert.style.display = "block";  // Make sure it's visible
        customAlert.classList.add("show");   // Make sure it has the 'show' class
        customAlert.scrollIntoView({ behavior: "smooth" });
      }
  });