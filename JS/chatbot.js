const apiKey = 'OPEN-AI-KEY';
const baseUrl = 'https://api.openai.com/v1/chat/completions';

const questionInput = document.querySelector('#question');
const answerDiv = document.querySelector('#answer');

const btnSpeak = document.querySelector('.btnSpeak');

let conversation = 'You are a nice bot';
// console.log(conversation);
const renderMessageEle = (txt, type) => {
  let className = "chatbot-message";
  if (type === "user"){
    className = "user-message";
  }
  const messageEle = document.createElement("div");
  const txtNode = document.createTextNode(txt);
  messageEle.classList.add(className);
  messageEle.append(txtNode);
  answerDiv.append(messageEle);
  setScrollPosition();
}

questionInput.addEventListener("keyup", async (event) => {
  if (event.keyCode === 13){
    // console.log('hi');
    let question = questionInput.value;
    questionInput.value = '';
    renderMessageEle(question, "user");

    conversation += `User: ${question}\n`;
    console.log(conversation);
    let prompt = conversation + "Bot:";

    try {
      const response = await axios.post(
        baseUrl,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {role :  "user",
            content : prompt}
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      const answer = response.data.choices[0].message.content.trim();
      renderMessageEle(answer, "chatbot");
      renderSpeak(answer);

      conversation += `Bot: ${answer}\n`;
    } catch (error) {
      console.error(error);
    }
  }
});

console.log(conversation);

var currentUtterance = null;
var synth = window.speechSynthesis;
let voices = [];
synth.onvoiceschanged = () => {
  voices = synth.getVoices();

};

const renderSpeak = (answer) =>{
btnSpeak.addEventListener('click', () => {
    questionInput.focus();
    if (currentUtterance !== null) {
      synth.cancel();
    }
  
    // tạo đối tượng mới và phát âm
    var toSpeak = new SpeechSynthesisUtterance(answer);
    var language = detectLanguage(answer);
    //var language = 'vi';
    console.log(language);
    toSpeak.lang = language;
    toSpeak.voice = window.speechSynthesis.getVoices().find(function(voice) {
      return voice.lang.startsWith(language);
    });
    synth.speak(toSpeak);
    
    currentUtterance = toSpeak; // lưu trữ đối tượng đang phát âm mới
  });
}

//Detect language of text
function detectLanguage(text) {
  let words = text.split(' ');
  let countVietnamese = 0;

  // Kiểm tra các từ và cụm từ để phân biệt tiếng Anh và tiếng Việt
  words.forEach(word => {
    // Kiểm tra tiếng Việt
    if (/^[a-zA-Z]*$/.test(word) === false && /[^\u0000-\u007F]+/.test(word) === true) {
      countVietnamese++;
    }
  });

  if (countVietnamese >= 1) {
    return 'vi';
  } else {
    return 'en';
  }
}

const setScrollPosition = () => {
  if (answerDiv.scrollHeight > 0){
    answerDiv.scrollTop = answerDiv.scrollHeight;
  }
}

