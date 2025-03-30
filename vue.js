const TRANSLATIONS = {
  en: {
    title: "Coffee Brewing Guide",
    greeting: "Hello",
    namePrompt: "Please introduce yourself",
    namePlaceholder: "Enter your name",
    nameError: "Please enter at least 2 characters",
    edit: "Edit",
    save: "Save",
    switchLanguage: "Switch language",
    timeRemaining: "Time remaining",
    toggleTimer: "Pause/Resume timer",
    resetTimer: "Reset timer",
    finishedTitle: "Perfect Coffee Ready!",
    finishedText: "Enjoy your specialty brew ☕",
    rateQuestion: "Rate your coffee experience:",
    stars: "stars",
    buttons: {
      back: "Back",
      next: "Next",
      finish: "Finish",
      restart: "Brew Again"
    },
    steps: [
      {
        title: "Bean Selection",
        text: "Choose freshly roasted Arabica and Robusta beans in a 70/30 ratio. Look for shiny beans with even coloration."
      },
      {
        title: "Grinding",
        text: "Use a burr grinder set to medium-coarse (like sea salt). Grind 15-18g of beans per 200ml water."
      },
      {
        title: "Equipment Prep",
        text: "Preheat equipment with 93°C water. Place filter in dripper and rinse with 100ml hot water to remove paper taste."
      },
      {
        title: "Blooming",
        text: "Pour 50ml water and let bloom for 30-45 seconds. Watch for CO2 release - it indicates fresh beans."
      },
      {
        title: "Main Brew",
        text: "Slowly pour remaining 150ml in spiral motions. Target total brew time of 3:30-4:00 minutes."
      },
      {
        title: "Serving",
        text: "Swirl carafe gently to mix flavors. Serve immediately in preheated cups at 60-65°C."
      },
      {
        title: "Evaluation",
        text: "Note aroma, acidity, body and aftertaste. Ideal coffee should be balanced with pleasant sweetness."
      }
    ]
  },
  ru: {
    title: "Гид по приготовлению кофе",
    greeting: "Привет",
    namePrompt: "Представьтесь, пожалуйста",
    namePlaceholder: "Введите ваше имя",
    nameError: "Минимум 2 символа",
    edit: "Изменить",
    save: "Сохранить",
    switchLanguage: "Переключить язык",
    timeRemaining: "Осталось времени",
    toggleTimer: "Пауза/Продолжить",
    resetTimer: "Сбросить таймер",
    finishedTitle: "Идеальный кофе готов!",
    finishedText: "Наслаждайтесь вашим напитком ☕",
    rateQuestion: "Оцените ваш кофе:",
    stars: "звёзд",
    buttons: {
      back: "Назад",
      next: "Вперед",
      finish: "Закончить",
      restart: "Приготовить снова"
    },
    steps: [
      {
        title: "Выбор зерен",
        text: "Выберите свежеобжаренные арабику и робусту в пропорции 70/30. Ищите блестящие зерна с равномерной окраской."
      },
      {
        title: "Помол",
        text: "Используйте жерновую кофемолку с помолом средней крупности (как морская соль). 15-18г зерен на 200мл воды."
      },
      {
        title: "Подготовка",
        text: "Прогрейте оборудование водой 93°C. Промойте фильтр 100мл горячей воды для устранения бумажного привкуса."
      },
      {
        title: "Блуминг",
        text: "Залейте 50мл воды и дайте постоять 30-45 секунд. Выделение CO2 указывает на свежесть зерен."
      },
      {
        title: "Основное заваривание",
        text: "Медленно долейте оставшиеся 150мл круговыми движениями. Общее время заваривания 3:30-4:00 минуты."
      },
      {
        title: "Подача",
        text: "Аккуратно взболтайте и подавайте сразу в прогретых чашках при 60-65°C."
      },
      {
        title: "Дегустация",
        text: "Оцените аромат, кислотность, тело и послевкусие. Идеальный кофе должен быть сбалансированным."
      }
    ]
  }
};

const App = {
  data() {
    return {
      activeIndex: 0,
      isFinished: false,
      currentLang: 'en',
      translations: TRANSLATIONS,
      timer: null,
      brewTime: 240,
      rating: 0,
      tempUserName: '',
      userName: localStorage.getItem('coffeeUserName') || '',
      nameConfirmed: !!localStorage.getItem('coffeeUserName'),
      nameError: false
    };
  },

  computed: {
    currentStep() {
      return this.translations[this.currentLang].steps[this.activeIndex];
    },

    isFirstStep() {
      return this.activeIndex === 0;
    },

    isLastStep() {
      return this.activeIndex === this.translations[this.currentLang].steps.length - 1;
    },

    progressWidth() {
      return ((this.activeIndex + 1) / this.translations[this.currentLang].steps.length) * 100;
    }
  },

  methods: {
    toggleLanguage() {
      this.currentLang = this.currentLang === 'ru' ? 'en' : 'ru';
      localStorage.setItem('coffeeLang', this.currentLang);
    },

    startEditing() {
      this.tempUserName = this.userName;
      this.nameConfirmed = false;
      this.$nextTick(() => {
        this.$refs.nameInput?.focus();
      });
    },

    confirmName() {
      if (this.tempUserName.trim().length >= 2) {
        this.userName = this.tempUserName.trim();
        this.nameConfirmed = true;
        this.nameError = false;
        localStorage.setItem('coffeeUserName', this.userName);
      } else {
        this.nameError = true;
        this.$refs.nameInput?.focus();
      }
    },

    prev() {
      if (this.activeIndex > 0) {
        this.resetTimer();
        this.activeIndex--;
      }
    },

    async nextOrFinish() {
      if (!this.isLastStep) {
        await this.$nextTick();
        this.activeIndex++;
        this.startBrewTimer();
      } else {
        this.finishProcess();
      }
    },

    finishProcess() {
      this.isFinished = true;
      this.resetTimer();
    },

    restart() {
      this.activeIndex = 0;
      this.isFinished = false;
      this.brewTime = 240;
      this.rating = 0;
    },

    startBrewTimer() {
      // Таймер запускается на 5-м шаге (индекс 4)
      if (this.activeIndex === 4 && !this.isFinished && !this.timer) {
        this.timer = setInterval(() => {
          if (this.brewTime > 0) {
            this.brewTime--;
          } else {
            this.resetTimer();
          }
        }, 1000);
      }
    },

    toggleTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      } else {
        this.startBrewTimer();
      }
    },

    resetTimer() {
      clearInterval(this.timer);
      this.timer = null;
      // Сброс таймера для 5-го шага (индекс 4)
      if (this.activeIndex === 4) {
        this.brewTime = 240;
      }
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },

    setRating(stars) {
      this.rating = stars;
      console.log(`User rating: ${stars} stars`);
    },

    setActive(index) {
      if (!this.isFinished && index >= 0 && index < this.translations[this.currentLang].steps.length) {
        this.resetTimer();
        this.activeIndex = index;
      }
    }
  },

  watch: {
    activeIndex(newIndex) {
      this.resetTimer();
      // Таймер запускается при переходе на 5-й шаг (индекс 4)
      if (newIndex === 4) {
        this.startBrewTimer();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    tempUserName(newVal) {
      if (newVal.trim().length >= 2) {
        this.nameError = false;
      }
    }
  },

  mounted() {
    // Восстановление языка
    const savedLang = localStorage.getItem('coffeeLang');
    if (savedLang) {
      this.currentLang = savedLang;
    }

    // Восстановление состояния
    const savedState = localStorage.getItem('coffeeAppState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.activeIndex = state.activeIndex || 0;
        this.isFinished = state.isFinished || false;
        this.brewTime = state.brewTime || 240;
        this.userName = state.userName || '';
        this.nameConfirmed = !!state.userName;
      } catch (e) {
        console.error('Error loading state:', e);
      }
    }

    // Фокус на поле ввода при первом открытии
    if (!this.nameConfirmed) {
      this.$nextTick(() => {
        this.$refs.nameInput?.focus();
      });
    }
  }
};

// Автосохранение состояния
const app = Vue.createApp(App).mount('#app');

setInterval(() => {
  const state = {
    activeIndex: app.activeIndex,
    isFinished: app.isFinished,
    brewTime: app.brewTime,
    userName: app.userName,
    currentLang: app.currentLang
  };
  localStorage.setItem('coffeeAppState', JSON.stringify(state));
}, 3000);