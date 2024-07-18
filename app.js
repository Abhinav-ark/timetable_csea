if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("./serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}


document
    .getElementById('class-form')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        console.log('submitted');

        const section = document.getElementById('class').value;

        switch (section) {
            case 'a':
                localStorage.setItem('section','a');
                window.location.href = 'index.html';
                break;
            case 'b':
                localStorage.setItem('section','b');
                window.location.href = 'sections/cseb.html';
                break;
            case 'c':
                localStorage.setItem('section','c');
                window.location.href = 'sections/csec.html';
                break;
            case 'd':
                localStorage.setItem('section','d');
                window.location.href = 'sections/csed.html';
                break;
            case 'e':
                localStorage.setItem('section','e');
                window.location.href = 'sections/csee.html';
                break;
            case 'f':
                localStorage.setItem('section','f');
                window.location.href = 'sections/csef.html';
                break;
            default:
                break;
        }
    });

  document.addEventListener('DOMContentLoaded', function() {
      const section = localStorage.getItem('section');
      const currentPath = window.location.pathname;
  
      if (section && section !== 'a') {
          const targetPath = `sections/cse${section}.html`;
          if (currentPath !== "/"+targetPath) {
              window.location.pathname = targetPath;
          }
      }
  
      if (section) {
          document.getElementById('class').value = section;
      }
  });
  
  





