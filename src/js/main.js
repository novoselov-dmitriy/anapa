import Swiper from 'swiper/bundle';

function scrollTo() {
  const headerNav = document.querySelector('.header-nav');
  const overlay = document.querySelector('.overlay');
  const body = document.querySelector('body');
  const smoothLinks = document.querySelectorAll('a[href^="#"]');

  for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
      e.preventDefault();
      const id = smoothLink.getAttribute('href');

      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      body.classList.remove('_lock');
      overlay.classList.remove('_active');
      headerNav.classList.remove('_active');
    });
  };
}

function mobileHeaderNav() {
  const navIcon = document.querySelector('.nav-icon');
  const headerNav = document.querySelector('.header-nav');
  const overlay = document.querySelector('.overlay');
  const body = document.querySelector('body');

  navIcon.addEventListener('click', () => {
    body.classList.add('_lock');
    overlay.classList.add('_active');
    headerNav.classList.add('_active');
  });

  document.addEventListener('click', (e) => {
    const target = e.target;
    const itsHeaderNav = target == headerNav || headerNav.contains(target);
    const itsNavIcon = target == navIcon;
    const headerNavIsActive = headerNav.classList.contains('_active');

    if ( !itsHeaderNav && !itsNavIcon && headerNavIsActive ) {
      body.classList.remove('_lock');
      overlay.classList.remove('_active');
      headerNav.classList.remove('_active');
    }
  });
}

function inputPhoneMask() {
  [].forEach.call(document.querySelectorAll('[name="phone"]'), (input) => {
    let keyCode;

    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      let pos = this.selectionStart;

      if ( pos < 3 ) event.preventDefault();

      let matrix = '+7 (_ _ _) _ _ _ - _ _ - _ _ ',
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function(a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });

        i = new_value.indexOf("_");

        if (i != -1) {
          i < 5 && (i = 3);
          new_value = new_value.slice(0, i)
        }

        let reg = matrix.substr(0, this.value.length).replace(/_+/g, (a) => { return "\\d{1," + a.length + "}" }).replace(/[+()]/g, "\\$&");

        reg = new RegExp("^" + reg + "$");

        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
      }

      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
      input.addEventListener("keydown", mask, false)
  });
}

function ajaxSendForm() {
  let form = document.querySelector('#form-footer');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var formData = {
      name: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      phone: document.querySelector('input[name="phone"]').value
    };

    var request = new XMLHttpRequest();

    request.addEventListener('load', function() {
      form.innerHTML = '<div class="contact-form__success"><h4 class="contact-form__title">Спасибо!<br> Ваша заявка успешно отправлена.</h4><div class="contact-form__text">Наш менеджер свяжется с Вами ближайшее время, чтобы обсудить детали</div></div>';
      form.reset();
    });

    request.open('POST', '/send.php', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('name=' + encodeURIComponent(formData.name) + '&email=' + encodeURIComponent(formData.email) + '&phone=' + encodeURIComponent(formData.phone));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  scrollTo();
  mobileHeaderNav();
  inputPhoneMask();

  const heroSwiper = new Swiper('.hero__slider', {
    loop: true,
    slidesPerView: 1,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  const achievementsSwiper = new Swiper('.achievements__slider', {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1.5,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 20,
      }
    }
  });

  ajaxSendForm();
});