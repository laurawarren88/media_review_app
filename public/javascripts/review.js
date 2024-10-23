document.getElementById('bookTitle').addEventListener('change', async function() {
    const bookId = this.value;
    
    if (bookId) {
        const response = await fetch(`/books/${bookId}`);
        const book = await response.json();

        // Populate the author and cover fields
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('coverImage').src = `data:${book.coverImageType};base64,${book.coverImage}`;
    } else {
        // Clear fields if no book is selected
        document.getElementById('bookAuthor').value = '';
        document.getElementById('coverImage').src = '';
    }
});
