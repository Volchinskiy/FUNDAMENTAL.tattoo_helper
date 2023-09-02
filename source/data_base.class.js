const mysql = require('mysql2');

class DataBase  {
  constructor() {
    console.log('\n CONNECTED TO DATABASE ');
  }

  DATABASE_URL = process.env.DATABASE_URL;
  CONNECTION = mysql.createConnection(this.DATABASE_URL).promise();

  saveTelegramInformation(id, isBot, firstName, username, languageCode) {
    // eslint-disable-next-line max-len
    this.CONNECTION.query('INSERT INTO TattooClients (telegramId, telegramIsBot, telegramFirstName, telegramUserName, telegramLanguageCode) VALUES (?, ?, ?, ?, ?)', [id, isBot, firstName, username, languageCode]);
  }

  getUserByTelegramId(id) {
    // eslint-disable-next-line max-len
    return this.CONNECTION.query('SELECT * FROM TattooClients WHERE telegramId = ?', [id]);
  }

  setQuestionStatus(questionGroup, questionNumber) {
    // eslint-disable-next-line max-len
    this.CONNECTION.query('UPDATE TattooClients SET questionStatus = ?', [`${questionGroup} ${questionNumber}`]);
  }

  updateTattooClient(column, date, clientId) {
    // eslint-disable-next-line max-len
    this.CONNECTION.query(`UPDATE TattooClients SET ${column} = ? WHERE id = ?`, [date, clientId]);
  }

}



module.exports = new DataBase();
