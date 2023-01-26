import { Configuration, OpenAIApi } from 'openai';

// firebase 8.10.1
import firebase from 'firebase/app';
import 'firebase/database';

import { ANSI } from '../../utils/ansi_colors.js';

console.log(ANSI.GREEN + "\n*--- generate.js (re)STARTED ---*" + ANSI.RESET);


//=======================================================
//
// FUNCTION -> UUID
//
var UUID_COUNTER = 0
export function UUID() {
  UUID_COUNTER++;
  let days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  let date = new Date();
  return (

    date.getFullYear() +
    "_" +
    ("0" + (date.getMonth() + 1)).slice(-2) + //BUG? Months start at 0
    "_" +
    ("0" + date.getDate()).slice(-2) +
    "_" +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    ":" +
    ("0" + date.getSeconds()).slice(-2) +
    "," +
    ("000" + date.getMilliseconds()).slice(-3) +
    "_" +
    ("000000" + UUID_COUNTER).slice(-6)
  );
}
//
// FUNCTION -> UUID
//
//=======================================================


//=======================================================
//
// FIREBASE 8
//
// 1. init
const firebaseConfig = {
  databaseURL:
    'https://my-papayou-2-default-rtdb.europe-west1.firebasedatabase.app/',
};
//
// 2. Initialize Firebase
const apptiti = firebase.initializeApp(firebaseConfig);
const databasetiti = firebase.database();
//
// 3.1 writeData, the write function !
function writeData(path, key, value) {
  firebase
    .database()
    .ref(path + '/' + key)
    .set(value);
}
//
// 3.3 let's send some data
writeData('logopenai-pauljob', UUID(), { log: 'start OK' })
console.log(ANSI.GREEN + `... after writeData('logopenai-pauljob', UUID(), { log: 'start OK' })` + ANSI.RESET)


//
// 4. read data if changed
/*
var newLogData = firebase.database().ref('logissim');
newLogData.on('value', (snapshot) => {
  const data = snapshot.val();
  for (const property in data) {
    let logMsg = data[property];
    console.log(`${property}: ${logMsg.message}`);
  }
});
*/
//
//=======================================================


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  const firstPrompt = `${req.body.userInput}${process.env.OPENAI_REQUEST_DESCRIPTION_FR}`;
  console.log(ANSI.CYAN + '\n' + firstPrompt + ANSI.GREEN + '...' + ANSI.RESET)
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: firstPrompt,
    temperature: 0.7,
    max_tokens: 1000,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  writeData('openai-pauljob-serverside', UUID(), {
    brief: process.env.OPENAI_REQUEST_DESCRIPTION_FR,
    prompt: req.body.userInput,
    answer: `${basePromptOutput.text}`
  })

  console.log(ANSI.GREEN + '...' + ANSI.BLUE + basePromptOutput.text + ANSI.RESET)

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;