import Head from 'next/head';
import Image from 'next/image';

import coffeeLogo from '../assets/coffee-logo.png'

// firebase 8.10.1
import firebase from 'firebase/app';
import 'firebase/database';

import { useState } from 'react';


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
writeData('logopenai', UUID(), { log: 'start OK' })


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

const Home = () => {
  const [userInput, setUserInput] = useState('');

  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);


    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;

    writeData('openai', UUID(), { prompt: userInput, answer: output.text })

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  // Ask for your Motivation Letter !
  // Demandez votre lettre de motivation !
  // Give me some informations about you and the company you are looking for, I will do the rest !
  // Donnez moi quelques informations sur vous et l'organisation que vous visez, et je m'occupe du reste !
  // start typing heres. For instance : I'm honest, hard work, enthusiast. I would like to be hired in a new car repair shop in Saint-Nazaire, DLGA. The owner is looking for a secretary for appointments and welcome the customers.
  // Commencez par écrire ici, par exemple : Je m'appelle Myriam Bababoum, 51 ans.  Je suis honnête, travailleuse, pleine d'enthousiasme, mère de 2 jeunes filles pleine d'énergie dont je suis très fière. J'ai 30 ans d'expériences dans des domaines variés, dont 4 ans de parcours du monde, grimper au sommet de montagnes, la direction des ressources humaine dans des milieux variés, dont celui de l'autisme. Je voudrais intégrer l'équipe des Editions Papaouté, qui édite des livres pour les enfants atypiques et leurs parents.
  // Commencez par écrire ici, par exemple : Je m'appelle Michel, j'ai 20 ans, et je rêve de bosser pour Tesla. Je n'ai aucune expérience mais je suis hyper motive !
  return (
    <div className="root">
      <Head>
        <title>Lettre de Motivation</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Demandez votre lettre de motivation !</h1>
          </div>
          <div className="header-subtitle">
            <h2>Donnez moi quelques informations sur vous et l'organisation que vous visez dans le cadre ci-dessous (par exemple, Je m'appelle Michel, j'ai 20 ans, et je rêve de bosser pour Tesla. Je n'ai aucune expérience mais je suis hyper motivé!), appuyez ensuite sur 'GO!' et je m'occupe du reste en une douzaine de secondes!</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            placeholder="Commencez par remplacer ce message en cliquant / touchant dans le cadre puis en écrivant quelques infos..."
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>GO!</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Lettre de motivation</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
          <div className="contact">
            <h2>Contact: <a href="mailto:profpepite@proton.me" style={{ color: 'gray' }}>profpepite@proton.me</a></h2>
          </div>
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://donate.stripe.com/00g15qbu32to4mY8ww"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={coffeeLogo} alt="coffee logo" />
            <p>faire un don </p>
          </div>
        </a>
      </div>
    </div>
  );
};



export default Home;