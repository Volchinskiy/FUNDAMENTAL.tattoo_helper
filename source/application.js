const { Bot } = require('grammy');
const express = require('express');
const { webhookCallback } = require('grammy');
const dataBase = require('./data_base.class');

const bot = new Bot(process.env.TELEGRAM_TOKEN);

const giveInfoQuestions = {
  1: 'Напиши свое ім\'я',
  2: 'Напиши свою фамілію',
  3: 'Скільки тобі років?',
  4: 'Скинь свій профіль в Instagram',
  5: 'Напиши свій номер телефону',
  6: 'Напиши свою електронну адресу',
  7: 'Дякую тепер можешь розповісти трошки про свій сеанс\n\n/session',
};

const sessionQuestions = {
  1: 'Що ти набиваєш?',
  2: 'Скільки коштує твоє татуювання?',
};

bot.command('start', async (context) => {
  try {
    const {
      id,
      is_bot: isBot,
      first_name: firstName,
      username,
      language_code: languageCode,
    } = context.from;

    const [[user]] = await dataBase.getUserByTelegramId(id);
    if (!user) {
      // eslint-disable-next-line max-len
      await dataBase.saveTelegramInformation(id, isBot, firstName, username, languageCode);
    }
    // eslint-disable-next-line max-len
    context.reply('Вітаю в Ta2core!\n\nДякую що погодився надати трошки інформації про себе, це нам сильно допоможе ;)\n\nЩоб продовжити викликай /give_info');
  } catch (error) {
    console.log(error.message);
    context.reply('Щось пішло не так :(');
  }
});

bot.command('give_info', async (context) => {
  try {
    const {
      id,
      is_bot: isBot,
      first_name: firstName,
      username,
      language_code: languageCode,
    } = context.from;

    const [[user]] = await dataBase.getUserByTelegramId(id);
    if (!user) {
      // eslint-disable-next-line max-len
      await dataBase.saveTelegramInformation(id, isBot, firstName, username, languageCode);
    }

    if (user.isToldAboutYourself) {
      // eslint-disable-next-line max-len
      context.reply('Дякую, але ти вже надав всю інформацію ;)\n\nМоже розповісти трошки про свій сеанс?\n\n/session');
      return;
    }

    if (!user.questionStatus) {
      await dataBase.setQuestionStatus('give_info', '1');
      context.reply(giveInfoQuestions[1]);
      return;
    }

    const [ questionGroup, questionNumber ] = user.questionStatus.split(' ');

    if (questionGroup !== 'give_info') {
      context.reply('Ти ще не дав всіх відповідей на минулу команду ;)');
    } else {
      context.reply(giveInfoQuestions[questionNumber]);
    }
  } catch (error) {
    console.log(error.message);
    context.reply('Щось пішло не так :(');
  }
});

bot.command('session', async (context) => {
  context.reply('session');
});

bot.on('message', async (context) => {
  try {
    const {
      id,
      is_bot: isBot,
      first_name: firstName,
      username,
      language_code: languageCode,
    } = context.from;

    const [[user]] = await dataBase.getUserByTelegramId(id);
    if (!user) {
      // eslint-disable-next-line max-len
      await dataBase.saveTelegramInformation(id, isBot, firstName, username, languageCode);
      // eslint-disable-next-line max-len
      context.reply('Вітаю в Ta2core!\n\nДякую що погодився надати трошки інформації про себе, це нам сильно допоможе ;)\n\n Щоб продовжити викликай /give_info');
      return;
    }

    if (!user.questionStatus) {
      // eslint-disable-next-line max-len
      context.reply('Вітаю в Ta2core!\n\nДякую що погодився надати трошки інформації про себе, це нам сильно допоможе ;)\n\n Щоб продовжити викликай /give_info');
      return;
    }

    const [ questionGroup, questionNumber ] = user.questionStatus.split(' ');

    if (questionGroup === 'give_info') {
      const { text } = context.message;

      // eslint-disable-next-line max-len
      if (questionNumber === '1') dataBase.updateTattooClient('firstName', text, user.id);
      // eslint-disable-next-line max-len
      if (questionNumber === '2') dataBase.updateTattooClient('secondName', text, user.id);
      // eslint-disable-next-line max-len
      if (questionNumber === '3') dataBase.updateTattooClient('age', text, user.id);
      // eslint-disable-next-line max-len
      if (questionNumber === '4') dataBase.updateTattooClient('instagramUrl', text, user.id);
      // eslint-disable-next-line max-len
      if (questionNumber === '5') dataBase.updateTattooClient('phoneNumber', text, user.id);
      // eslint-disable-next-line max-len
      if (questionNumber === '6') dataBase.updateTattooClient('email', text, user.id);

      if (questionNumber === '7') {
        context.reply(giveInfoQuestions[questionNumber]);
        await dataBase.updateTattooClient('isToldAboutYourself', 1, user.id);
        return;
      }

      context.reply(giveInfoQuestions[Number(questionNumber) + 1]);
      // eslint-disable-next-line max-len
      await dataBase.setQuestionStatus('give_info', `${Number(questionNumber) + 1}`);
      return;
    }


  } catch (error) {
    console.log(error.message);
    context.reply('Щось пішло не так :(');
  }
});

bot.api.setMyCommands([
  { command: '/start', description: 'greeting' },
  { command: '/give_info', description: 'bit about yourself' },
  { command: '/session', description: 'bit about session' },
]);

if (process.env.IS_PRODUCTION === 'true') {
  const server = express();
  server.use(express.json());
  server.use(webhookCallback(bot, 'express'));

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(` BOT STARTED ON ${PORT} PORT `));
} else {
  bot.start();
  console.log(` BOT STARTED `);
}
