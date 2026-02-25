document.addEventListener('DOMContentLoaded', function () {
  var burger = document.getElementById('navburger');
  var menu = document.getElementById('navmenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', function () {
    var expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });

  // Close menu when a nav link is clicked (mobile UX)
  var links = menu.querySelectorAll('.navbar-link');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      burger.classList.remove('is-active');
      menu.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
});
