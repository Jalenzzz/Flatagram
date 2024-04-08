let currentComment = null;
let currentPost = null;

function getPost() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:3000/images/1", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      currentPost = result;
      document.getElementById("card-image").src = result.image;
      document.getElementById("card-title").innerText = result.title;
      document.getElementById("like-count").innerText = `${result.likes} likes`;
    })
    .catch((error) => console.error(error));
}

function getComments() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:3000/comments", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      currentComment = result;
      displayComments(result); // Call displayComments with the fetched comments
    })
    .catch((error) => console.error(error));
}

function displayComments(comments) {
  const commentList = document.getElementById("comments-list");
  let html = "";

  comments.forEach((comment) => {
    // Check if the comment object exists and has a 'content' property
    if (comment && comment.content) {
      html += `<li class="comments">${comment.content}</li>`;
    } else {
      // Log a warning for invalid comment objects that are missing the 'content' property
      console.warn("Invalid comment object:", comment);
    }
  });

  commentList.innerHTML = html;
}

function updateLikeCount() {
  const likeCount = document.getElementById("like-count");
  let numLikes = parseInt(likeCount.textContent); // Convert to a number
  numLikes++;
  likeCount.textContent = numLikes + " likes";
  console.log("Someone liked the post!");
  updateLikeJson();
  // remember to update the like count in my database
}
function updateLikeJson() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    id: currentPost.id,
    title: currentPost.title,
    likes: currentPost.likes + 1,
    image: currentPost.image,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:3000/images/${currentPost.id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
  const likeButton = document.getElementById("like-button");
  const commentForm = document.getElementById("comment-form"); // Get the comment form
  const postButton = document.getElementById("post-comment");
  likeButton.addEventListener("click", updateLikeCount);

  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const commentInput = document.getElementById("comment");
    const commentText = commentInput.value.trim();

    if (commentText === "") {
      alert("Please enter a comment.");
      return;
    }
  });
  getPost();
  getComments();
});
