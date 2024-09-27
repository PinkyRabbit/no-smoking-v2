import { Content } from "../keys";
import { MultilineContent } from "./types";
import { NL, N2, ND, B, I } from "./constants";

// https://en.wikipedia.org/wiki/List_of_emojis
export const contentRu: MultilineContent = {
  [Content.MESSAGE]: "Received your message",
  [Content.USER_UNKNOWN]: `
    🤖 Функционал бота доступен только для авторизированных пользователей.${ND}
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
    Вы слишком часто нажимаете на кнопку.${N2}
    Минимальный интервал для учёта составляет {{max_stage_1}} минут.${ND}
    💢 осталось {{stage_1_left}} раз
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
  // "greetings": "Привет. Этот бот нужен для того чтобы бросить курить. Идея проста - жмёшь кнопку \"Я курю\", когда куришь, бот фиксирует время и потом подсказывает интервал между перекурами. Обычно для выведения графика курения боту достаточно полторы пачки сигарет - иногда быстрее.\nКак эффективнее пользоваться ботом можно узнать нажав на /faq\n\nЕсли вы с первого раза не разберётесь - вы можете сбросить вашу статистику написав боту 0.\n\nВо время вашего следующего перекура не забудьте нажать на кнопочку.",
  // "faq": "Поддерживаемые языки:\n/en /ru\n\nВопрос-ответ:\n\nВ: *Как убрать кнопку?*\nО: Нужно нажать на /smoking Чтобы вернуть её назад - переключите язык.\n\nВ: *В чём смысл бота?*\nО: Вы сами себя контролируете. Сперва бот записывает интервалы между перекурами, а, потом, подсказывает, когда наступает ваш следующий перекур. Если вы сами себя ограничите даже на минутку - вы не заметите, как бросите курить.\n\nВ: *То есть, нужно курить строго по расписанию?*\nО: Нет. Вы можете курить когда угодно. Главное кнопку не забывайте нажимать. Идея в том, что вы сами себя ограничиваете когда хотите.\n\nВ: *Курить нужно после того как бот разрешит?*\nО: Конечно же нет. Бот просто подсказывает, как часто вы курите. Вы можете покурить не дожидаясь команды от бота. Главное нажать на кнопку не забудьте.\n\nВ: *Я покурил и забыл нажать на кнопку*\nО: Самое эффективное - нажимать на кнопку в момент когда вы начинаете курить. Но, если вы пропустили - не смертельно. Нажмите когда вспомнили. Это лучше чем не нажать - время не запишется.\n\nВ: *Как я могу помочь проекту?*\nО: Вы можете помочь с переводами. Предложите ваши переводы вот тут: https://github.com/PinkyRabbit/no-smoking/tree/master/app/locales . Если непонятно как - спросите меня.\nНу и, хостинг проекта - не бесплатен. Любая поддержка будет полезной. С любыми идеями стучите мне в телеграм https://t.me/PinkyaRabbit",
  // "select_locale": "Вы выбрали русский язык 🇷🇺",
  // "error_user_not_found": "Вы не инициированы. Не могу вас определить. Нажмите на /start",
  // "i_smoked": "Я сейчас курю 🚬",
  // "time_accounted": "🧬 Время учтено 🧬",
  // "time_accounted_but_more_intervals_needed": "🧬 Время учтено 🧬\n\nБот выстраивает ваш график курения.\nПродолжайте пользоваться.",
  // "hours": " {{hours}} ч",
  // "mins": " {{mins}} мин",
  // "next": "\n\n⏱ До следующего перекура {{nextTimeText}}.\nЯ вам напомню про это.\nЕсли вам не нужно напоминать - нажмите /skip",
  // "time_to_smoke": "🔥 Время для перекура! 🔥",
  // "dont_disturb": "🤷‍♂️ Не хотите - не буду напоминать. Просто нажмите на кнопочку, когда покурите.",
  // "reset": "✨ Ваша статистика полностью очищена ✨\nТеперь вы можете начать заново :)"
};