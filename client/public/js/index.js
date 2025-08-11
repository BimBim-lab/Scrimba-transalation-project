import { API_BASE } from './config.js';

const translateButton = document.getElementById("translate-button");
const textareaToTranslate = document.querySelector(".textarea-to-translate");
const textToTranslate = document.getElementById("text-to-translate");
const selectLanguage = document.getElementById("select-language");
const chatModeButton = document.getElementById("chat-mode-button");
const startOverButton = document.getElementById("start-over-button");
const chooseLanguage = document.querySelector(".choose-language");
const textareaAfterTranslation = document.querySelector(".textarea-after-translation");
const translateSection = document.querySelector(".content");
const chatSection = document.querySelector(".chat-content");
const nhistory = 4


// ====== Translate ======
translateButton.addEventListener("click", async ()=>{
    const text = textareaToTranslate.value.trim();
    const selectedLanguage = document.querySelector('input[name="language"]:checked');
    const target = selectedLanguage ? selectedLanguage.value : null;
    console.log(`text: ${text}, target: ${target}`);
    if (!text || !target) {
        alert("Please enter text and select a language.");
        return;
    }
    translateButton.disabled = true;
    translateButton.innerText = "Translating...";
    try{
        const response = await fetch (`${API_BASE}/translate`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                target
            })
        })
        const data = await response.json();
        console.log(data);
        renderResultTranslate(data);

    }
    catch(e){
        alert('failed to translate')
        console.error(e);
    }
})

function renderResultTranslate(data){
    textToTranslate.textContent = 'Original text 👇'
    selectLanguage.textContent = 'Your translation 👇'
    chooseLanguage.classList.add("hide");
    textareaAfterTranslation.classList.remove("hide");
    textareaAfterTranslation.value = data.translation;
    translateButton.classList.add('hide');
    startOverButton.classList.remove('hide');
    chatModeButton.classList.remove('hide');
}

startOverButton.addEventListener("click", ()=>{
    chooseLanguage.classList.remove("hide");
    textareaAfterTranslation.classList.add("hide");
    translateButton.classList.remove('hide');
    translateButton.textContent = "Translate";
    translateButton.disabled = false;
    startOverButton.classList.add('hide');
    chatModeButton.classList.add('hide');
    textareaToTranslate.value = '';
    textToTranslate.textContent = 'Text to translate 👇';
    selectLanguage.textContent = 'Select language 👇';
})

chatModeButton.addEventListener("click", ()=>{
    translateSection.classList.add("hide");
    chatSection.classList.remove("hide");
})


// ====== CHAT ======
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatOutput = document.getElementById("chat-output");
const chatSubmit = document.getElementById("chat-submit");

chatForm?.addEventListener("submit", async (e)=>{
    e.preventDefault();
    chatSubmit.disabled = true;
    const text = chatInput.value.trim();
    if (!text) {
        alert("Please enter a message.");
        return;
    }
    const targetLanguage = document.querySelector('.flag-button.active');
    if (!targetLanguage) {
        alert("Please select a language to chat in.");
        return;
    }
    const target = targetLanguage.dataset.lang;
    addBubble(text, 'out');
    chatInput.value = '';
    chatInput.style.height = '40px'; // Reset height for new input
    const history = getRecentChatHistory(nhistory);
    console.log(history);
    console.log(target);

    try{
        const res = await fetch(`${API_BASE}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                history,
                target,
                option: { correct: true, level: 'A2-B1' }
            })
        })
        const data = await res.json();
        console.log(data);
        addBubble(data.reply || 'No reply', 'in');
    }
    catch(e){
        console.error(e);
        addBubble('Failed to get replay. Please try again.', 'in');
    }
    chatSubmit.disabled = false;


})


document.querySelectorAll('.flag-button').forEach(button=>{
    button.addEventListener('click', ()=>{
        document.querySelector('.flag-button.active')?.classList.remove('active');
        button.classList.add('active');
    })
});

function addBubble(text, side){
    const div = document.createElement('div')
    div.className = `bubble bubble--${side}`;
    div.textContent = text;
    chatOutput.appendChild(div);
    chatInput.scrollTo({
        top: chatInput.scrollHeight,
        behavior: "smooth"
    });
}

function getRecentChatHistory(n){
    const bubbles = [...chatOutput.querySelectorAll('.bubble')];
    const slice = bubbles.slice(-n);
    return slice.map(bubble=>({
        role: bubble.classList.contains('bubble--out') ? 'user' : 'assistant',
        content: bubble.textContent
    }))

}