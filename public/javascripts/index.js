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
