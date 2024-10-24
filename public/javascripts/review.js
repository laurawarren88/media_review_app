document.getElementById('bookTitle').addEventListener('change', async function() {
    const bookId = this.value;
    
    if (bookId) {
        const response = await fetch(`/books/${bookId}`);
        const book = await response.json();

        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('coverImage').src = `data:${book.coverImageType};base64,${book.coverImage}`;
    } else {
        document.getElementById('bookAuthor').value = '';
        document.getElementById('coverImage').src = '';
    }
});
