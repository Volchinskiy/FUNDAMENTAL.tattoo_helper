import { Configuration, OpenAIApi } from "openai";

class AI {
  constructor() {
    this.apiKey = process.env.OPENAI_KEY;
    this.pictureSize = process.env.PICTURE_SIZE;
    this.configuration = new Configuration({ apiKey: this.apiKey });
    this.openai = new OpenAIApi(this.configuration);
  }

  /**
   * Generates a picture based on the description
   * @param {string} prompt description of the picture to be generated
   * @returns object generated image
   */
  async generatePicture(prompt) {
    return await this.openai.createImage({
      prompt,
      n: 1,
      size: this.pictureSize,
    });
  }
}

export default new AI();
