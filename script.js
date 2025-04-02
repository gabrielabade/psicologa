// Manipulação do Menu Mobile
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  if (mobileToggle.querySelector('i').classList.contains('fa-bars')) {
    mobileToggle.querySelector('i').classList.remove('fa-bars');
    mobileToggle.querySelector('i').classList.add('fa-times');
  } else {
    mobileToggle.querySelector('i').classList.remove('fa-times');
    mobileToggle.querySelector('i').classList.add('fa-bars');
  }
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    mobileToggle.querySelector('i').classList.remove('fa-times');
    mobileToggle.querySelector('i').classList.add('fa-bars');
  });
});

// Header com scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }
});

// Navegação suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Menu ativo com scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// Carrossel de depoimentos
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const testimonialTrack = document.querySelector('.testimonials-track');
const testimonials = document.querySelectorAll('.testimonial');

let currentTestimonial = 0;

function showTestimonial(index) {
  const translateValue = -index * 100 + '%';
  testimonialTrack.style.transform = `translateX(${translateValue})`;

  testimonialDots.forEach(dot => dot.classList.remove('active'));
  testimonialDots[index].classList.add('active');

  currentTestimonial = index;
}

testimonialDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showTestimonial(index);
  });
});

// Auto-scroll dos depoimentos
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 5000);

// Accordion para FAQ
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Fecha todos os itens
    faqItems.forEach(faqItem => {
      faqItem.classList.remove('active');
    });

    // Se não estava ativo, ativa
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Validação do formulário
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Simulação de envio de formulário
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  // Simulando um tempo de processamento
  setTimeout(() => {
    // Aqui seria a integração com seu backend ou serviço de email
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');

    // Resetar o formulário
    contactForm.reset();

    // Restaurar botão
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }, 1500);
});

// Animação de entrada para elementos
function revealOnScroll() {
  const elements = document.querySelectorAll('.service-card, .approach-item, .testimonial-card, .faq-item, .contact-item');

  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add('reveal');
    }
  });
}

// Adicionar classe reveal no CSS para criar a animação
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Inicializar o estado do FAQ
// Abrir o primeiro item por padrão
if (faqItems.length > 0) {
  faqItems[0].classList.add('active');
}