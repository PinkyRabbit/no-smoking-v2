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
    Do you know how long people have been smoking "for money?" Since the 16th century!
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
    You have so many plans in life — friends, family, goals. You’re doing everything to make your life interesting.
    And then, suddenly, "bam" — you’re gone.
    Even though you could have lived a long and happy life.
    And on top of that, you paid for it.
  `,
  `
    Old joke: Why do smokers always carry a lighter?
    Because their chances of being struck by lightning are higher than quitting smoking!
  `,
  `
    The idea that people who quit smoking gain weight is a myth.
    Even if you’re prone to weight gain — it’s still a myth.
    In 99% of cases, people gain weight because they eat while lying down
    or start consuming sweets and pastries in excessive amounts.
    Watch what you eat.
    However, the fact that smoking damages your teeth—that’s no myth.
  `,
  `
    All nicotine replacements are a lie.
    Patches, pills, vapes — they’re just another type of cigarette.
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
    It’s not even discrimination — it’s just that people without this habit
    aren’t always willing to put up with it.
  `,
  `
    Your family, friends, and loved ones who don’t smoke — they love you for who you are, regardless of your habits.
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
    an incredible wave of memories — but not while you’re still smoking.
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
    But if it’s not your time to smoke — don’t.
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
    But if they stray from this path, quitting becomes harder later — psychologically.
    They start thinking, "It’s not that much money," or "I’ve been smoking for years, and I’m fine," and so on.
    You’ve already decided to quit smoking.
    Now is the best time to do it. Don’t stop!
  `,
  `
    You’ll be an example for others. If you quit, your spouse or partner might quit too, and so might your friends.
    You’ll still spend the same amount of time together as before, talking just like you always did.
    Everything will be the same — except there won’t be a cigarette in your hand.
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
    You’re used to doing it. But if you suddenly don’t — nothing will change.
    Absolutely nothing.
  `,
  `
    If you suffer from headaches, especially when the weather changes, smoking could be the cause.
    Yes, cigarettes constrict your blood vessels. Add to that the cholesterol accumulated over the years,
    plus atmospheric pressure — and it’s almost a guaranteed headache.
    Why would you want that?
  `,
  `
    You’ve run out of cigarettes and didn’t smoke. 
    After a short while, you start feeling nervous and irritable — strange, isn’t it?
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
    If you smoke when you drink coffee — switch to tea instead.
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
    There’s all sorts of stuff in there — both in the tobacco and the filters.
    By the way, that’s why cigarettes don’t go out, for instance.
  `,
  `
    Has this ever happened to you? You’re sitting in the evening, relaxing.
    Then you think, "Maybe I’ll have a smoke".
    You reach into your jacket pocket or bag and realise you’re out of cigarettes.
    What do you do? You get up, put on your clothes, and head to the nearest shop for cigarettes.
    Imagine how strange that is. Instead of enjoying your well-deserved rest,
    you’re getting dressed and walking a route you know all too well.
  `,
  `
    Have you ever heard about counterfeit cigarettes? Probably.
    But cases of people getting poisoned by fake cigarettes aren’t as well-known. Yet they happen.
    Here’s how it goes: someone smokes low-quality cigarettes, gets poisoned, feels dizzy and unwell.
    What do they do? They think they’re sick and take time off work.
    But the poisoning can be much worse. And to top it off, you’re paying for it.
  `,
  `
    Psychologists believe that chewing gum strongly reinforces the habit of smoking.
    Smokers who chew gum get used to swallowing nicotine with their saliva,
    and as soon as gum is in their mouth, it immediately triggers an association with cigarettes.
    So, if you chew gum and plan to quit smoking, it’s better to stop chewing — for now. Temporarily.
  `,
  `
    Joke. A man lit his cigarette and said, "I really need to quit smoking."
    His friend asked, "Why don’t you?"
    He took a deep drag and replied, "Because quitting is the only thing I do worse than smoking."
  `,
  `
    Have you noticed that celebrities almost never smoke?
    And it’s certainly not because they can’t afford it.
    It’s just foolish to be a slave to a useless habit.
  `,
  `
    To smoke less, set some limits for yourself. Remove your extra lighters — keep just one.
    Stop buying cigarettes by the carton and carry only one pack at a time.
    Make smoking less accessible for yourself.
  `,
  `
    Quitting smoking means freedom from limitations — you can freely stay in social settings
    without needing to step aside or go outside for a smoke.
  `,
  `
    Always remember — any methods promising to help you quit smoking are a scam.
    The truth is, you’ve already chosen the only method that works — limiting your smoking with reminders.
    No pills, patches, or training sessions will help.
    They’re just another way to take money from you.
  `,
  `
    Honestly, when you read about the harm of smoking, it makes you want to light up.
    So let’s just state it as a fact — smoking is an incredibly harmful, destructive habit
    that brings absolutely no benefit to you.
  `,
  `
    There are no safe cigarettes, no safe vapes, and smoking a hookah isn’t healthy either.
    Sometimes what’s advertised as "the safest" can turn out to be "the deadliest".
    So why risk your life at all?
  `,
  `
    Modern cigarette filters do, of course, trap tar and make smoking somewhat safer.
    But "somewhat safer" doesn’t mean that one morning you won’t wake up
    to find a serious illness caused by smoking.
    So, quit smoking.
  `,
  `
    Joke. A man quit smoking after 20 years.
    The hospitals held a meeting and said, "We just lost our best customer!"
  `,
  `
    When you start thinking of smoking as a pointless activity, it becomes much easier to overcome the habit.
    The more a person thinks of smoking as just a habit, the faster they quit.
  `,
  `
    Snuff tobacco is a common cause of oral mucosa cancer — yes, even that type of cancer exists.
    Many people chew or sniff tobacco "to wake up", but this is dangerous too.
  `,
  `
    According to pure statistics, 90% of smokers would quit if they could.
    The truth is, they just need to take the initiative, like you did.
    Ask your friends if they want to quit smoking. Even if they say no,
    when you quit completely, you’ll serve as an example for them.
  `,
  `
    Every year, a huge number of people quit smoking.
    But about half of them only quit after they already have serious health problems.
    And yet, it didn’t have to come to that.
  `,
  `
    With the help of this bot, people quit smoking in an average of three months.
    If you’ve reached an interval of more than two hours between smoke breaks,
    it’s time to start thinking about it.
    Choose a period when you’ll have three or more days off.
    You just need to overcome the first five days — it gets easier after that.
  `,
  `
    Movies often feature hidden cigarette advertising.
    When the main character takes a deep, satisfying drag—mmm,
    it makes you really want to smoke.
    It’s cigarette advertising. Always remember that!
  `,
  `
    Joke. A smoker looked at his yellowed teeth in the mirror and said,
    "Well, at least they match my favourite sweater now."
  `,
  `
    What do you mean, "I can’t quit smoking"?! Sounds strange, doesn’t it?
  `,
  `
    You often hear people say, "I smoke because I like it.
    I like the 'smell' of cigarettes and the feeling of inhaling tobacco smoke."
    Let us remind you — you’re quitting smoking because it’s harmful, pointless,
    and irritating to others, not you.
    Yes, tobacco smoke can be somewhat pleasant,
    but you’ve become a slave to it.
    And if you’re no longer in control of this habit, it’s time to end it.
  `,
  `
    In the middle of a hard day, you sit down, light a cigarette,
    and it takes you to a world of "calm reflection" about life.
    You’re relaxing. Seems fine, right?
    Now let me tell you — you don’t need a cigarette for that.
    It’s just part of a habit that’s ingrained in you,
    and now it’s hard to let go of.
    Fight it! This is a real battle! You’re stronger.
  `,
  `
    Surely, when you first started smoking, you said, "I smoke if I want to — I don’t if I don’t want to."
    Nothing has changed.
  `,
  `
    One effective strategy for quitting smoking is to stop counting how many cigarettes you have left in the pack.
    It’s hard, but you’re fighting a habit.
    Every time you run out and head to the shop,
    you’ll realise just how much this habit controls you.
  `,
  `
    There’s a very popular phrase: "Some people smoke their whole lives and nothing happens."
    Well, that’s partly true.
    But first of all, they still suffer from smoking — reduced brain function, poor motor skills, and so on.
    And secondly, where’s the guarantee that this rule will apply to you?
    Just take a look at the list of diseases whose risks increase with smoking.
    There’s plenty on it that’s truly terrifying.
  `,
  `
    
    Cigarette butts on the grass, at bus stops, on balconies, in a friend’s car, and in the garage.
    Annoying, isn’t it?
  `,
  `
    Cigarettes are such a profitable business that many third-world countries engage in their smuggling.
    You can’t even imagine the scale — we’re talking tens of billions of cigarettes.
    After all, the business of death has always been the most profitable.
  `,
  `
    The phrase "Not a single puff from this moment on" is very powerful.
    Say it when you’ve made your final decision.
    It’s like a promise to yourself.
  `,
  `
    You’ve scrolled through all the motivational messages to the end.
    Now they’ll start repeating.
    However, we want to ask you — don’t stop.
    There’s no point in smoking. By buying cigarettes, you’re just filling someone else’s pockets.
  `,
].map(v => `> 🏋️ ${B}Motivation${B}:\\${NL} ${v}`);

const challenges = [
  `
    If you smoke as soon as you wake up, try not to do it tomorrow.
    Start by making tea or coffee. Or have breakfast first.
    The point is — don’t smoke right away.
    It’s just a habit, and it shouldn’t dictate your day.
  `,
  `
    If you smoke as soon as you wake up, try not to do it tomorrow.
    Start by making tea or coffee first. Or have breakfast instead.
    The point is — don’t make it the first thing you do.
    It’s just a habit, and it shouldn’t control your day.
  `,
  `
    If you smoke at bus stops while waiting for transport, don’t smoke before it arrives.
    If you smoke before getting into a car, don’t do it this time.
    You’re stronger than your habit!
  `,
  `
    When you buy your next pack of cigarettes, don’t light one right away.
    Try to delay it for as long as possible. You’ll be surprised at how easy it is.
    It’s just a silly habit that no longer controls you.
  `,
  `
    If you smoke at work or school, skip one or two smoke breaks.
    When your colleagues invite you, decline. Just say you’re busy and will smoke later.
    No one will be upset with you.
    And you’ll get a chance to practice just how much stronger you are than your habit.
  `,
  `
    If you smoke before bed, don’t smoke tonight.
    You don’t need to do it at all.
    Decide when you plan to go to bed, and stop smoking an hour beforehand.
    You can plan it out — it’s very simple, trust us.
  `,
  `
    If you have a friend who has quit smoking, ask them how they did it.
    If you don’t, ask a non-smoker why they don’t smoke.
  `,
].map(v => `> 🎯 ${B}Dare of the Day${B}:\\${NL} ${v}`);

const hints = [
  `
    Dare of the Day is a challenge you can compete with.
    Each time you complete the Dare of the Day, you’re one step closer to your goal.
    So, try to complete them all.
  `,
  `
    You can change your time zone at any time by typing /time in the chat.
  `,
  `
    The bot does not store any user information.
    Don’t even ask about it.
  `,
  `
    You can check your progress by typing /stats in the chat.
  `,
  `
    The bot is completely non-commercial. There is no intention to include advertisements or seek any profit here.
  `,
  `
    You can change the language at any time by typing /lang in the chat.
  `,
  `
    Think about it — maybe you can recommend the bot to one of your friends.
    Quitting smoking together is much more fun.
  `,
  `
    Can you reset your progress? Yes, you can.
    In 99% of cases, it won’t help, but if you’re willing to take the risk — type /start in the chat.
  `,
  `
    If you know a foreign language other than those the bot is already translated into,
    you can help us with translation.
    Or maybe you simply want to support the bot’s creator.
    If so, type /how in the chat.
  `,
].map(v => `> 💡 ${B}Helpful Tips${B}:\\${NL} ${v}`);

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
