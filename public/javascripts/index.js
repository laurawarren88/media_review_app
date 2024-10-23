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
