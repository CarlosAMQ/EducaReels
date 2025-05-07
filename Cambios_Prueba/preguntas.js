function showScrum() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("scrumPage").style.display = "flex";
}

function showPmBook() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("pmbookPage").style.display = "flex";
}

function goBack() {
  document.getElementById("scrumPage").style.display = "none";
  document.getElementById("pmbookPage").style.display = "none";
  document.getElementById("menu").style.display = "flex";
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  // Ocultar sidebar automáticamente en móvil después de seleccionar
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('active'));
  }
}

function toggleSidebar(sidebarId) {
  document.getElementById(sidebarId).classList.toggle('active');
}