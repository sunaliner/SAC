const { Translate } = require("@google-cloud/translate").v2;

// Creates a client
const translate = new Translate();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const text = 'The text to translate, e.g. Hello, world!';
// const target = 'The target language, e.g. ru';

async function translateText(text, target) {
  // Translates some text into Russian
  try {
    const [translation] = await translate.translate(text, target);
    return translation;
  } catch (error) {
    console.log(error);
    return false;
  }
}

exports.translateText = translateText;
