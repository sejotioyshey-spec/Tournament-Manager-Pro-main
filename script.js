document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const viewToggleBtn = document.getElementById('view-toggle');
  const tournamentOverview = document.getElementById('tournament-overview');
  const adminView = document.getElementById('admin-view');
  const tournamentNameEl = document.getElementById('tournament-name');
  const tournamentTimeEl = document.getElementById('tournament-time');
  const totalTeamsEl = document.getElementById('total-teams');
  const totalPointsEl = document.getElementById('total-points');
  const teamsListEl = document.getElementById('teams-list');
  const editTournamentName = document.getElementById('edit-tournament-name');
  const editTournamentTime = document.getElementById('edit-tournament-time');
  const saveTournamentBtn = document.getElementById('save-tournament');
  const addTeamForm = document.getElementById('add-team-form');
  const teamManagementList = document.getElementById('team-management-list');
  const logoPreview = document.getElementById('logo-preview');
  const teamLogoInput = document.getElementById('team-logo');
  const teamSearch = document.getElementById('team-search');
  const adminTeamSearch = document.getElementById('admin-team-search');
  const screenshotBtn = document.getElementById('screenshot-btn');
  const screenshotModal = document.getElementById('screenshot-modal');
  const closeModal = document.querySelector('.close-modal');
  const screenshotPreview = document.getElementById('screenshot-preview');
  const downloadScreenshot = document.getElementById('download-screenshot');

  // Initialize default data if none exists
  initializeData();

  // Load data from localStorage
  loadTournamentData();
  loadTeams();

  // Set up event listeners
  viewToggleBtn.addEventListener('click', toggleView);
  saveTournamentBtn.addEventListener('click', saveTournamentSettings);
  addTeamForm.addEventListener('submit', handleAddTeam);
  teamLogoInput.addEventListener('change', handleLogoUpload);
  teamSearch.addEventListener('input', filterTeams);
  adminTeamSearch.addEventListener('input', filterAdminTeams);
  screenshotBtn.addEventListener('click', takeScreenshot);
  closeModal.addEventListener('click', () => screenshotModal.style.display = 'none');
  downloadScreenshot.addEventListener('click', downloadScreenshotImage);
  window.addEventListener('click', (e) => {
    if (e.target === screenshotModal) {
      screenshotModal.style.display = 'none';
    }
  });

  // Custom event for data changes within the same window
  document.addEventListener('localStorageUpdated', function() {
    loadTournamentData();
    loadTeams();
  });

  // Initialize functions
  function initializeData() {
    if (!localStorage.getItem('tournamentData')) {
      const defaultTournamentData = {
        name: 'Championship Tournament',
        time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      localStorage.setItem('tournamentData', JSON.stringify(defaultTournamentData));
    }

    if (!localStorage.getItem('teams')) {
      const defaultTeams = [
        {
          id: Date.now(),
          name: 'Team Alpha',
          location: 'New York',
          points: 15,
          booyahCount: 3,
          logo: ''
        },
        {
          id: Date.now() + 1,
          name: 'Team Bravo',
          location: 'Los Angeles',
          points: 12,
          booyahCount: 2,
          logo: ''
        },
        {
          id: Date.now() + 2,
          name: 'Team Charlie',
          location: 'Chicago',
          points: 10,
          booyahCount: 1,
          logo: ''
        }
      ];
      localStorage.setItem('teams', JSON.stringify(defaultTeams));
    }
  }

  function loadTournamentData() {
    const tournamentData = JSON.parse(localStorage.getItem('tournamentData'));
    if (tournamentData) {
      tournamentNameEl.textContent = tournamentData.name;
      tournamentTimeEl.innerHTML = `<i class="far fa-calendar-alt"></i> ${new Date(tournamentData.time).toLocaleString()}`;
      
      // Set values in admin view
      editTournamentName.value = tournamentData.name;
      editTournamentTime.value = tournamentData.time.split('.')[0];
    }
  }

  function loadTeams() {
    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    
    // Calculate total teams and points
    const totalTeams = teams.length;
    const totalPoints = teams.reduce((sum, team) => sum + team.points, 0);
    
    totalTeamsEl.textContent = totalTeams;
    totalPointsEl.textContent = totalPoints;
    
    // Sort teams by points (descending)
    teams.sort((a, b) => b.points - a.points);
    
    // Render teams in overview
    renderTeamsList(teams);
    
    // Render teams in admin management
    renderTeamManagementList(teams);
  }

  function renderTeamsList(teams) {
    teamsListEl.innerHTML = '';
    
    if (teams.length === 0) {
      teamsListEl.innerHTML = '<div class="empty-state"><i class="fas fa-users-slash"></i><p>No teams have been added yet.</p></div>';
      return;
    }
    
    teams.forEach((team, index) => {
      const teamCard = document.createElement('div');
      teamCard.className = 'team-card';
      
      teamCard.innerHTML = `
        <div class="team-number">${index + 1}</div>
        <img src="${team.logo || 'https://via.placeholder.com/70'}" alt="${team.name} Logo">
        <div class="team-info">
          <h3>${team.name}</h3>
          <p>${team.location}</p>
          <div class="team-stats">
            <div class="team-stat">
              <i class="fas fa-star"></i>
              <span>${team.points} points</span>
            </div>
            <div class="team-stat">
              <i class="fas fa-fire"></i>
              <span>${team.booyahCount || 0} Booyahs</span>
            </div>
          </div>
        </div>
        <div class="team-points">${team.points} pts</div>
      `;
      
      teamsListEl.appendChild(teamCard);
    });
  }

  function renderTeamManagementList(teams) {
    teamManagementList.innerHTML = '';
    
    if (teams.length === 0) {
      teamManagementList.innerHTML = '<div class="empty-state"><i class="fas fa-users-slash"></i><p>No teams to manage.</p></div>';
      return;
    }
    
    teams.forEach((team, index) => {
      const teamCard = document.createElement('div');
      teamCard.className = 'team-management-card';
      teamCard.dataset.teamId = team.id;
      
      teamCard.innerHTML = `
        <img src="${team.logo || 'https://via.placeholder.com/60'}" alt="${team.name} Logo">
        <div class="team-management-info">
          <h4>${team.name}</h4>
          <p>
            <span><i class="fas fa-map-marker-alt"></i> ${team.location}</span>
            <span><i class="fas fa-star"></i> ${team.points} pts</span>
            <span><i class="fas fa-fire"></i> ${team.booyahCount || 0} Booyahs</span>
          </p>
        </div>
        <div class="team-management-actions">
          <button class="btn btn-secondary edit-team-btn" data-team-id="${team.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-danger delete-team-btn" data-team-id="${team.id}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `;
      
      teamManagementList.appendChild(teamCard);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-team-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const teamId = parseInt(this.dataset.teamId);
        showEditTeamForm(teamId);
      });
    });
    
    document.querySelectorAll('.delete-team-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const teamId = parseInt(this.dataset.teamId);
        deleteTeam(teamId);
      });
    });
  }

  function showEditTeamForm(teamId) {
    const teams = JSON.parse(localStorage.getItem('teams'));
    const team = teams.find(t => t.id === teamId);
    
    if (!team) return;
    
    // Remove any existing edit forms
    document.querySelectorAll('.edit-team-form').forEach(form => form.remove());
    
    const teamCard = document.querySelector(`.team-management-card[data-team-id="${teamId}"]`);
    
    const editForm = document.createElement('form');
    editForm.className = 'edit-team-form';
    editForm.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label for="edit-team-name-${teamId}"><i class="fas fa-signature"></i> Team Name:</label>
          <input type="text" id="edit-team-name-${teamId}" class="modern-input" value="${team.name}" required>
        </div>
        <div class="form-group">
          <label for="edit-team-location-${teamId}"><i class="fas fa-map-marker-alt"></i> Location:</label>
          <input type="text" id="edit-team-location-${teamId}" class="modern-input" value="${team.location}" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="edit-team-points-${teamId}"><i class="fas fa-star"></i> Points:</label>
          <input type="number" id="edit-team-points-${teamId}" class="modern-input" value="${team.points}" min="0" required>
        </div>
        <div class="form-group">
          <label for="edit-team-booyah-${teamId}"><i class="fas fa-fire"></i> Booyah Count:</label>
          <input type="number" id="edit-team-booyah-${teamId}" class="modern-input" value="${team.booyahCount || 0}" min="0">
        </div>
      </div>
      <div class="form-group">
        <label><i class="fas fa-image"></i> Team Logo:</label>
        <div class="file-upload-wrapper">
          <input type="file" class="edit-team-logo" accept="image/*" id="edit-team-logo-${teamId}">
          <label for="edit-team-logo-${teamId}" class="file-upload-label">
            <i class="fas fa-cloud-upload-alt"></i> Change Logo
          </label>
        </div>
        <div class="edit-logo-preview">
          ${team.logo ? `<img src="${team.logo}" style="max-width: 80px; max-height: 80px; margin-top: 10px; border-radius: 8px;">` : ''}
        </div>
      </div>
      <div class="edit-form-actions">
        <button type="button" class="btn btn-secondary cancel-edit">
          <i class="fas fa-times"></i> Cancel
        </button>
        <button type="submit" class="btn btn-success">
          <i class="fas fa-save"></i> Save Changes
        </button>
      </div>
    `;
    
    teamCard.appendChild(editForm);
    
    // Handle logo preview for edit form
    const logoInput = editForm.querySelector('.edit-team-logo');
    logoInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          editForm.querySelector('.edit-logo-preview').innerHTML = `
            <img src="${event.target.result}" style="max-width: 80px; max-height: 80px; margin-top: 10px; border-radius: 8px;">
          `;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Handle form submission
    editForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const updatedTeam = {
        ...team,
        name: editForm.querySelector(`#edit-team-name-${teamId}`).value,
        location: editForm.querySelector(`#edit-team-location-${teamId}`).value,
        points: parseInt(editForm.querySelector(`#edit-team-points-${teamId}`).value),
        booyahCount: parseInt(editForm.querySelector(`#edit-team-booyah-${teamId}`).value) || 0
      };
      
      // Handle logo update if a new one was selected
      const logoFile = logoInput.files[0];
      if (logoFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
          updatedTeam.logo = event.target.result;
          updateTeamInStorage(updatedTeam);
        };
        reader.readAsDataURL(logoFile);
      } else {
        updateTeamInStorage(updatedTeam);
      }
    });
    
    // Handle cancel
    editForm.querySelector('.cancel-edit').addEventListener('click', function() {
      editForm.remove();
    });
  }

  function updateTeamInStorage(updatedTeam) {
    const teams = JSON.parse(localStorage.getItem('teams'));
    const updatedTeams = teams.map(team => 
      team.id === updatedTeam.id ? updatedTeam : team
    );
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    dispatchStorageEvent();
  }

  function deleteTeam(teamId) {
    if (confirm('Are you sure you want to delete this team?')) {
      const teams = JSON.parse(localStorage.getItem('teams'));
      const updatedTeams = teams.filter(team => team.id !== teamId);
      localStorage.setItem('teams', JSON.stringify(updatedTeams));
      dispatchStorageEvent();
    }
  }

  function toggleView() {
    const isAdminView = adminView.classList.contains('active-view');
    
    if (isAdminView) {
      adminView.classList.remove('active-view');
      tournamentOverview.classList.add('active-view');
      viewToggleBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin Dashboard';
    } else {
      tournamentOverview.classList.remove('active-view');
      adminView.classList.add('active-view');
      viewToggleBtn.innerHTML = '<i class="fas fa-users"></i> Public View';
    }
  }

  function saveTournamentSettings() {
    const tournamentData = {
      name: editTournamentName.value,
      time: editTournamentTime.value
    };
    
    localStorage.setItem('tournamentData', JSON.stringify(tournamentData));
    dispatchStorageEvent();
    
    // Show success feedback
    const originalText = saveTournamentBtn.innerHTML;
    saveTournamentBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    saveTournamentBtn.classList.add('btn-success');
    
    setTimeout(() => {
      saveTournamentBtn.innerHTML = originalText;
      saveTournamentBtn.classList.remove('btn-success');
    }, 2000);
  }

  function handleAddTeam(e) {
    e.preventDefault();
    
    const teamName = document.getElementById('team-name').value;
    const teamLocation = document.getElementById('team-location').value;
    const teamPoints = parseInt(document.getElementById('team-points').value);
    const booyahCount = parseInt(document.getElementById('booyah-count').value) || 0;
    const logoFile = teamLogoInput.files[0];
    
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = function(event) {
        addTeamToStorage({
          id: Date.now(),
          name: teamName,
          location: teamLocation,
          points: teamPoints,
          booyahCount: booyahCount,
          logo: event.target.result
        });
      };
      reader.readAsDataURL(logoFile);
    } else {
      addTeamToStorage({
        id: Date.now(),
        name: teamName,
        location: teamLocation,
        points: teamPoints,
        booyahCount: booyahCount,
        logo: ''
      });
    }
    
    // Reset form
    addTeamForm.reset();
    logoPreview.style.display = 'none';
    logoPreview.src = '';
  }

  function addTeamToStorage(newTeam) {
    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));
    dispatchStorageEvent();
    
    // Show success feedback
    const submitBtn = addTeamForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Team Added!';
    submitBtn.classList.add('btn-success');
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.classList.remove('btn-success');
    }, 2000);
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        logoPreview.src = event.target.result;
        logoPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }

  function filterTeams() {
    const searchTerm = teamSearch.value.toLowerCase();
    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    
    if (!searchTerm) {
      renderTeamsList(teams);
      return;
    }
    
    const filteredTeams = teams.filter(team => 
      team.name.toLowerCase().includes(searchTerm) || 
      team.location.toLowerCase().includes(searchTerm)
    );
    
    renderTeamsList(filteredTeams);
  }

  function filterAdminTeams() {
    const searchTerm = adminTeamSearch.value.toLowerCase();
    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    
    if (!searchTerm) {
      renderTeamManagementList(teams);
      return;
    }
    
    const filteredTeams = teams.filter(team => 
      team.name.toLowerCase().includes(searchTerm) || 
      team.location.toLowerCase().includes(searchTerm)
    );
    
    renderTeamManagementList(filteredTeams);
  }


function takeScreenshot() {
  const mainContent = document.getElementById('main-content');
  
  // Add a force-visible class to override styles
  mainContent.classList.add('html2canvas-capture');
  
  screenshotBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Capturing...';
  screenshotBtn.disabled = true;

  setTimeout(() => {
    html2canvas(mainContent, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollY: -window.scrollY,
      windowWidth: mainContent.scrollWidth,
      windowHeight: mainContent.scrollHeight
    }).then(canvas => {
      mainContent.classList.remove('html2canvas-capture');
      
      screenshotPreview.src = canvas.toDataURL('image/png', 1.0);
      screenshotModal.style.display = 'block';
      
      screenshotBtn.innerHTML = '<i class="fas fa-camera"></i> Capture';
      screenshotBtn.disabled = false;
    }).catch(err => {
      console.error('Screenshot error:', err);
      mainContent.classList.remove('html2canvas-capture');
      screenshotBtn.innerHTML = '<i class="fas fa-camera"></i> Capture';
      screenshotBtn.disabled = false;
      alert('Failed to capture screenshot. Please try again.');
    });
  }, 200);
}


function downloadScreenshotImage() {
  const link = document.createElement('a');
  link.download = 'tournament-standings-' + new Date().toISOString().slice(0, 10) + '.png';
  
  // Create a temporary canvas for higher quality download
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  const img = new Image();
  
  img.onload = function() {
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);
    
    // Apply slight sharpening
    tempCtx.filter = 'contrast(105%)';
    tempCtx.drawImage(tempCanvas, 0, 0);
    tempCtx.filter = 'none';
    
    link.href = tempCanvas.toDataURL('image/png', 1.0);
    link.click();
  };
  
  img.src = screenshotPreview.src;
}

  // Custom event to simulate localStorage updates within the same window
  function dispatchStorageEvent() {
    const event = new Event('localStorageUpdated');
    document.dispatchEvent(event);
  }
});

document.getElementById("captureBtn").addEventListener("click", function () {
    const standings = document.getElementById("tournamentStandings");
    html2canvas(standings, {
        scale: window.devicePixelRatio, // Higher resolution
        useCORS: true, // Allow cross-origin images
        backgroundColor: "#fff" // Solid background
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "tournament_screenshot.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});


