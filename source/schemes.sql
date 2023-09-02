CREATE TABLE TattooClients (
  id                    INT           NOT NULL   AUTO_INCREMENT,
  firstName             VARCHAR(255),
  secondName            VARCHAR(255),
  age                   INT,
  instagramUrl          VARCHAR(150),
  phoneNumber           VARCHAR(19),
  communicationSource   VARCHAR(9),
  email                 VARCHAR(255),
  questionStatus        VARCHAR(255),
  isToldAboutYourself   BOOLEAN       DEFAULT    false,
  telegramId            VARCHAR(255),
  telegramIsBot         BOOLEAN,
  telegramFirstName     VARCHAR(255),
  telegramUserName      VARCHAR(255),
  telegramLanguageCode  VARCHAR(2),
  PRIMARY KEY (id)
);

CREATE TABLE TattooSessions (
  id                    INT           NOT NULL   AUTO_INCREMENT,
  masterId              INT           NOT NULL,
  clientId              INT           NOT NULL,
  sessionDate           DATE          DEFAULT    (CURDATE()),
  price                 INT           NOT NULL,
  comment               VARCHAR(255),
  sketch                VARCHAR(255),
  firstReactivation     DATE          DEFAULT    (ADDDATE(CURDATE(), INTERVAL 20 DAY)),
  secondReactivation    DATE          DEFAULT    (ADDDATE(CURDATE(), INTERVAL 60 DAY)),
  PRIMARY KEY (id)
);

CREATE TABLE TattooMasters (
  id                    INT           NOT NULL   AUTO_INCREMENT,
  firstName             VARCHAR(255),
  telegramId            VARCHAR(255),
  PRIMARY KEY (id)
);
