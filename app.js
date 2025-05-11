if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const basePath = window.location.pathname.includes('timetable_csea') ? '/timetable_csea' : '';
  
  // Get section from URL query parameter or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const sectionFromUrl = urlParams.get('section');
  let section = sectionFromUrl || localStorage.getItem('section') || 'a';
  
  // Update localStorage with current section
  localStorage.setItem('section', section);
  
  const classSelect = document.getElementById('class');
  
  // Set initial section in dropdown
  if (classSelect) {
    classSelect.value = section;
    renderTimetable(section);
  }

  // Handle form submission
  const classForm = document.getElementById('class-form');
  if (classForm) {
    classForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const newSection = classSelect.value;
      updateSection(newSection);
    });
  }

  // Handle direct select change
  if (classSelect) {
    classSelect.addEventListener('change', () => {
      const newSection = classSelect.value;
      updateSection(newSection);
    });
  }
  
  function updateSection(newSection) {
    localStorage.setItem('section', newSection);
    
    // Update URL with the new section parameter
    const url = new URL(window.location);
    url.searchParams.set('section', newSection);
    window.history.pushState({}, '', url);
    
    renderTimetable(newSection);
  }

  function renderTimetable(section) {
    // Construct the path based on the section
    const jsonPath = `${basePath}/sections/cse${section}.json`;
    
    fetch(jsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(sectionData => {
        buildTableCells(sectionData);
        console.log('Timetable loaded successfully for section:', section);
      })
      .catch(error => {
        console.error('Error loading timetable:', error);
        console.log('Failed path:', jsonPath);
        const tableHeader = document.querySelector('thead tr th');
        if (tableHeader) {
          tableHeader.textContent = 'Error loading timetable';
        }
      });
  }

  function buildTableCells(sectionData) {
    if (!sectionData) return;

    const titleElement = document.querySelector('thead tr th');
    if (titleElement) {
      titleElement.textContent = sectionData.title;
    }
    
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    const dayRows = tbody.querySelectorAll('tr:not(:first-child)');
    
    // Create rows for each day
    dayRows.forEach((row, index) => {
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

  // Update links to maintain section parameter
  document.querySelectorAll('a').forEach(link => {
    if (link.href.includes('index.html') ||
        link.href.includes('midsem.html') || 
        link.href.includes('endsem.html') || 
        link.href.includes('tasks.html')) {
      
      link.addEventListener('click', function(e) {
        // Only intercept internal links
        if (link.origin === window.location.origin) {
          e.preventDefault();
          
          const targetUrl = new URL(link.href);
          // Preserve the current section in the new URL
          targetUrl.searchParams.set('section', section);
          window.location.href = targetUrl.toString();
        }
      });
    }
  });
});