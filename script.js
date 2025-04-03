// Inicialização quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
  // Inicializar todas as funcionalidades
  initNavigation();
  initStickyHeader();
  initTestimonialSlider();
  initFaqAccordion();
  initFormValidation();
  initAnimations();
  initAccessibility(); // Nova função para melhorias de acessibilidade
  initPageLoading(); // Nova função para melhorar a experiência de carregamento
});

// Sistema de Navegação Aprimorado
function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  const body = document.body;

  // Toggle menu mobile com animação aprimorada
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      body.classList.toggle('menu-open');

      // Impede scroll do corpo quando menu está aberto
      if (body.classList.contains('menu-open')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });
  }

  // Fechar menu ao clicar fora dele
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !mobileToggle.contains(e.target)) {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('active');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    }
  });

  // Fechar menu ao clicar em um link
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('active');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    });
  });

  // Navegação suave ao clicar em âncoras - com animação aprimorada
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      // Detectar tamanho do header para ajustar offset
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const additionalOffset = 20; // Espaço adicional para melhor visualização

      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - additionalOffset;

      // Animação mais suave
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Atualizar URL sem recarregar a página
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  });

  // Ativar links de navegação baseado na seção visível - com debounce para performance
  let isScrolling;
  window.addEventListener('scroll', function () {
    // Limpar timeout anterior
    window.clearTimeout(isScrolling);

    // Definir novo timeout
    isScrolling = setTimeout(function () {
      let current = '';
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY;

      // Determinação mais precisa da seção atual
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
          item.classList.add('active');
        }
      });
    }, 50); // Debounce de 50ms
  });
}

// Header com efeito ao rolar - aprimorado
function initStickyHeader() {
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  const scrollThreshold = 50;

  if (header) {
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      // Adicionar classe quando rolar além do threshold
      if (currentScroll > scrollThreshold) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      // Ocultar cabeçalho ao rolar para baixo (opção)
      // Descomente as linhas abaixo para ativar o esconder/mostrar automático
      /*
      if (currentScroll > lastScrollTop && currentScroll > 200) {
        // Rolando para baixo
        header.style.transform = 'translateY(-100%)';
      } else {
        // Rolando para cima
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      */
    }, { passive: true }); // passive para melhor performance
  }
}

// Slider de Depoimentos - aprimorado
function initTestimonialSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');
  const testimonials = document.querySelectorAll('.testimonial');

  if (!track || testimonials.length === 0) return;

  let currentIndex = 0;
  const maxIndex = testimonials.length - 1;
  let autoplayTimeout;
  let touchStartX = 0;
  let touchEndX = 0;

  // Função para mostrar um depoimento específico com animação melhorada
  function showTestimonial(index) {
    // Adicionar animação de fade para suavizar a transição
    testimonials.forEach((testimonial, i) => {
      if (i === index) {
        testimonial.style.opacity = '1';
      } else {
        testimonial.style.opacity = '0.5';
      }
    });

    // Aplicar transformação para o slide
    track.style.transform = `translateX(-${index * 100}%)`;

    // Atualizar dots com uma transição mais suave
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    currentIndex = index;
  }

  // Configurar botões de navegação com feedback visual
  if (prevArrow) {
    prevArrow.addEventListener('click', function () {
      clearInterval(autoplayTimeout);
      this.classList.add('clicked');

      let newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = maxIndex;
      }
      showTestimonial(newIndex);

      // Remover classe de feedback após animação
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 200);
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', function () {
      clearInterval(autoplayTimeout);
      this.classList.add('clicked');

      let newIndex = currentIndex + 1;
      if (newIndex > maxIndex) {
        newIndex = 0;
      }
      showTestimonial(newIndex);

      // Remover classe de feedback após animação
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 200);
    });
  }

  // Configurar dots de navegação com feedback visual
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function () {
      clearInterval(autoplayTimeout);

      // Feedback visual
      this.classList.add('pulse');
      setTimeout(() => {
        this.classList.remove('pulse');
      }, 300);

      showTestimonial(index);
    });
  });

  // Suporte para gestos de deslize em dispositivos móveis
  if (track) {
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 50; // Limite mínimo de movimento para considerar um swipe

    if (touchStartX - touchEndX > threshold) {
      // Swipe para a esquerda - próximo slide
      let newIndex = currentIndex + 1;
      if (newIndex > maxIndex) {
        newIndex = 0;
      }
      showTestimonial(newIndex);
    }

    if (touchEndX - touchStartX > threshold) {
      // Swipe para a direita - slide anterior
      let newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = maxIndex;
      }
      showTestimonial(newIndex);
    }
  }

  // Auto-play dos depoimentos com velocidade adaptativa
  function startAutoplay() {
    autoplayTimeout = setInterval(function () {
      let newIndex = currentIndex + 1;
      if (newIndex > maxIndex) {
        newIndex = 0;
      }
      showTestimonial(newIndex);
    }, 6000);
  }

  startAutoplay();

  // Pausar auto-play quando o mouse estiver sobre o slider
  const testimonialContainer = document.querySelector('.testimonials-container');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', function () {
      clearInterval(autoplayTimeout);
    });

    testimonialContainer.addEventListener('mouseleave', function () {
      startAutoplay();
    });

    // Pausar também no toque em dispositivos móveis
    testimonialContainer.addEventListener('touchstart', function () {
      clearInterval(autoplayTimeout);
    }, { passive: true });

    testimonialContainer.addEventListener('touchend', function () {
      startAutoplay();
    }, { passive: true });
  }

  // Inicializar o primeiro slide
  showTestimonial(0);
}

// Accordion para FAQ - aprimorado
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    // Configurar alturas iniciais para animação
    answer.style.maxHeight = item.classList.contains('active') ?
      answer.scrollHeight + 'px' : '0px';

    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      // Animação suave de fechamento para os itens abertos
      faqItems.forEach(faqItem => {
        const faqAnswer = faqItem.querySelector('.faq-answer');
        if (faqItem.classList.contains('active')) {
          faqAnswer.style.maxHeight = '0px';
          faqItem.classList.remove('active');
        }
      });

      // Se não estava ativo, ativa com animação
      if (!isActive) {
        item.classList.add('active');
        // Pequeno timeout para garantir que a animação funcione corretamente
        setTimeout(() => {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }, 10);
      }

      // Adicionar feedback tátil em dispositivos móveis
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    });

    // Melhorar acessibilidade adicionando role e aria attributes
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    answer.setAttribute('aria-hidden', item.classList.contains('active') ? 'false' : 'true');

    // Permitir navegação por teclado
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });

    // Atualizar atributos ARIA quando o estado muda
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          const isActive = item.classList.contains('active');
          question.setAttribute('aria-expanded', isActive ? 'true' : 'false');
          answer.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        }
      });
    });

    observer.observe(item, { attributes: true });
  });

  // Abrir o primeiro FAQ por padrão, com animação
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');

    firstItem.classList.add('active');
    if (firstAnswer) {
      setTimeout(() => {
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
      }, 100);
    }
  }
}

// Validação de Formulário - aprimorada
function initFormValidation() {
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    // Validação em tempo real para melhor UX
    const requiredFields = contactForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      // Validação ao perder o foco
      field.addEventListener('blur', function () {
        validateField(field);
      });

      // Remover erro ao digitar
      field.addEventListener('input', function () {
        field.classList.remove('error');

        // Remover mensagem de erro associada
        const errorMessage = field.parentNode.querySelector('.field-error');
        if (errorMessage) {
          errorMessage.remove();
        }
      });
    });

    // Função para validar um campo
    function validateField(field) {
      let isValid = true;
      let errorMessage = '';

      // Remover mensagem de erro anterior
      const existingError = field.parentNode.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }

      // Validar se está vazio
      if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
      }
      // Validar email
      else if (field.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
          isValid = false;
          errorMessage = 'Digite um email válido';
        }
      }
      // Validar telefone
      else if (field.id === 'phone') {
        const phonePattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!phonePattern.test(field.value)) {
          isValid = false;
          errorMessage = 'Formato: (99) 99999-9999';
        }
      }

      if (!isValid) {
        field.classList.add('error');

        // Adicionar mensagem de erro
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.textContent = errorMessage;
        field.parentNode.appendChild(errorEl);
      } else {
        field.classList.remove('error');
      }

      return isValid;
    }

    // Envio do formulário com validação aprimorada
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Verificar se todos os campos obrigatórios estão preenchidos
      let isValid = true;

      requiredFields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        showFormMessage('Por favor, preencha todos os campos corretamente.', 'error');

        // Rolar para o primeiro campo com erro
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Simulação de envio de formulário com feedback visual melhorado
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';

      // Adicionar classe de loading ao formulário
      contactForm.classList.add('form-loading');

      // Simulando um tempo de processamento
      setTimeout(function () {
        // Aqui seria a integração com seu backend ou serviço de email
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.classList.remove('form-loading');

        showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');

        // Feedback de sucesso aprimorado
        showSuccessAnimation();
      }, 1500);
    });

    // Formatação de telefone automática
    const phoneInput = contactForm.querySelector('#phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length <= 11) {
          // Formatar como (99) 99999-9999 ou (99) 9999-9999
          if (value.length > 2) {
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
          }
          if (value.length > 10) {
            value = value.substring(0, 10) + '-' + value.substring(10);
          } else if (value.length > 9) {
            value = value.substring(0, 9) + '-' + value.substring(9);
          }
        }

        e.target.value = value;
      });
    }

    // Função para mostrar mensagens de erro/sucesso com melhor feedback visual
    function showFormMessage(message, type) {
      let messageElement = document.querySelector('.form-message');

      if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        contactForm.appendChild(messageElement);
      }

      // Configurar a mensagem com animação
      messageElement.textContent = message;
      messageElement.className = `form-message ${type}`;
      messageElement.style.display = 'block';
      messageElement.style.opacity = '0';

      // Animar entrada
      requestAnimationFrame(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
      });

      // Timer para remover a mensagem
      setTimeout(function () {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';

        setTimeout(() => {
          messageElement.style.display = 'none';
        }, 300);
      }, 5000);
    }

    // Animação de sucesso para submissão do formulário
    function showSuccessAnimation() {
      // Criar overlay para animação
      const successOverlay = document.createElement('div');
      successOverlay.className = 'success-overlay';

      const checkmark = document.createElement('div');
      checkmark.className = 'success-checkmark';
      checkmark.innerHTML = '<i class="fas fa-check"></i>';

      successOverlay.appendChild(checkmark);
      document.body.appendChild(successOverlay);

      // Animar entrada
      setTimeout(() => {
        successOverlay.classList.add('visible');
      }, 100);

      // Remover após animação
      setTimeout(() => {
        successOverlay.classList.remove('visible');
        setTimeout(() => {
          successOverlay.remove();
        }, 500);
      }, 2000);
    }
  }

  // Newsletter no footer com validação melhorada
  const footerSubscribe = document.querySelector('.footer-subscribe');
  if (footerSubscribe) {
    footerSubscribe.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');

      // Validar email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
        // Mostrar erro
        emailInput.classList.add('error');

        // Remover erro após 2 segundos
        setTimeout(() => {
          emailInput.classList.remove('error');
        }, 2000);
      } else {
        // Simular envio bem-sucedido
        emailInput.value = '';
        alert('Inscrição realizada com sucesso!');
      }
    });
  }
}

// Animações ao rolar - para elementos aparecerem gradualmente
function initAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // Função para verificar se um elemento está visível na tela
  function checkIfInView() {
    animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);

      if (isVisible) {
        element.classList.add('visible');
      }
    });
  }

  // Verificar elementos ao carregar a página
  checkIfInView();

  // Verificar elementos ao rolar a página
  window.addEventListener('scroll', checkIfInView, { passive: true });
}

// Função para melhorar a experiência de carregamento da página
function initPageLoading() {
  const pageLoading = document.createElement('div');
  pageLoading.className = 'page-loading';

  const logo = document.createElement('img');
  logo.src = 'logo.png';
  logo.alt = 'Logo Carregando';
  logo.className = 'loading-icon';

  const loadingText = document.createElement('div');
  loadingText.className = 'loading-text';
  loadingText.textContent = 'CARREGANDO...';

  pageLoading.appendChild(logo);
  pageLoading.appendChild(loadingText);
  document.body.appendChild(pageLoading);

  // Remover tela de carregamento após conteúdo estar pronto
  window.addEventListener('load', function () {
    setTimeout(() => {
      pageLoading.classList.add('loaded');
      setTimeout(() => {
        pageLoading.remove();
      }, 800);
    }, 500);
  });
}

// Função para melhorias de acessibilidade
function initAccessibility() {
  // Adicionar skip link para acessibilidade
  const skipLink = document.createElement('a');
  skipLink.href = '#content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Pular para o conteúdo';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Melhorar acessibilidade de formulários
  const formLabels = document.querySelectorAll('form label');
  formLabels.forEach(label => {
    const forAttr = label.getAttribute('for');
    if (forAttr) {
      const input = document.getElementById(forAttr);
      if (input && !input.getAttribute('aria-labelledby')) {
        input.setAttribute('aria-labelledby', forAttr);
      }
    }
  });
}