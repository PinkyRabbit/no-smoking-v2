import { Content } from "../../constants";
import { MultilineContent } from "../types";
import { NL, N2, ND, B, I, NDv2 } from "./constants";

// https://en.wikipedia.org/wiki/List_of_emojis
export const dialogsRu: MultilineContent = {
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
    Минимальный интервал для учёта составляет {{min_stage_1}}.${ND}
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
    Благодаря вашему упорству, мы смогли высчитать среднее время, с которого мы можем начать.${N2}
    Оно составляет ${B}{{delta_time}}${B}.${ND}
    Переходим ко второму этапу ⤵️ 
  `,
  [Content.STAGE_2_INITIAL]: `
    ${B}Всё готово${B}${N2}
    Теперь мы будем пробовать придерживаться графика курения.${NL}
    Каждый день мы будем сдвигать его на несколько минут в зависимости от выбранного уровня сложности.${N2}
    Если вдруг вы нарушите время - не беда.${NL} 
    Просто не забудьте нажать на кнопочку "${B}Я КУРЮ${B}".${NL}
    Мы это учтём, но это не остановит наш прогресс.${N2}
    Итак, начали!${ND}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.STAGE_2]: `
    Время учтено. Вы выдержали 👍${ND}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.STAGE_2_IGNORE_MIN]: `
    Вы слишком часто нажимаете на кнопку.${NL}
    Минимальный интервал для учёта составляет {{min_interval}}.
  `,
  [Content.STAGE_2_PROPS_MISSING]: `
    💢 Ошибка. Не надены настройки.${N2}
    Для доступа к этой команде ваш пользоваль должен быть полностью настроен.${ND}
    Если вы считаете что это ошибка - напишите разработчику на {{admin_email}}
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
    Время следующего перекура пересчитано:${NL}
    прошлое время {{prev_delta}}${NL}
    \\- штрафные баллы {{penalty}}${NL}
    \\+ шаг {{step}}${NL}
    \\= в итоге ${I}{{new_delta}}${I}${NDv2}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.DIFFICULTY]: `
    📈 ${B}Выберите уровень сложности.${B}${N2}
    В приложении есть три уровня сложности:${NL}
    - Лёгкий - 0.5 минуты в день${NL}
    - Обычный - 1 минута в день${NL}
    - Тяжёлый - 2 минуты в день${N2}
    Легче и логичнее всего человек себя ощущает${NL}
    ${B}на лёгком уровне${B} сложности.${N2}
    На тяжёлом уровне сложности выстоять почти нереально.${NL}
    Однако он добавлен для того, чтобы после того как вы встретитесь с реальной проблемой,${NL}
    вы просто переключите уровень сложности на лёгкий и бросите курить.${ND}
    Если вы не торопитесь, мы рекомендуем выбрать${NL}
    ${I}Лёгкий уровень сложности${I}.${NL}
    Если хотите бросить побыстрее - выбирайте тяжёлый.${N2}
  `,
  [Content.DIFFICULTY_EASY]: "Легко",
  [Content.DIFFICULTY_MEDIUM]: "Нормальный",
  [Content.DIFFICULTY_HARD]: "Тяжёлый",
  [Content.DIFFICULTY_SELECTED]: `
    Сложность всегда можно изменить написав /level${ND}
    Вы выбрали уровень сложности ${B}"{{difficulty}}"${B}
  `,
  [Content.TIMEZONE]: `
    🌐 ${B}Установка часового пояса${B}${N2}
    Чтобы установить часовой пояс сделайте следующее:${N2}
    1. Зайдите в ${B}Google${B} и напишите "timezone"${NL}
    2. Под поиском сразу в скобочках будет написана ваша временная зона${NL}
    3. Скопируйте её без скобочек и ${B}отправьте${B}${ND}
    [Нажмите для перехода в Google](https://www.google.com/search?q=my+timezone)
  `,
  [Content.TIMEZONE_INTRO]: `
    Чтобы отображать время корректно, нам нужно определить ваш часовой пояс.
  `,
  [Content.TIMEZONE_SELECTED]: `
    🕰️ Выбрана временная зона: ${B}{{timezone}}${B}${ND}
    Настройки можно изменить её в любой момент, написав /timezone
  `,
  [Content.TIMEZONE_INVALID]: `
    💢 Ошибка. Не верная таймзона.${NL}
    Пример верной таймзоны: GMT+2${NL}
    Попробуйте ещё раз
  `,
  [Content.SETTINGS]: `
    ${B}Этап 2. Донастройка.${B}${NL}
    Нужно настроить время и уровень сложности
  `,
  [Content.SETTINGS_DONE]: `
    ${B}Настройка аккаунта завершена!${B} 🎉${NL}
    Используйте бота ⤵️ 
  `,
  [Content.BOT_IGNORE]: `
    🕵️ ${B}Мы вас потеряли!${B}${N2}
    С вашего последнего взаимодействия с ботом ${I}прошло 2 дня${I}.${N2}
    Мы понимаем, что причина может быть различная, 
    но давайте проясним, планируете ли вы продолжить или нет.${ND}
    ${B}Возможны четыре варианта:${B}${N2}
    1. ${I}Вы бросили курить${I} - Тогда, поздравляем! Нажмите на кнопочку, мы отправим вам последние рекомендации.${N2}
    2. ${I}Вы передумали бросать курить${I} - Что ж, печально, но это ваше право. Тогда нажмите "Не буду бросать".${N2}
    3. ${I}Вы были заняты${I} - были чем-то заняты и вам было не до бота. Бывает. Тогда нажмите на "Был занят".${N2}
    4. ${I}Вы отдыхали${I} - где-то отдыхали и курили без графика. Если вы нарушили график - нажмите "Начислить штраф 10".
    Если считаете что не нарушали график курения - выберите "Был занят".
  `,
  [Content.BOT_IGNORE_BUSY]: `
    Вы выбрали опцию "${B}Был занят${B}" 💼${ND}
    Вполне можно это понять.${NL}
    Мир сегодня такой быстрый и сложный.${N2}
    Именно поэтому - не бросайте затею бросить курить.${NL}
    Вам нужно просто закончить начатое.${N2}
    Ваш интервал между перекурами составляет ${B}{{delta_time}}${B}.${N2}
    В следующий раз нажмите, пожалуйста, на "${B}Я КУРЮ${B}".
  `,
  [Content.BOT_IGNORE_PENALTY_10]: `
    Вы выбрали "${B}штраф 10 минут${B}".
    Если вы считаете, что нарушили свой распорядок - это лучший вариант.${N2}
    Нам крайне важно, что вы решили продолжить 👍${ND}
    Ваш интервал пересчитан ♨️${N2}
    К вам применён штраф ${I}10 минут${I}${NL}
    Ваше стартовое значение ${I}{{delta_min}}${I}${NL}
    Новый интервал между перекурами составляет ${B}{{delta_time}}${B}.${N2}
    В следующий раз, когда будете курить, нажмите, пожалуйста, на "${B}Я КУРЮ${B}".
  `,
  [Content.BOT_IGNORE_FAILED]: `
    Вы решили ${B}не бросать${B} 🤯${ND}
    Очень надеемся, что позже вы передумаете.${N2}
    Бот больше не будет отправлять вам сообщения.${N2}
    Чтобы активировать бота снова, нажмите на /start
  `,
  [Content.BOT_IGNORE_SUCCESS]: "",
  // dev
  [Content.DEV]: `⚒️ ${B}Мы перешли в режим разработки${B} ⚒️`,
  [Content.DEV_OFF]: "Разработка отключена ⛔️",
  [Content.DEV_USER_DELETED]: "Пользователь удалён /start",
  [Content.DEV_TO_STAGE_1]: "🤖 Пользователь сброшен до stage 1",
  [Content.DEV_FILL_STAGE_1]: "🤖 Stage 1 заполнено, {{stepsAdded}} шагов добавлено",
  [Content.DEV_LAST_TIME_MINUS_HOUR]: "🤖 Last time установлен на 1 час назад",
  [Content.DEV_STAGE_1_MORE_THAN_MAX]: "🤖 Last time установлено больше максимального",
  [Content.DEV_TO_IDLE]: "🤖 Пользователь переключен в режим сна",
  [Content.DEV_NEXT]: "🤖 Следующее время перекура наступит через 1 минуту",
  [Content.DEV_MOTIVIZER]: "🤖 Мотивайзер обновлён",
  [Content.DEV_IGNORE]: "🤖 Пользователь переведён в режим ожидания",
};