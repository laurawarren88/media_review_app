document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('back_button');
    if (backButton) {
      backButton.addEventListener('click', function(e) {
        e.preventDefault(); 
  
        if (document.referrer) {
          window.location.href = document.referrer; 
        } else {
          window.location.href = '/'; 
        }
      });
    }
  });

  document.getElementById('bookTitle').addEventListener('change', async function() {
    const bookId = this.value;

    const response = await fetch(`/books/${bookId}/details`); 
    const book = await response.json();

    document.getElementById('author_and_cover').innerHTML = `
        <p>Author: ${book.author}</p>
        <img src="${book.coverImage}" alt="${book.title} cover">
    `;
});
