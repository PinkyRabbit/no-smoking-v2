import { Content } from "../keys";
import { MultilineContent } from "./types";
import { NL, N2, ND, B, I } from "./constants";

// https://en.wikipedia.org/wiki/List_of_emojis
export const contentRu: MultilineContent = {
  [Content.MESSAGE]: "Received your message",
  [Content.USER_UNKNOWN]: `
    🤖 Функционал доступен только для авторизированных пользователей.${ND}
    Пожалуйста, авторизируйтесь, нажав на кнопку ниже.
  `,
  [Content.START_NEW]: `
    Привет!${N2}
    Табачные корпорации наживаются на твоём здоровье?${N2}
    Ищешь способ бросить курить?${N2}
    Разумно!${N2}
    Вместе мы это сможем 🤙${ND}
    Supported languages${NL}
    Click here ➤ /lang ${NL}
    🇷🇺 🇬🇧 
  `,
  [Content.START_EXISTING]: `
    Привет! ✌️${N2}
    Мы видим что ты уже сделал некоторый прогресс в нашем приложении.${NL}
    Твой аккаунт снова активирован!${N2}
    Возможны три варианта:${N2}
    1. Полностью сбросить аккаунт.${NL}
    Тогда ты ${B}начнёшь с этапа 1${B}.${NL} 
    Время между перекурами: ${I}СБРОШЕНО${I}.${N2}
    2. Очистить прогресс.${NL}
    Ты ${B}начнёшь с этапа 2${B}, но начальное время сбросится.${NL} 
    Время между перекурами: ${I}{{min_delta}}${I}.${N2}
    3. Оставить как есть.${NL}
    Ты продолжаешь с момента, как оставил аккаунт.${NL}
    ${B}Не рекомендуется${B}.${NL}
    Время между перекурами: ${I}{{real_delta}}${I}.${N2}
  `,
  [Content.START_EXISTING_STAGE_1]: `
    Привет! ✌️${N2}
    Твой аккаунт повторно активирован,${NL}
    все данные обновлены.${N2}
    Тебе нужно снова пройти Этап 1 ⤵️ 
  `,
  [Content.START_RESET_IGNORE]: `
    Вы выбрали "${B}оставить всё как есть${B}".${NL}
    Это полностью ваше право.${NL}
    Вы сможете в любой момент сбросить весь прогресс написав /start${ND}
    ⚔️ ${B}Этап 2${B} активирован ⚔️${N2}
    Стартовое время между перекурами${NL}
    установлено на ${B}{{delta_time}}${B}.${N2}
    Время следующего перекура будет вычислено, когда в следующий раз нажмёшь на кнопочку "${B}Я КУРЮ${B}".
  `,
  [Content.START_RESET_TO_STAGE_1]: `
    Ваш прогресс ${B}польностью очищен${B}.${N2}
    Это лучшее решение 👑${ND}
    Тебе нужно снова пройти Этап 1 ⤵️ 
  `,
  [Content.START_RESET_TO_STAGE_2]: `
    Вы выбрали "${B}Сбросить до этапа 2${B}".${NL}
    Текущий прогресс этапа обнулён.${ND}
    ⚔️ ${B}Этап 2${B} активирован ⚔️${N2}
    Стартовое время между перекурами${NL}
    установлено на ${B}{{delta_time}}${B}.${N2}
    Время следующего перекура будет вычислено, когда в следующий раз нажмёшь на кнопочку "${B}Я КУРЮ${B}".
  `,
  [Content.LANG]: "Please choose a language to use:",
  [Content.LANG_APPLIED]: "🇷🇺 Был установлен русский язык.",
  [Content.STAGE_1]: `
    ${B}Этап 1${B}${N2}
    Для начала нам нужно понять, как часто ты куришь.${NL} 
    Мы будем опираться от этого времени в дальнейшем.${N2}
    Чтобы это сделать - давай 20 раз замерим расстрояние 
    между твоими перекурами. Это всего лишь одна пачка.${N2}
    Слишком большие и маленькие интерваллы не будут иметь 
    никакого значения. Поэтому не нужно волноваться, если 
    ты пойдёшь спать или просто забудешь нажать на кнопку.${N2}
    Окей. Давай начнём.${ND}
    Когда в следующий раз ты захочешь курить - нажми на кнопочку "${B}Я КУРЮ${B}".
  `,
  [Content.FIRST_STEP]: `
    Ваше время учтено!${N2}
    Поздравляем! Вы сделали первый шаг! 👍${N2}
    Главное не останавливаться и не забывать нажимать на кнопку всякий раз когда курите.${ND}
    ✅️ осталось {{stage_1_left}} раз
  `,
  [Content.STAGE_1_IGNORE_MIN]: `
    Вы слишком часто нажимаете на кнопку.${N2}
    Минимальный интервал для учёта составляет {{min_stage_1}} минут.${ND}
    💢 осталось {{stage_1_left}} раз
  `,
  [Content.STAGE_1_IGNORE_MAX]: `
    Минимальный интервал для учёта составляет {{max_stage_1}} минут.${N2}
    Мы не будем учитывать такие большие промежутки, чтобы корректно рассчитать время для курения.${N2}
    Не забудьте в следующий раз нажать кнопочку "${B}Я КУРЮ${B}".${ND}
    💫 Осталось {{stage_1_left}} раз
  `,
  [Content.STAGE_1_PROCESSING]: `
    Ваше время учтено!${ND}
    ✅️ осталось {{stage_1_left}} раз
  `,
  [Content.STAGE_1_END]: `
    ${B}Этап 1 пройден! 🎉${B}${N2}
    Поздравляем Вас!${N2}
    Благодаря вашему упорству, мы смогли высчитать среднее время, с которого мы можем начать.${NL}
    Оно составляет ${B}{{delta_time}}${B}.${ND}
    Переходим ко второму этапу ⤵️ 
  `,
  [Content.STAGE_2]: `
    ${B}Этап 2${B}${N2}
    Теперь мы будем пробовать придерживаться графика курения.${NL}
    Каждый день мы будем сдвигать его на несколько минут в зависимости от выбранного уровня сложности.${N2}
    Изначально мы выберем уровень сложности ${B}Максимальный${B}.${NL}
    Это не зависимость - всего лишь привычка!${NL}
    Вы можете себя побороть!${N2}
    Тем не менее, потом вы можете изменить уровень сложности на более простой.${N2}
    Если вдруг вы нарушите время - не беда.${NL} 
    Просто не забудьте нажать на кнопочку "${B}Я КУРЮ${B}".${NL}
    Мы это учтём, но это не остановит наш прогресс.${N2}
    Итак, начали!${ND}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.PENALTY]: `
    В приложении существует мотивирующая система штрафов.${N2}
    Если вы не соблюдаете график - мы незначительно уменьшаем сложность.${N2}
    Штраф будет применён после следующей большой паузы.${ND}
    🚭 Текущее число штрафных баллов: ${B}{{penalty}}${B}
  `,
  [Content.TIME_FOR_A_SMOKE]: "🔥 Время для перекура! 🔥",
  [Content.ON_IDLE_START]: `💤💤💤 ${B}Большой Интервал${B}${N2}`,
  [Content.ON_IDLE_END]: `
    Время следующего перекура пересчитано и составляет {{new_delta}}.${ND}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  // dev
  [Content.DEV]: `
    ⚒️ ${B}Мы перешли в режим разработки${B} ⚒️${N2} 
    Выберите действие:
  `,
  [Content.DEV_OFF]: "Разработка отключена ⛔️",
  [Content.DEV_USER_DELETED]: "🔮 Пользователь удалён /start",
  [Content.DEV_TO_STAGE_1]: "🔮 Пользователь сброшен до stage 1",
  [Content.DEV_FILL_STAGE_1]: "🔮 Stage 1 заполнено, {{stepsAdded}} шагов добавлено",
  [Content.DEV_LAST_TIME_MINUS_HOUR]: "🔮 Last time установлен на 1 час назад",
  [Content.DEV_STAGE_1_MORE_THAN_MAX]: "🔮 Last time установлено больше максимального",
  [Content.DEV_TO_IDLE]: "🔮 Пользователь переключен в режим сна",
};