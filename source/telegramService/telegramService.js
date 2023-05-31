import AI from "../ai/ai.js";
import Database from "../bd/bd.js";
import Translator from "../translator/translator.js";
import axios from "axios";

class TelegramService {
  constructor() {}

  /**
   * process information about new user
   * @param {string} name name of the new user
   * @param {number} chatId unique id of the new user
   * @returns object with the details of the operation
   */
  processStartNewBot = async (name, chatId) => {
    try {
      if (await Database.checkUser(chatId)) {
        return null;
      }
      return await Database.addInformationAboutNewUserToDatabase(name, chatId);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Processes the description and returns the created image
   * @param {string} prompt description of the photo to be generated
   * @returns buffer of the generated photo
   */
  processUserPrompt = async (userId, prompt) => {
    try {
      const translatedText = await Translator.translateUserText(prompt);

      await Database.addUserPromptToDatabase(userId, translatedText.text);

      const photo = await AI.generatePicture(translatedText.text);

      // converts url to buffer png
      const bufferImmage = await axios({
        url: photo.data.data[0].url,
        responseType: "arraybuffer",
      });

      return bufferImmage.data;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Saves information about the image and the user who saved it to the database
   * @param {*} reaction -
   * @returns -
   */
  processSavePhoto = async (ownerId, imageId, uniqueImageId) => {
    try {
      if (!(await Database.checkPhoto(uniqueImageId))) {
        return await Database.addSavedImageIdToDatabase(
          ownerId,
          imageId,
          uniqueImageId
        );
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   *
   * @param {number} ownerId unique id of the user
   * @param {string} imageId unchangeable picture id
   * @returns object with the details of the operation
   */
  processDeletePhoto = async (ownerId, imageId) => {
    try {
      return await Database.removeSavedImageIdFromDatabase(ownerId, imageId);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Request to receive all photo
   * @param {number} ownerId unique id of the user
   * @returns array with objects of all saved pictures
   */
  processGetAllPhoto = async (ownerId) => {
    try {
      return await Database.getAllSavedPhoto(ownerId);
    } catch (error) {
      console.log(error);
    }
  };
}

export default new TelegramService();
