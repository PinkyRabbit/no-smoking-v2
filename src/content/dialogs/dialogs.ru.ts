import { Content } from "../../constants";
import { MultilineContent } from "../types";
import { NL, N2, ND, B, I, NDv2 } from "./constants";

const donate_link = process.env.DONATE_LINK;

// https://en.wikipedia.org/wiki/List_of_emojis
export const dialogsRu: MultilineContent = {
  [Content.MESSAGE]: "Received your message",
  [Content.USER_UNKNOWN]: `
    🤖 Функционал доступен только для авторизированных пользователей.${ND}
    Пожалуйста, авторизируйтесь, нажав на кнопку ниже.
  `,
  [Content.START_NEW]: `
    Привет! 🙂${N2}
    Табачные корпорации наживаются на твоём здоровье?${NL}
    Ищешь способ бросить курить?${N2}
    ${B}Разумно!${B}${N2}
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
    Время между перекурами: ${I}{{delta_time}}${I}.${N2}
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
  [Content.STAGE_1_YOU_CAN_RESET]: `
    💡Для этой фазы очень важно не пропускать моменты курения, 
    потому что на основе этого будет вычислено ваше стартовое знаечение.${N2}
    Поэтому, если вы вдруг сбились - лучше начать заново нажав на /start 
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
    Записали время ✅️${ND}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.STAGE_2_SUCCESS]: `
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
  [Content.PENALTY_3]: `
    📚 Обычно люди легко придерживаются графика курения.${NL}
    Мы заметили, что у вас стали накапливаться штрафные баллы.${NL}
    Вам нужно стабилизироваться.${NL}
    Для этого и был придуман ${B}тренировочный режим${B}!${N2}
    Настоятельно вам рекомендуем ${I}переключиться на него и стабилизироваться${I}.
  `,
  [Content.IDLE_NO_CIGARETTES]: `
    🌀 ${B}Новый день инициирован снова${B}${N2}
    Вы почему-то не отмечали ваши перекуры в прошлый раз.${NL}
    Однако тот факт, что вы не отказались от намерения бросить курить, свидетельствует о вашей настойчивости.${N2}
    Пожалуйста, не останавливайтесь!${ND}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.TIME_FOR_A_SMOKE]: "🔥 Время для перекура! 🔥",
  [Content.ON_IDLE_START]: `
    💤💤💤 ${B}Большой Интервал${B}${N2}
    За вчера вы выкурили ${B}{{cigarettes}}${B}${NL}
  `,
  [Content.ON_IDLE_END]: `
    Время следующего перекура пересчитано:${NL}
    прошлое время {{prev_delta}}${NL}
    \\- штрафные баллы {{penalty}} \\[{{penalty_mins}}\\]${NL}
    \\+ шаг {{step}}${NL}
    \\= в итоге ${I}{{new_delta}}${I}${NDv2}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.WINSTRIKE]: `
    ⚡️ Вы держитесь уже {{winstrike}}! Отлично! 
  `,
  [Content.WINSTRIKE_BASE]: `
    📚 Чтобы выйти из тренировочного режима, закончите несколько дней подряд без штрафа. {{day}} / {{of_days}}
  `,
  [Content.WINSTRIKE_BASE_FAILED]: `
    📌 Вы на ${B}тренировочном${B} уровне сложности. 
    Он нужен, чтобы вам было проще разобраться в том, как работает бот.${NL} 
    ${I}Штрафные баллы не учитываются.${I}
  `,
  [Content.WINSTRIKE_BASE_SUCCESS]: `
    🥁 Мы видим что вы уже освоились и готовы изменить сложность. Чтобы сделать это нажмите на /level
  `,
  [Content.DIFFICULTY]: `
    📈 ${B}Выберите уровень сложности${B}${N2}
    В приложении доступно три уровня сложности:${N2}
    - ${B}Тренировочный режим${B}: +0.5 минуты в день${NL}
    - ${B}Обычный${B}: +1 минута в день${NL}
    - ${B}Продвинутый${B}: +2 минуты в день${N2}
    ${B}Тренировочный режим${B} подходит для начинающих, чтобы привыкнуть соблюдать интервалы, 
    даже если вы пока нарушаете график. Это тренировочный режим, который поможет освоиться.${N2}
    Если вы готовы серьезно работать над привычкой, выбирайте ${B}Обычный${B} или ${B}Продвинутый${B}. 
    Обычный предлагает умеренный темп, а Продвинутый — более интенсивный, 
    так как шаг увеличения интервала составляет 2 минуты.${N2}
    Вы всегда можете изменить уровень сложности в настройках.
  `,
  [Content.DIFFICULTY_EASY]: "Тренировочный",
  [Content.DIFFICULTY_MEDIUM]: "Обычный",
  [Content.DIFFICULTY_HARD]: "Продвинутый",
  [Content.DIFFICULTY_SELECTED]: `
    Сложность всегда можно изменить написав /level${ND}
    Вы выбрали уровень сложности ${B}"{{difficulty}}"${B}
  `,
  [Content.DIFFICULTY_AUTO]: `
    📌 Прочтите это сообщение${N2}
    Вам установен ТРЕНИРОВОЧНЫЙ уровень сложности${ND}
    ${B}Почему важно начать с "тренировочного" уровня?${B}${N2}
    На этом этапе ${B}основная задача — разорвать привычные сценарии перекуров${B}.
    Например, когда вы курите с кофе, на остановке ожидая автобус, с коллегами на работе на перерыве, и так далее.${N2}
    Это самый трудный момент. Наша статистика показывает:${NL}
    - В ${B}первые 3 дня${B} - нарушают 95% пользователей${NL}
    - В ${B}первые 5 дней${B} — 100% пользователей${N2}
    ${I}Тренировочный режим создан как раз для того чтобы решить эту проблему.${I}${ND}
    📃 ${B}Как это работает?${B}${N2}
    ${B}1. Нажимайте кнопку "Я курю", даже если нарушаете график.${B}${NL}
    Вы сможете осознать и анализировать свои привычки, особенно где именно вы "срываетесь".${N2}
    ${B}2. Мы не накладываем штрафы на этом этапе.${B}${NL}
    Вместо этого вы будете видеть свои нарушения и постепенно учиться их контролировать.${N2}
    ${B}3. Привыкайте к системе.${B}${NL}
    С каждым днём вы будете замечать, как становитесь более дисциплинированным и перестаёте нарушать график.${ND}
    ${B}Что дальше?${B}${N2}
    Когда вы почувствуете, что нарушений стало мало или совсем нет, 
    ${B}вы можете самостоятельно перейти на более продвинутый уровень сложности${B}. 
    Штрафы будут учитываться как положено, однако вам они уже мешать не будут.${ND}
    ⬆️ ⬆️ ⬆️ ⬆️ ⬆️${NL}
    Настройка вашего аккаунта будет автоматически завершена через 1 минуту. 
    Эта пауза нужна чтобы вы прочли сообщение выше.
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
    🕰️ Выбрана временная зона: ${B}{{timezone}}${B}${N2}
    ${B}Это важно${B}❗️${NL}
    Пожалуйста, проверьте ваше текущее время.${NL}
    Наша система определяет, что у вас сейчас ${B}{{local_time}}${B}${N2}
    Конечно же, пару минут значения не имеют,${NL}
    но если время смещено на полчаса-час -${NL}
    вам нужно изменить часовой пояс.${ND}
    Ваше время сейчас ${B}{{local_time}}${B}, верно?
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
  [Content.SETTINGS_UPDATED]: `
    ${B}Ваши настройки обновлены${B} ✔️${ND}
    Следующий перекур будет после {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.SETTINGS_UPDATED_ON_IDLE]: `
    ${B}Ваши настройки обновлены${B} ✔️${ND}
    Активируйте бота нажатием на кнопку
  `,
  [Content.BOT_IGNORE]: `
    🕵️ ${B}Мы вас потеряли!${B}${N2}
    С вашего последнего взаимодействия с ботом ${I}прошло 2 дня${I}.${N2}
    Мы понимаем, что причины могут быть разные, но хотим уточнить:${NL}
    ${B}вы планируете продолжать или нет?${B}${ND}
    Возможны четыре варианта:${N2}
    1. ${I}Вы бросили курить?${I} - Тогда, поздравляем! 🎊${NL}
    Нажмите на кнопочку, мы поделимся с вами последними рекомендациями.${N2}
    2. ${I}Передумали бросать курить${I} - Что ж, печально, но это ваше право. Тогда нажмите "Не буду бросать".${N2}
    3. ${I}Были заняты и некогда было отвечать?${I} - Всё понятно, с кем не бывает! Нажмите на ${B}просто продолжим${B}.${N2}
    4. ${I}Вы отдыхали и могли случайно сбиться с графика?${I} -
      Если сбились, нажмите ${B}Штраф 10 минут${B}.${NL}
      Если график в порядке, нажмите ${B}просто продолжить${B}. 😊
  `,
  [Content.BOT_IGNORE_BUSY]: `
    ${B}Просто продолжим!${B} Прекрасно! 👍${ND}
    Мы понимаем, жизнь сейчас действительно быстрая и насыщенная.${N2}
    Именно поэтому - не бросайте затею бросить курить.${NL}
    Вам нужно просто закончить начатое.${NL}
    Сейчас ваш интервал — ${B}{{delta_time}}${B}.${N2}
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
    Чтобы активировать бота снова, нажмите start
  `,
  [Content.BOT_IGNORE_SUCCESS]: `
    🎈 Вы ${B}бросили курить${B}! 🎉${ND}
    Значит всё было не зря 👍${N2}
    Хотим дать вам пару рекомендаций:${N2}
    - Помните, первая неделя самая трудная${NL}
    - Пейте воду, с ней легче${NL}
    - Освойте новую технику. Когда что-то вас нервирует - делайте глубокий вдох. Это альтернатива ассоциации с курением.${N2}
    Курение - это обман.${NL}
    Это повод выкачать из вас деньги${N2}
    ${B}Мы очень гордимся вашим достижением!${B}${ND}
    Этот бот полностью некоммерческий.
    Я ничего не планирую с него зарабатывать.
    Однако, если вы купите кофе в благодарность - буду очень польщён.
    Чтобы сделать это, перейдите по ссылке
    и нажмите на кнопку "Donate €3".${NL}
    Ссылка: [${donate_link}](${donate_link})${NL}
    Спасибо! 👍${ND}
    Я надеюсь, что это вам не понадобится.${NL}
    Но, если всё же вы начнёте курить снова, нажмите на /start
  `,
  [Content.STATS]: `
    📋 ${B}Ваша статистика${B}:${NL}
    - Вы начали пользоваться ботом {{start_date}}${NL}
    - Дней с того момента: {{days_from_start}}${NL}
    - Всего выкурено сигарет: {{cigarettes}}${NL}
    - К вам было применено {{penalty_all}} штрафных баллов${NL}
    - Начальный интервал {{delta_min}}${NL}
    - Текущий интервал {{delta_time}}${NL}
  `,
  [Content.HOW]: `
    ${B}Как вы можете помочь автору бота:${B}${N2}
    Вы ${B}можете оказать финансовую поддержку${B} в качестве добровольного пожертвования (донат).${NL}
    Важно чтобы вы понимали - бот полностью некоммерческий.${NL}
    Это значит - сколько бы вы не пожертвовали - я не буду менять его функционал или устанавливать рекламу.${NL}
    Размер взноса установлен в 3 евро, впрочем, вы можете скинуть и больше, если есть желание.${NL}
    Ссылка: [${donate_link}](${donate_link})${N2}
    Вы ${B}можете помочь с переводом на другие языки.${B}${NL}
    Если у вас есть такое желание - напишите на электронную почту {{admin_email}} и я постараюсь ответить вам 
    в течении недели.${N2}
    Вы ${B}можете помочь боту, рассказав про него своим друзьям${B}.${NL}
    Конечно, популярность - это не то, ради чего всё затевалось.${NL}
    Но, согласитесь, если ни кто не будет о нём знать - всё бессмысленно.${N2}
    ${I}В любом случае, как бы вы не помогли, спасибо!${I}${NL}
    ${I}Мне очень важно, что вам небезразлична судьба моего проекта${I} 💓
  `,
  [Content.MAXIMUM_REACHED]: `
    ${B}⚜️ Вы достигли максимума! ⚜️${B}${N2}
    Невероятно, но факт — вы преодолели все возможные границы!${N2}
    ${I}К сожалению, наше приложение не поддерживает столь большие промежутки времени,
    поэтому дальше интервал изменяться не будет.${I}${ND}
    ${B}Если вы всё ещё не бросили курить${B}${N2}
    Пришло время оставить курение в прошлом. У вас уже огромный промежуток, и продолжать больше нет смысла.${N2}
    Ознакомьтесь с нашими рекомендациями, которые помогут вам окончательно избавиться от этой привычки.
    Просто нажмите на кнопку ниже 💙${ND}
    Желаем вам успехов в любом случае! 💪
  `,
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
  [Content.DEV_LANG]: "🕉️ Выберите язык:",
};