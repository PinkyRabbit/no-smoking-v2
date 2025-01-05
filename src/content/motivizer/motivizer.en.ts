import { B, NL } from "../dialogs/constants";

const motivations: string[] = [
  `
    Motivational messages appear during each Long Break
    and are designed to remind us why we are doing this.
  `,
  `
    Probably every smoker has a favorite item ruined by a cigarette.
    Someone burned their jacket, someone else - their favorite dress, or
    the white car ceiling turned yellow. And it’s all because of this silly habit!
  `,
  `
    Do you know how long people have been smoking "for money"? Since the 16th century!
    Yes, even back then, people started selling tobacco.
    It’s an insanely profitable business built on people’s health.
  `,
  `
    The main target audience of the tobacco industry is people aged 15 to 25.
    This is because if someone starts smoking at this age, they’re unlikely to quit.
    Tobacco is advertised everywhere at youth gatherings, popularized through myths.
    For example, the claim that smoking after drinking alcohol feels "even cooler."
    It only feels that way because tobacco hits the body harder after alcohol.
    So, even if you’re not in this age group, remember:
    everything positive you hear about tobacco is just marketing.
  `,
  `
    People are often irritated by smokers. Have you ever thought about how a smoker looks through the eyes of a non-smoker?
    It’s like this: "A grown, intelligent person gets up from their desk once an hour, goes outside,
    puts a pencil in their mouth for five minutes, and blows out smoke."
    Sounds strange, doesn’t it? But that’s exactly how they see us.
  `,
  `
    A drop of nicotine can kill a horse – that’s a fact. When we smoke, we inhale nicotine.
    It’s not as lethal for us, but remember, it harms three key areas:
    the heart, the circulatory system, and the body’s defense against tumors.
    Today, as medical care becomes more expensive every day,
    it’s senseless to expose yourself to the risk of such serious diseases.
  `,
  `
    A useful exercise can be practicing not smoking.
    Go out to smoke with your colleagues or friends as usual.
    But when everyone starts smoking, you don’t.
    If someone asks why you’re not smoking, simply say, "I don’t feel like it."
    It might amuse your colleagues, nothing more.
    However, for you, it will be another small victory over the habit.
  `,
  `
    Smokers rarely get along with non-smokers. The smell of cigarettes is off-putting.
    Moreover, there are far fewer smokers than non-smokers.
    Just imagine how many people have excluded you from their lives
    simply because of this silly habit!
  `,
  `
    Over 4,000 chemicals are released when you light a cigarette.
    It’s no wonder smoking is one of the leading causes of premature death.
    Just think about the meaning of "premature death."
    You have so many plans in life—friends, family, goals. You’re doing everything to make your life interesting.
    And then, suddenly, "bam"—you’re gone.
    Even though you could have lived a long and happy life.
    And on top of that, you paid for it.
  `,
  `
    Old joke: Why do smokers always carry a lighter?
    Because their chances of being struck by lightning are higher than quitting smoking!
  `,
  `
    The idea that people who quit smoking gain weight is a myth.
    Even if you’re prone to weight gain—it’s still a myth.
    In 99% of cases, people gain weight because they eat while lying down
    or start consuming sweets and pastries in excessive amounts.
    Watch what you eat.
    However, the fact that smoking damages your teeth—that’s no myth.
  `,
  `
    All nicotine replacements are a lie.
    Patches, pills, vapes—they’re just another type of cigarette.
    Oh, you’d be amazed at how inventive the tobacco industry can be!
    They’ll sell you cigarettes in bottles, cigarettes as car fresheners, or perfumes with a tobacco scent.
    And they’ll tell you, "This is how you quit smoking."
    This industry makes insane amounts of money.
    They’ll do anything to keep you hooked!
  `,
  `
    There are countless non-smoking establishments around the world.
    Smokers step "outside" to smoke or go to designated "smoking rooms."
    Have you ever thought about how this looks from the outside?
    Like an "aquarium for addicts that smell bad."
    It’s not even discrimination—it’s just that people without this habit
    aren’t always willing to put up with it.
  `,
  `
    Your family, friends, and loved ones who don’t smoke—they love you for who you are, regardless of your habits.
    Even if your breath smells like smoke after you’ve had a cigarette, they accept it with understanding.
    So why expose them to harm? It’s simply pointless.
    That’s why you’re trying to quit smoking.
  `,
  `
    Old joke: 
    Why don’t smokers ever get lost?
    Because they always follow the "no smoking" signs!
  `,
  `
    Smokers’ taste buds are damaged by their habit.
    They can’t fully enjoy the taste of food.
    They can’t fully experience the scent of perfume.
    Sometimes even the smell of gasoline on asphalt can spark
    an incredible wave of memories—but not while you’re still smoking.
    Quit. It’s a pointless habit.
  `,
  `
    How much does your pack of cigarettes cost? That’s your money! Yours and only yours.
    You could spend it on anything, but instead, you give it to the tobacco industry.
    Here’s the thing — you’re not just spending it like you would on a watermelon in the summer.
    You’re giving it away because of a habit they got you hooked on.
    But isn’t that absurd?
  `,
  `
    Everyone who quits smoking has their own most important reason.
    Always remember yours.
    It will help you. Quitting becomes much easier when you focus on
    the main reason why you’re doing it.
  `,
  `
    It might seem like a simple reason to quit smoking,
    but the brain of a non-smoker works three times better than when they smoke.
    You can be three times smarter and faster!
    You just need to stop paying for something you don’t need.
  `,
  `
    If you live or work with people who smoke, it doesn’t have to be a problem.
    You can still go outside with them as usual.
    But if it’s not your time to smoke—don’t.
    Don’t even take a puff. What’s the point?
    Just stick to your schedule, and that’s it. 
  `,
  `
    By the way, not too long ago, the tobacco industry came up with a way to lure in young people.
    Smoking wasn’t considered cool among teenagers, so they introduced vapes and e-cigarettes —
    an incredible "miracle" that lets you blow sweet-smelling vapor.
    It turned out to be even worse than cigarettes, leading to cases of diabetes.
    Do you think anyone compensated the people who got sick with diabetes?
    The entire tobacco industry is designed to make money off other people’s health.
  `,
  `
    
    Non-smokers have better skin. Why? Because they aren’t constantly poisoned by chemicals.
    And you don’t have to be a young woman to appreciate it.
    The healthy complexion of a mature man looks far more appealing
    than the gray skin of an aging, perpetually tired smoker.
  `,
  `
    If you stop smoking, your clothes will no longer smell like tobacco,
    your hair will no longer smell like tobacco,
    and your hands will no longer smell like tobacco.
  `,
  `
    Take a moment to observe a group of people smoking sometime.
    Standing by a trash can or in a smoking room.
    Perfectly normal, ordinary people blowing smoke, spending their money and health,
    just to end up smelling like smoke.
    Soon, you’ll quit smoking and won’t be one of them. Very soon.
  `,
  `
    This might sound strange, but it’s much easier to quit smoking now than later.
    It’s a scientifically proven psychological fact.
    A person who decides to quit smoking can do it.
    But if they stray from this path, quitting becomes harder later—psychologically.
    They start thinking, "It’s not that much money," or "I’ve been smoking for years, and I’m fine," and so on.
    You’ve already decided to quit smoking.
    Now is the best time to do it. Don’t stop!
  `,
  `
    You’ll be an example for others. If you quit, your spouse or partner might quit too, and so might your friends.
    You’ll still spend the same amount of time together as before, talking just like you always did.
    Everything will be the same—except there won’t be a cigarette in your hand.
  `,
  `
    A joke about how we link smoking to everyday activities.
    A man proudly announced he quit smoking after 20 years.
    His friend asked how he did it.
    "Simple," he said. "I now only smoke when I drink coffee."
    "And?"
    "I’ve switched to tea."
  `,
  `
    Smoking damages your memory. If you stop smoking, you’ll be able to recall cherished moments in the evening
    over a cup of tea or coffee.
    You’ll remember childhood events in detail, your graduation, or walks with your beloved dog.
    You’ll have more time for yourself and less for routine tasks.
    Your mindset will become more positive. Smoking weighs you down.
  `,
  `
    A non-smoker is more energetic and refreshed.
    They are more active in life, enjoy a more vibrant sex life,
    and have more diverse and dynamic plans.
    A non-smoker can easily multitask and handle several things at once.
  `,
  `
    Start reminding yourself that smoking is just a habit.
    The difference between a habit and an addiction is very simple.
    You’re used to doing it. But if you suddenly don’t—nothing will change.
    Absolutely nothing.
  `,
  `
    If you suffer from headaches, especially when the weather changes, smoking could be the cause.
    Yes, cigarettes constrict your blood vessels. Add to that the cholesterol accumulated over the years,
    plus atmospheric pressure—and it’s almost a guaranteed headache.
    Why would you want that?
  `,
  `
    You’ve run out of cigarettes and didn’t smoke. 
    After a short while, you start feeling nervous and irritable—strange, isn’t it?
    For someone who’s supposed to be in full control of their life, 
    to depend on something sold at every kiosk like chewing gum.
    It’s both strange and frustrating.
  `,
  `
    Many people say, "I smoke because I have chronic stress".
    Stress is an entirely separate issue, my friend.
    If you’re stressed — whether it’s from work or home — you’re not inventing anything new.
    People have been dealing with it throughout human history.
    That’s why there are perfectly reasonable ways to address what’s causing your stress.
    If this resonates with you, take some time to research the topic online.
    You’ll be amazed at how much better you can make your life with very little effort.
  `,
  `
    By the way, here’s a great idea called "The Last Flight".
    A person quitting smoking asks someone to take a photo of them tossing an empty cigarette pack into the trash,
    with a cigarette in hand and the pack mid-air.
    It doesn’t even have to be your "very last pack". You can take this photo right now.
    When you finally quit smoking for good, print the photo, frame it, and put it on a shelf.
    It’s a symbol of how strong you are over your habits. Your victory.
  `,
  `
    Global statistics: every six seconds, someone in the world dies from diseases caused by tobacco consumption —
    that’s 3.5 million people a year.
    Do you want to be part of that?
  `,
  `
    Why is it said that smokers have a lower quality of life?
    Because smokers often push non-smokers away. Smokers frequently drink as well.
    There are plenty of successful people among non-smokers, but among smokers,
    you’ll find many who struggle in life and drink excessively.
    And it’s logical — your friends partially determine your quality of life.
  `,
  `
    There’s an essential rule called "Smoking Companions".
    If you have a habit of smoking while drinking alcohol — stop drinking entirely.
    If you smoke when you drink coffee—switch to tea instead.
    Break the associations with smoking that are easy to let go of.
    You can go back to enjoying your favorite coffee as usual once you quit smoking.
    And you’ll look back on it all with a smile.
  `,
  `
    Joke. 
    A smoker looked at his pack of cigarettes and said, "You’re killing me".
    The cigarettes replied, "You bought me".
  `,
  `
    Interesting fact: Water can help you quit smoking. Why?
    Our bodies are mostly water, and we need about 2 liters daily. But not everyone drinks enough.
    On top of that, we often skip meals and disrupt our eating habits.
    Here’s what happens: you smoke, and the toxins linger in your body "for a long time",
    especially since you don’t even rinse your mouth after smoking. The taste of cigarettes
    stays in your mouth, and over time, your taste buds start saying, "How about another cigarette?"
    Now, if you simply take a couple of sips of water in between, the toxins will be washed away,
    and you’ll feel much less like smoking.
  `,
  `
    Cigarettes are not "relaxation". You’re not "taking a break with a cigarette".
    You can relax without a cigarette.
    You can relax however you like. Right now, you’re resting,
    but also, for some reason, blowing smoke.
  `,
  `
    Sometimes it feels almost impossible to resist having an extra smoke.
    You really, really want it. What to do? The solution is simple.
    Go to a window, open it, and take a deep breath.
    Enjoy it. If one isn’t enough, take a few more.
    Smoking is a silly habit — you can smoke whenever you want.
    And if you want to, you can choose not to smoke at all.
  `,
  `
    Imagine this: there’s real data on people over the age of 60 who quit smoking.
    According to the statistics, even in this age group, the lifespan of those who quit smoking
    is ALWAYS longer than those who continued smoking as before.
    This clearly shows just how harmful smoking is.
  `,
  `
    Don’t smoke, don’t smoke, then suddenly you get nervous, irritable, your hands start shaking.
    You make some coffee, step outside, light a cigarette, and take a drag. Feels good, right?
    Does it? You just got nervous out of nowhere, stepped outside, and started puffing away.
    Doesn’t sound so romantic, does it?
    That’s exactly how non-smokers see it.
  `,
  `
    Would you like to try learning a foreign language?
    Multitasking is a strong suit of non-smokers.
    So, if you have the opportunity and some free time,
    you can start right now.
  `,
  `
    A random cough out of nowhere — for smokers, it’s a common occurrence. Annoying, isn’t it?
  `,
  `
    If cigarettes were made only of tobacco, everyone would quit smoking easily.
    Tobacco company owners understand this.
    That’s why they make smokers dependent on various additives.
    There’s all sorts of stuff in there—both in the tobacco and the filters.
    By the way, that’s why cigarettes don’t go out, for instance.
  `,
  `
    У вас бывало такое. Сидите вечером, отдыхаете. Потом подумали - а не покурить ли. 
    Лезете в карман куртки или в сумку и обнаруживаете что сигареты закончились.
    Что делать - встаёте, одеваетесь, и идёте в киоск за сигаретами.
    Представляете, насколько это странно. Вместо своего заслуженного отдыха вы одеваетесь
    и идёте по маршруту, который находили.
  `,
  `
    А вы когда-то слышали, что бывают подделки сигарет? Наверняка.
    Но вот про то, что люди травились поддельными сигаретами не на слуху. А они есть.
    Как это происходит. Человек покурил некачественные сигареты, отравился, кружится голова, плохо.
    Что он делает? Думает что заболел, ложится на больничный.
    А можно отравиться очень сильно. Ещё за это и деньги заплатить.
  `,
  `
    Психологи считают что жвачка очень сильно мотивирует курение. 
    Курящие люди жующие жвачку привыкают глотать никотин со слюной и потом, как только жвачка оказывается 
    во рту - сразу же возникает ассоциация с сигаретой. Поэтому, если вы жуёте жвачку и планируете
    бросить курить, лучше пока прекратить жевать. Временно.
  `,
  `
    - Всё, бросаю курить!
    - Отлично, с вас 124 $ в месяц налога. Это для компенсации убытка, который вы теперь 
    будете наносить табачным компаниям. 
    И 4210 $ компенсации клинике, которой не доведётся теперь вас лечить.
  `,
  `
    Вы заметили, что знаменитости почти никогда не курят? И это совершенно не потому что не могут себе позволить.
    Просто глупо быть рабом бесполезной привычки.
  `,
  `
    Чтобы меньше курить - ограничьте себя. Уберите ваши дополнительные зажигалки - оставьте одну.
    Перестаньте покупать сигареты блоками и носите только одну пачку.
    Сделайте курение для вас мение доступным.
  `,
  `
    Отказ от курения означает отсутствие ограничений – вы можете свободно находиться в обществе, 
    не имея необходимости отходить в сторону или выходить на улицу, чтобы покурить.
  `,
  `
    Всегда помните - все схемы, которые обещают вам бросить курить - обман. На самом деле вы сейчас
    выбрали единственную рабочую схему - ограничение курения с напоминаниями. Никакие таблетки, пластыри
    и тренинги не сработают - это ещё один вариант выкачки денег из человека.
  `,
  `
    Если честно, когда читаешь о вреде курения - хочется закурить. Поэтому, скажем просто, как факт -
    курение безумно вредное пагубное занятие, которое ничего хорошего вам не даёт.
  `,
  `
    Безопасных сигарет - нет, безопасных парилок - нет, курить кальян полезно - нет. 
    Смотрите, как бы "самое безопасное" не оказалось "самым смертоносным".
    Так зачем вообще рисковать своей жизнью?
  `,
  `
    Современные сигаретные фильтры, конечно же, задерживают смолы и делают курение более безопасным.
    Но, делают более безопасным совершенно не означает, что, встав когда-то утром,
    вы не обнаружите какое-то страшное заболевание связанное с курением. Поэтому - бросайте курить.
  `,
  `
    Юмор. Самый реальный вред от курения — это когда выходишь покурить, а соседи по общаге сожрали твои пельмени.
  `,
  `
    Когда начинаешь думать о курении, как о бесполезном занятии - совладать с этой привычкой гораздо проще.
    Чем больше человек думает о привычке, как о привычке - тем быстрее он бросает курить.
  `,
  `
    Нюхательный табак является частой причиной рака слизистой оболочки рта - да, даже такой рак бывает.
    Часто люди жуют и нюхают табак "чтобы проснуться". Это тоже опасно.
  `,
  `
    По чистой статистике 90% курильщиков бросили бы если бы могли. На самом деле, им нужно было озадачиться,
    как озадачились вы. Спросите у своих друзей, может они хотят бросить курить. Даже если они откажут,
    когда вы бросите курить совсем - вы послужите для них примером.
  `,
  `
    Ежегодно огромное число людей бросает курить. Но около половины из них бросают только тогда,
    когда уже имеют реальные проблемы со здоровьем. А ведь до этого могло бы и не дойти.
  `,
  `
    С помощью этого бота люди бросают курить в среднем за три месяца. Если вы вышли на время более двух часов
    между перекурами - можете начинать задумываться над этим. Вам стоит подобрать какой-то период,
    когда у вас будет три и более выходных. Вам нужно переборот себя первые пять дней - дальше становится легче.
  `,
  `
    В фильмах постоянно идёт скрытая реклама сигарет. Когда главный герой "смачно" затягивается - мммм,
    как же хочется покурить. Реклама сигарет. Помните об этом.
  `,
  `
    Юмор. - Какой у Вас красивый желтый кот! - Спасибо, но на самом деле он белый - мы просто курим в квартире.
  `,
  `
    Что значит "я не могу бросить курить"?! Звучит странно, не правда ли.
  `,
  `
    Часто можно услышать такое - я курю, потому что мне нравится. 
    Мне нравится "запах" сигарет и затягиваться табачным дымом.
    Напомним вам, вы бросаете курить потому что это вредно, бессмысленно и раздражает других, а не вас.
    Да, табачный дым - часто достаточно приятный. Но вы стали его рабом.
    А если вы уже не властны над этой привычкой - пора с ней заканчивать.
  `,
  `
    Посреди тяжёлого дня вы садитесь, закуриваете, и сигарета переносит вас в мир "спокойных размышлений" о жизни.
    Вы отдыхаете. Вроде бы всё ок? А теперь я вам скажу, что для этого вам совершенно не нужна сигарета.
    Это просто часть вашей привычки которая въелась в вас и от неё теперь будет очень трудно избавиться.
    Боритесь! Это настоящая битва! Вы сильнее.
  `,
  `
    Наверняка, когда вы только начинали курить, вы говорили "хочу курю - хочу некурю".
    Ничего не поменялось.
  `,
  `
    Одним из хороших ходов в отказе от курения является, если вы перестанете считать, сколько сигарет у вас
    осталось в пачке. Это тяжело, но вы же боретесь с привычкой. И, всякий раз, когда они у вас будут заканчиваться,
    вы будете идти в магазин или киоск и думать, насколько вами руководит привычка.
  `,
  `
    Есть такая очень популярная фраза "некоторые люди всю жизнь курят и ничего". Так-то оно так.
    Но, во-первых, они всё равно страдают от этого курения - мозг работает хуже, моторика хуже и тп.
    А, во-вторых, где гарантия что для вас сработает это правило? Вы просто откройте как-нибудь список
    заболеваний, риск которых возрастает с курением. Там много достаточно страшного.
  `,
  `
    Бычки на траве, бычки на автобусных остановках, бычки на балконах, бычки в машине друга и гараже.
    Раздражает, не правда ли?
  `,
  `
    Сигареты это настолько прибыльный бизнес, что многие страны третьего мира занимаются их контрабандой.
    Вы даже не можете себе представить объёмы - там десятки миллиардов сигарет.
    Просто бизнес на смерти всегда был самым прибыльным.
  `,
  `
    Фраза "С этого момента ни одной затяжки" очень сильная. Скажите её, когда примете окончательное решение.
    Это как договор самому себе.
  `,
  `
    Вы долистали все мотивационные сообщения до конца. Сейчас они пойдут по кругу. Однако, хотим вас попросить -
    не останавливайтесь. Нет никакого смысла в том что вы курите. Покупая сигареты вы просто набиваете чужие карманы.
  `,
].map(v => `> 🏋️ ${B}Мотивация${B}:\\${NL} ${v}`);

const challenges = [
  `
    Если вы курите сразу как просыпаетесь, попробуйте завтра этого не делать.
    Для начала сделайте чай или кофе. Или позавтракайте. В общем - не делайте это сразу же. 
    Это привычка и она не должна руководить вашим днём.
  `,
  `
    Если вы курите сразу как просыпаетесь, попробуйте завтра этого не делать.
    Для начала сделайте чай или кофе. Или позавтракайте. В общем - не делайте это сразу же. 
    Это привычка и она не должна руководить вашим днём.
  `,
  `
    Если вы курите на остановках когда ждёте транспорт - не курите перед транспортом.
    Если курите перед тем как сесть в машину - не курите перед тем, как сесть в машину. Вы сильнее вашей привычки!
  `,
  `
    Купив следующую пачку сигарет - не закуривайте сразу. 
    Попробуйте отложить это на сколько это возможно. Вы удивитесь насколько это просто. 
    Это просто дурацкая привычка которая уже не властна над вами.
  `,
  `
    Если вы курите на работе или учёбе - пропустите один или два перекура.
    Вас будут звать коллеги - откажите. Скажите, что вы заняты работой и покурите позже. Ни кто на вас не обидится.
    А вы - потренируете, насколько вы сильнее привычки.
  `,
  `
    Если вы курите перед сном - не курите сегодня. 
    То есть, вам совсем не обязательно это делать. Прикиньте, когда планируете ложиться и за час уже не курите.
    Вы можете это распланировать - это очень просто - поверьте. 
  `,
  `
    Если у вас есть подруга или друг, который бросил курить - спросите у него, 
    как он это сделал. Если, вдруг, нет - спросите некурящего человека, почему он не курит.
  `,
].map(v => `> 🎯 ${B}Вызов дня${B}:\\${NL} ${v}`);

const hints = [
  `
    Вызов дня - это условие, с которым вы можете соперничать. 
    Каждый раз выполняя Вызов Дня вы становитесь на шаг ближе к цели.
    Поэтому, старайтесь выполнять их все.
  `,
  `
    Вы можете в любой момент изменить часовой пояс, написав в чат /time
  `,
  `
    Бот не хранит никакую информацию о пользователях. Поэтому - даже не спрашивайте.
  `,
  `
    Вы можете оценить свой прогресс, написав /stats
  `,
  `
    Бот полностью некоммерческий. Здесь не предполагается хоть какое-то размещение рекламы или поиск выгоды.
  `,
  `
    Вы можете в любой момент изменить язык, написав /lang
  `,
  `
    Подумайте, может быть вы можете порекомендовать бота кому-то из друзей. Бросать курить вместе гораздо веселее.
  `,
  `
    Можно ли сбросить прогресс? Можно. В 99% это ничего не даст, но если вы хотите рискнуть - напишите /start
  `,
  `
    Если вы владеете каким-то иностранным языком, кроме тех, на которые бот уже переведён -
    вы можете нам помочь с переводом.
    Возможно вы просто хотите поддержать автора бота. 
    Если да - напшите /how
  `,
].map(v => `> 💡 ${B}Полезная информация${B}:\\${NL} ${v}`);

export const motivizerEn: string[] = (() => {
  const mixHintsAndChallenges: string[] = [];
  while (challenges.length && hints.length) {
    if (hints.length) {
      const hint = hints.shift()!;
      mixHintsAndChallenges.push(hint);
    }
    if (challenges.length) {
      const challenge = challenges.shift()!;
      mixHintsAndChallenges.push(challenge);
    }
  }
  const period = Math.floor(motivations.length / mixHintsAndChallenges.length);
  const result: string[] = [];
  motivations.forEach((v, i) => {
    result.push(v);
    if (i % period == 0) {
      const hintOrChallenge = mixHintsAndChallenges.shift();
      if (hintOrChallenge) {
        result.push(hintOrChallenge);
      }
    }
  });
  return result;
})();
