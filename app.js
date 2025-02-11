if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
      navigator.serviceWorker
          .register("./serviceWorker.js")
          .then(res => console.log("service worker registered"))
          .catch(err => console.log("service worker not registered", err));
  });
}

// document.addEventListener('DOMContentLoaded', function() {
//   const basePath = window.location.pathname.includes('timetable_csea') ? '/timetable_csea' : '';
//   const section = localStorage.getItem('section');
//   const currentPath = window.location.pathname;

//   if (section && section !== 'a') {
//       const targetPath = `${basePath}/sections/cse${section}.html`;
//       if (currentPath !== targetPath) {
//           window.location.pathname = targetPath;
//       }
//   }

//   if (section) {
//       const classSelect = document.getElementById('class');
//       if (classSelect) {
//           classSelect.value = section;
//       }
//   }

//   document.getElementById('class').addEventListener('change', () => {
//           const section = document.getElementById('class').value;
//           localStorage.setItem('section', section);
//           let redirectPath = '';

//           switch (section) {
//               case 'a':
//                   redirectPath = `${basePath}/index.html`;
//                   break;
//               case 'b':
//                   redirectPath = `${basePath}/sections/cseb.html`;
//                   break;
//               case 'c':
//                   redirectPath = `${basePath}/sections/csec.html`;
//                   break;
//               case 'd':
//                   redirectPath = `${basePath}/sections/csed.html`;
//                   break;
//               case 'e':
//                   redirectPath = `${basePath}/sections/csee.html`;
//                   break;
//               case 'f':
//                   redirectPath = `${basePath}/sections/csef.html`;
//                   break;
//               default:
//                   break;
//           }

//           if (redirectPath) {
//               window.location.href = redirectPath;
//           }
//   });

//   const classForm = document.getElementById('class-form');
//   if (classForm) {
//       classForm.addEventListener('submit', function(event) {
//           event.preventDefault();

//           //console.log('submitted');

//           const section = document.getElementById('class').value;
//           localStorage.setItem('section', section);
//           let redirectPath = '';

//           switch (section) {
//               case 'a':
//                   redirectPath = `${basePath}/index.html`;
//                   break;
//               case 'b':
//                   redirectPath = `${basePath}/sections/cseb.html`;
//                   break;
//               case 'c':
//                   redirectPath = `${basePath}/sections/csec.html`;
//                   break;
//               case 'd':
//                   redirectPath = `${basePath}/sections/csed.html`;
//                   break;
//               case 'e':
//                   redirectPath = `${basePath}/sections/csee.html`;
//                   break;
//               case 'f':
//                   redirectPath = `${basePath}/sections/csef.html`;
//                   break;
//               default:
//                   break;
//           }

//           if (redirectPath) {
//               window.location.href = redirectPath;
//           }
//       });
//   }
// });
document.addEventListener('DOMContentLoaded', function() {
    fetch('./section.json')
        .then(response => response.json())
        .then(sectionsData => {
            const classSelect = document.getElementById('class');
            const section = localStorage.getItem('section') || 'a';
            
            if (classSelect) {
                classSelect.value = section;
                updateTimetable(sectionsData, section);
            }

            classSelect.addEventListener('change', () => {
                const newSection = classSelect.value;
                localStorage.setItem('section', newSection);
                updateTimetable(sectionsData, newSection);
            });
        })
        .catch(error => console.error('Error loading sections data:', error));

    function updateTimetable(sectionsData, section) {
        const sectionData = sectionsData[section];
        if (!sectionData) return;

        // Update title
        document.querySelector('thead tr th').textContent = sectionData.title;
        
        const tbody = document.querySelector('table tbody');
        const dayRows = tbody.querySelectorAll('tr:not(:first-child)');
        
        // Create rows for each day
        dayRows.forEach((row, index) => {
            // Clear existing td elements
            row.querySelectorAll('td').forEach(td => td.remove());
            
            const daySchedule = sectionData.schedule[index];
            
            // Fill in schedule data
            daySchedule.forEach((cellData) => {
                const cell = document.createElement('td');
                
                if (typeof cellData === 'object') {
                    if (cellData.class) cell.classList.add(cellData.class);
                    if (cellData.colspan) cell.setAttribute('colspan', cellData.colspan);
                    cell.textContent = cellData.text || '';
                } else {
                    cell.textContent = cellData;
                }
                
                row.appendChild(cell);
            });
        });
    }
});