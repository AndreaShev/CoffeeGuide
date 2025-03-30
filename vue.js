// Объект с переводами для интерфейса
const TRANSLATIONS = {
  en: {
    /* Переводы на английский */
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
    /* Переводы на русский */
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
     // Реактивные данные
    return {
      activeIndex: 0, // Индекс текущего шага
      isFinished: false, // Флаг завершения
      currentLang: 'ru', // Русский язык по умолчанию
      translations: TRANSLATIONS, // Объект переводов
      timer: null, // Ссылка на таймер
      brewTime: 240, // Время заваривания (4 минуты)
      rating: 0, // Текущий рейтинг
      tempUserName: '', // Временное имя пользователя
      userName: localStorage.getItem('coffeeUserName') || '', // Имя из хранилища
      nameConfirmed: !!localStorage.getItem('coffeeUserName'), // Подтверждение имени
      nameError: false // Ошибка ввода имени
    };
  },

  computed: {
       // Вычисляемые свойства
    currentStep() {
         // Текущий шаг с переводом
      return this.translations[this.currentLang].steps[this.activeIndex];
    },

    isFirstStep() {
       // Проверка первого шага
      return this.activeIndex === 0;
    },

    isLastStep() {
          // Проверка последнего шага
      return this.activeIndex === this.translations[this.currentLang].steps.length - 1;
    },

    progressWidth() {
        // Ширина прогресс-бара в %
      return ((this.activeIndex + 1) / this.translations[this.currentLang].steps.length) * 100;
    }
  },

  methods: {
     // Методы приложения
    toggleLanguage() {
      // Переключение языка
      this.currentLang = this.currentLang === 'ru' ? 'en' : 'ru';
      localStorage.setItem('coffeeLang', this.currentLang);
      // Сохранение в хранилище
    },

    startEditing() {
       // Начало редактирования имени
      this.tempUserName = this.userName;
      this.nameConfirmed = false;
      this.$nextTick(() => {
        this.$refs.nameInput?.focus(); // Фокус на поле ввода
      });
    },

    confirmName() {
      // Подтверждение имени
      if (this.tempUserName.trim().length >= 2) {
        this.userName = this.tempUserName.trim();
        this.nameConfirmed = true;
        this.nameError = false;
        localStorage.setItem('coffeeUserName', this.userName);
        // Сохранение имени
      } else {
        this.nameError = true; // Ошибка, если имя слишком короткое
        this.$refs.nameInput?.focus(); // Возврат фокуса
      }
    },

    prev() {
        // Переход к предыдущему шагу
      if (this.activeIndex > 0) {
        this.resetTimer();
        this.activeIndex--;
      }
    },

    async nextOrFinish() {
         // Переход к следующему шагу или завершение
      if (!this.isLastStep) {
        await this.$nextTick();
        this.activeIndex++;
        this.startBrewTimer();
      } else {
        this.finishProcess();
      }
    },

    finishProcess() {
        // Завершение процесса
      this.isFinished = true;
      this.resetTimer();
    },

    restart() {
      // Перезапуск процесса
      this.activeIndex = 0;
      this.isFinished = false;
      this.brewTime = 240;
      this.rating = 0;
    },

    startBrewTimer() {
       // Запуск таймера заваривания
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
            // Пауза/продолжение таймера
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      } else {
        this.startBrewTimer();
      }
    },

    resetTimer() {
          // Сброс таймера
      clearInterval(this.timer);
      this.timer = null;
      if (this.activeIndex === 4) {
        this.brewTime = 240; // Сброс времени
      }
    },

    formatTime(seconds) {
       // Форматирование времени
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },

    setRating(stars) {
       // Установка рейтинга
      this.rating = stars;
      console.log(`User rating: ${stars} stars`);
    },

    setActive(index) {
      // Переход к конкретному шагу
      if (!this.isFinished && index >= 0 && index < this.translations[this.currentLang].steps.length) {
        this.resetTimer();
        this.activeIndex = index;
      }
    }
  },

  watch: {
     // Наблюдатели за изменениями
    activeIndex(newIndex) {
         // При изменении активного шага
      this.resetTimer();
      if (newIndex === 4) {
        this.startBrewTimer();
        // Автозапуск таймера на 4 шаге
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Прокрутка вверх
    },

    tempUserName(newVal) {
          // При изменении временного имени
      if (newVal.trim().length >= 2) {
        this.nameError = false; // Сброс ошибки
      }
    }
  },

  mounted() {
    // Хук монтирования компонента
    const savedLang = localStorage.getItem('coffeeLang');
    if (savedLang) {
      this.currentLang = savedLang;
      // Восстановление языка
    }

    const savedState = localStorage.getItem('coffeeAppState');
    if (savedState) {
      try {
            // Восстановление состояния
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

    if (!this.nameConfirmed) {
      this.$nextTick(() => {
        this.$refs.nameInput?.focus();
        // Автофокус на поле ввода
      });
    }
  }
};
// Создание и монтирование приложения Vue
const app = Vue.createApp(App).mount('#app');
// Автосохранение состояния каждые 3 секунды
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