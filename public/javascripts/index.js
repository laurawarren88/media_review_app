// Back button functionality to send a user back to the page they came from
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('back_button');
    if (backButton) {
      backButton.addEventListener('click', function(e) {
        e.preventDefault(); 
  
        if (document.referrer) {
          window.location.href = document.referrer; // Go to the previous page
        } else {
          window.location.href = '/'; 
        }
      });
    }
  });

  document.getElementById('bookTitle').addEventListener('change', async function() {
    const bookId = this.value;
    
    // Fetch the book data
    const response = await fetch(`/books/${bookId}/details`); // Assuming you have a route to fetch book details
    const book = await response.json();

    // Populate the author and cover fields
    document.getElementById('author_and_cover').innerHTML = `
        <p>Author: ${book.author}</p>
        <img src="${book.coverImage}" alt="${book.title} cover">
    `;
});
