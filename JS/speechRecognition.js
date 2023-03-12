const texts = document.querySelector(".texts");
const btnRecord = document.querySelector(".btnRecord");

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

btnRecord.addEventListener("click", (e) =>{
    texts.focus();
    e.preventDefault();
    btnRecord.style.color = "red";
    recognition.start();
})

recognition.addEventListener("end", ()=>{
    btnRecord.style.color = "purple";

})

recognition.addEventListener("result", (e) => {
    // texts.appendChild(p);
    const text = Array.from(e.results)
    .map((result) => result[0]).map((result) => result
    .transcript).join("");

    texts.value = text;

});

