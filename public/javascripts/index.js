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


  // Navbar function - open and close
  function showSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
  };
  
  function hideSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
  };