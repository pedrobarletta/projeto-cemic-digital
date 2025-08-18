// Contraste
function toggleContrast() {
  const wasHighContrast = document.body.classList.contains("high-contrast");
  document.body.classList.toggle("high-contrast");
  const isNowHighContrast = document.body.classList.contains("high-contrast");
  
  console.log(`🎨 Contraste alternado: ${wasHighContrast} → ${isNowHighContrast}`);
  
  // Múltiplos delays para garantir execução mesmo com conflitos
  setTimeout(() => {
    console.log('🔄 Primeiro update dos logos (50ms)');
    updateFooterLogos();
  }, 50);
  
  setTimeout(() => {
    console.log('🔄 Segundo update dos logos (150ms)');
    updateFooterLogos();
  }, 150);
  
  setTimeout(() => {
    console.log('🔄 Update final dos logos (300ms)');
    updateFooterLogos();
    
    // Atualizar carrossel se existir
    if (window.bannerCarousel) {
      window.bannerCarousel.refreshCarousel();
    }
  }, 300);
}

// Função para atualizar logos do footer baseado no modo de contraste
function updateFooterLogos() {
  const isHighContrast = document.body.classList.contains("high-contrast");
  
  console.log('🔄 updateFooterLogos executada - Modo alto contraste:', isHighContrast);
  
  // Mapeamento dos logos
  const logoMappings = {
    'logo-aldir-blanc-rodape': {
      normal: 'assets/img/logo-aldir-blanc.png',
      contrast: 'assets/img/logo-aldir-blanc-contraste.png'
    },
    'logo-governo-cultura-rodape': {
      normal: 'assets/img/logo-governo-cultura.png',
      contrast: 'assets/img/logo-governo-cultura-contraste.png'
    },
    'logo-cemic-rodape': {
      normal: 'assets/img/logo-cemic-verde.png',
      contrast: 'assets/img/logo-cemic.png'
    }
  };
  
  // Atualizar cada tipo de logo
  Object.keys(logoMappings).forEach(className => {
    const logoElements = document.querySelectorAll(`.${className}`);
    console.log(`🔍 Encontrados ${logoElements.length} elementos com classe: ${className}`);
    
    logoElements.forEach((logo, index) => {
      const mapping = logoMappings[className];
      const newSrc = isHighContrast ? mapping.contrast : mapping.normal;
      const oldSrc = logo.src;
      
      // Adicionar timestamp para evitar cache
      const cacheBuster = `?v=${Date.now()}`;
      logo.src = newSrc + cacheBuster;
      
      console.log(`📸 Logo ${className}[${index}]:`, {
        antigo: oldSrc,
        novo: logo.src,
        elemento: logo
      });
      
      // Verificar se a imagem carregou
      logo.onload = () => {
        console.log(`✅ Logo carregado com sucesso: ${newSrc}`);
      };
      
      logo.onerror = () => {
        console.error(`❌ Erro ao carregar logo: ${newSrc}`);
        // Fallback - tentar sem cache buster
        logo.src = newSrc;
      };
    });
  });
  
  console.log('🏁 updateFooterLogos finalizada');
}

// Tamanho da fonte
let fontSize = 1;
function adjustFontSize(delta) {
  fontSize += delta * 0.1;
  document.body.style.fontSize = fontSize + "em";
}

// Carrossel do Banner
class BannerCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 segundos
    this.isHovered = false;
    this.isHighContrast = false;
    
    // Configuração dos slides com imagens, links e títulos
    this.slideData = [
      {
        normal: 'assets/img/banner/banner-sepia.jpg',
        contrast: 'assets/img/banner/banner-sepia-contrast.jpg',
        link: 'sobre.html',
        title: null
      },
      {
        normal: 'conteudo acervo/foto_antonio_branco.png',
        contrast: 'conteudo acervo/foto_antonio_branco.png',
        link: 'colecao-antonio-branco.html',
        title: 'Coleção Antônio Branco'
      },
      {
        normal: 'conteudo acervo/foto_bertha_nerici_moraes.png',
        contrast: 'conteudo acervo/foto_bertha_nerici_moraes.png',
        link: 'colecao-bertha-nerici.html',
        title: 'Coleção Bertha Moraes Nérici'
      },
      {
        normal: 'conteudo acervo/livro da Polyanthea de 1925/igreja matriz.JPG',
        contrast: 'conteudo acervo/livro da Polyanthea de 1925/igreja matriz.JPG',
        link: 'colecao-imagens-historicas.html',
        title: 'Livro da Polyanthea de 1925'
      }
    ];
    
    // Arrays de compatibilidade com código existente
    this.normalImages = this.slideData.map(slide => slide.normal);
    this.contrastImages = this.slideData.map(slide => slide.contrast);
    
    this.init();
  }
  
  init() {
    this.checkContrastMode();
    this.createSlides();
    this.createIndicators();
    this.startAutoPlay();
    this.addEventListeners();
  }
  
  checkContrastMode() {
    this.isHighContrast = document.body.classList.contains('high-contrast');
  }
  
  getCurrentImages() {
    return this.isHighContrast ? this.contrastImages : this.normalImages;
  }
  
  createSlides() {
    const slidesContainer = document.getElementById('carouselSlides');
    if (!slidesContainer) return;
    
    // Limpar slides existentes
    slidesContainer.innerHTML = '';
    
    this.slideData.forEach((slideInfo, index) => {
      const slide = document.createElement('div');
      slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
      
      const imageSrc = this.isHighContrast ? slideInfo.contrast : slideInfo.normal;
      
      // Criar elemento para fundo desfocado (irmão)
      const bgBlurred = document.createElement('div');
      bgBlurred.className = 'carousel-slide-bg';
      bgBlurred.style.backgroundImage = `url('${imageSrc}')`;
      slide.appendChild(bgBlurred);
      
      // Criar elemento para imagem nítida (irmão)
      const sharpImage = document.createElement('div');
      sharpImage.className = 'carousel-slide-sharp';
      sharpImage.style.backgroundImage = `url('${imageSrc}')`;
      slide.appendChild(sharpImage);
      
      // Adicionar link se existir
      if (slideInfo.link) {
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', () => {
          window.location.href = slideInfo.link;
        });
      }
      
      // Adicionar overlay com título se existir
      if (slideInfo.title) {
        const overlay = document.createElement('div');
        overlay.className = 'carousel-slide-overlay';
        overlay.innerHTML = `<h3>${slideInfo.title}</h3>`;
        slide.appendChild(overlay);
      }
      
      slidesContainer.appendChild(slide);
    });
    
    this.slides = slidesContainer.querySelectorAll('.carousel-slide');
  }
  
  createIndicators() {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if (!indicatorsContainer) return;
    
    // Limpar indicadores existentes
    indicatorsContainer.innerHTML = '';
    
    const currentImages = this.getCurrentImages();
    
    currentImages.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
      indicator.addEventListener('click', () => this.goToSlide(index));
      indicatorsContainer.appendChild(indicator);
    });
  }
  
  refreshCarousel() {
    const previousSlide = this.currentSlide;
    this.checkContrastMode();
    
    // Atualizar imagens dos slides existentes
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
      if (this.slideData[index]) {
        const imageSrc = this.isHighContrast ? this.slideData[index].contrast : this.slideData[index].normal;
        
        // Atualizar fundo desfocado
        const bgElement = slide.querySelector('.carousel-slide-bg');
        if (bgElement) {
          bgElement.style.backgroundImage = `url('${imageSrc}')`;
        }
        
        // Atualizar imagem nítida
        const sharpElement = slide.querySelector('.carousel-slide-sharp');
        if (sharpElement) {
          sharpElement.style.backgroundImage = `url('${imageSrc}')`;
        }
      }
    });
    
    // Manter posição do slide
    if (previousSlide < this.slideData.length) {
      this.goToSlide(previousSlide);
    } else {
      this.goToSlide(0);
    }
  }
  
  goToSlide(index) {
    // Remover classe active do slide atual
    this.slides[this.currentSlide].classList.remove('active');
    document.querySelectorAll('.carousel-indicator')[this.currentSlide].classList.remove('active');
    
    // Adicionar classe active ao novo slide
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    document.querySelectorAll('.carousel-indicator')[this.currentSlide].classList.add('active');
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  previousSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (!this.isHovered) {
        this.nextSlide();
      }
    }, this.autoPlayDelay);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  addEventListeners() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      // Pausar auto-play ao passar mouse
      carouselContainer.addEventListener('mouseenter', () => {
        this.isHovered = true;
      });
      
      carouselContainer.addEventListener('mouseleave', () => {
        this.isHovered = false;
      });
    }
  }
}

// Funções globais para controles de navegação
function nextSlide() {
  if (window.bannerCarousel) {
    window.bannerCarousel.nextSlide();
  }
}

function previousSlide() {
  if (window.bannerCarousel) {
    window.bannerCarousel.previousSlide();
  }
}

// Função de teste manual (pode ser chamada no console do navegador)
function testLogoSwitch() {
  console.log('🧪 TESTE MANUAL - Alternando modo de contraste');
  
  // Forçar modo de contraste
  document.body.classList.add("high-contrast");
  console.log('✅ Modo alto contraste ATIVADO');
  updateFooterLogos();
  
  setTimeout(() => {
    // Voltar ao modo normal
    document.body.classList.remove("high-contrast");
    console.log('✅ Modo normal ATIVADO');
    updateFooterLogos();
  }, 3000);
}

// Função para forçar atualização de logos (útil para debug)
function forceLogosUpdate() {
  console.log('💪 FORÇANDO atualização dos logos');
  
  const logoClasses = ['logo-aldir-blanc-rodape', 'logo-governo-cultura-rodape', 'logo-cemic-rodape'];
  const isHighContrast = document.body.classList.contains("high-contrast");
  
  logoClasses.forEach(className => {
    const elements = document.querySelectorAll(`.${className}`);
    console.log(`🔧 Forçando update da classe: ${className} (${elements.length} elementos)`);
    
    elements.forEach((element, index) => {
      // Forçar remoção e re-aplicação da fonte
      const originalSrc = element.src;
      element.src = '';
      
      setTimeout(() => {
        updateFooterLogos();
        console.log(`🔄 Elemento ${className}[${index}] atualizado`);
      }, 100 * (index + 1));
    });
  });
}

// Tornar funções disponíveis globalmente para testes
window.testLogoSwitch = testLogoSwitch;
window.updateFooterLogos = updateFooterLogos;
window.forceLogosUpdate = forceLogosUpdate;

// Função para garantir inicialização dos logos
function ensureLogosInitialized() {
  console.log('🖼️ Garantindo inicialização dos logos');
  
  // Verificar se os elementos existem
  const logoElements = document.querySelectorAll('.logo-aldir-blanc-rodape, .logo-governo-cultura-rodape, .logo-cemic-rodape');
  
  if (logoElements.length > 0) {
    console.log(`✅ Encontrados ${logoElements.length} logos no DOM`);
    updateFooterLogos();
  } else {
    console.warn('⚠️ Nenhum logo encontrado, tentando novamente em 200ms');
    setTimeout(ensureLogosInitialized, 200);
  }
}

// Múltiplas estratégias de inicialização para garantir funcionamento
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM carregado - Inicializando CEMIC Digital');
  
  // Verificar se existe elemento do carrossel na página
  if (document.getElementById('carouselSlides')) {
    window.bannerCarousel = new BannerCarousel();
    console.log('🎠 Carrossel inicializado');
  }
  
  // Inicializar logos com múltiplos delays para garantir funcionamento
  setTimeout(ensureLogosInitialized, 50);
  setTimeout(ensureLogosInitialized, 200);
  setTimeout(ensureLogosInitialized, 500);
  
  console.log('✨ Inicialização concluída');
  console.log('💡 Funções de debug disponíveis:');
  console.log('   - testLogoSwitch() - teste automático');
  console.log('   - updateFooterLogos() - atualização manual');
  console.log('   - forceLogosUpdate() - forçar update agressivo');
});

// Backup: inicializar quando a janela terminar de carregar completamente
window.addEventListener('load', function() {
  console.log('🎯 Window load - Backup de inicialização');
  setTimeout(ensureLogosInitialized, 100);
});
