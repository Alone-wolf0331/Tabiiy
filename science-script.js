/* science-script.js
   - 10 dars massiv
   - dinamik kartalar yaratiladi
   - sahifa ichida darsni ochish, o'qib berish, quiz
*/

const lessons = [
  {id:1, title:"1. O'simliklar", icon:"🌱",
    text:"O'simliklar suv va quyoshga muhtoj. Ildizlar yerda o'sadi. Barglar esa oziq-ovqat hosil qiladi.",
    quiz:{q:"O'simlik nimaga muhtoj?", choices:["Suv","Shirinlik","Televizor"], a:0}
  },
  {id:2, title:"2. Hayvonlar", icon:"🐶",
    text:"Hayvonlar ovqatlanadi va harakatlanadi. Ba'zilari quruqlikda, ba'zilari suvda yashaydi.",
    quiz:{q:"Baliqlar qayerda yashaydi?", choices:["Daraxt","Suv","Uy"], a:1}
  },
  {id:3, title:"3. Tanasi", icon:"👦",
    text:"Bizning boshimiz, qo'llarimiz, oyoqlarimiz bor. Biz yugurishimiz va sakrashimiz mumkin.",
    quiz:{q:"Yurish uchun nimadan foydalanamiz?", choices:["Qo'llar","Oyoq","Ko'zlar"], a:1}
  },
  {id:4, title:"4. Havo", icon:"☀️",
    text:"Ob-havo quyoshli, yomg'irli yoki shamolli bo'lishi mumkin. Biz turli xil kiyimlarni kiyamiz.",
    quiz:{q:"Qaysi biri yomg'irli?", choices:["☀️","☔","❄️"], a:1}
  },
  {id:5, title:"5. Oziq-ovqat", icon:"🍎",
    text:"Meva va sabzavotlar bizning o'sishimizga yordam beradi. Sog'lom ovqat iste'mol qiling.",
    quiz:{q:"Qaysi biri meva?", choices:["Sabzi","Olma","Tosh"], a:1}
  },
  {id:6, title:"6. Kun va tun", icon:"🌞🌙",
    text:"Kunduz quyosh va yorug'likka ega. Tun qorong'u va biz uxlaymiz.",
    quiz:{q:"Qachon uxlaymiz?", choices:["Kun","Tun","Tong"], a:1}
  },
  {id:7, title:"7. Ranglar", icon:"🎨",
    text:"Qizil, yashil, ko'k. Ranglar rasmlarni chiroyli qiladi.",
    quiz:{q:"Qaysi rang qizil?", choices:["🍎","🍌","🍇"], a:0}
  },
  {id:8, title:"8. Uy o'simliklari", icon:"🏡🌿",
    text:"Biz tuvaklardagi o'simliklarni sug'oramiz. Ular tuvaklarda o'sadi va xonani tetiklashtiradi.",
    quiz:{q:"Biz ... o'simliklar kerak.", choices:["Sindirish","Suv","Yeyish"], a:1}
  },
  {id:9, title:"9. Toza qo'llar", icon:"🧼",
    text:"Ovqatlanishdan oldin qo'llaringizni sovun bilan yuving. Toza qo'llar bizni sog'lom saqlaydi.",
    quiz:{q:"Qo'llarni yuvish uchun nimadan foydalanamiz?", choices:["Sovun","Cho'tka","Pichoq"], a:0}
  },
  {id:10, title:"10. Uy hayvonlari", icon:"🐱",
    text:"Uy hayvonlari mushuk va itlarni yaxshi ko'radi. Biz ularni boqamiz va yaxshi ko'ramiz.",
    quiz:{q:"Qaysi hayvon 'Meow' deydi?", choices:["It","Mushuk","Qush"], a:1}
  }
];

/* DOM refs */
const grid = document.getElementById('lessonsGrid');
const search = document.getElementById('search');
const lessonView = document.getElementById('lessonView');
const lvTitle = document.getElementById('lv-title');
const lvText = document.getElementById('lv-text');
const lvImg = document.getElementById('lv-img');
const readBtn = document.getElementById('readBtn');
const quizBtn = document.getElementById('quizBtn');
const quizArea = document.getElementById('quizArea');
const backBtn = document.getElementById('backBtn');

/* build grid */
function buildGrid(list){
  grid.innerHTML = '';
  list.forEach(l => {
    const el = document.createElement('article');
    el.className = 'card lesson-card';
    el.innerHTML = `
      <div class="lesson-thumb">${l.icon}</div>
      <div class="lesson-title">${l.title}</div>
      <div class="lesson-desc">${l.text.split(' ').slice(0,10).join(' ')}...</div>
    `;
    el.addEventListener('click', ()=> openLesson(l.id));
    grid.appendChild(el);
  });
}
buildGrid(lessons);

/* search */
search.addEventListener('input', ()=>{
  const q = search.value.trim().toLowerCase();
  const filtered = lessons.filter(l=> (l.title + ' ' + l.text).toLowerCase().includes(q));
  buildGrid(filtered);
});

/* open lesson */
let currentLesson = null;
function openLesson(id){
  const l = lessons.find(x=>x.id===id);
  if(!l) return;
  currentLesson = l;
  lvTitle.innerText = l.title;
  lvText.innerText = l.text;
  lvImg.innerHTML = `<div style="font-size:64px">${l.icon}</div>`;
  quizArea.style.display = 'none';
  lessonView.style.display = 'block';
  window.scrollTo({top:0, behavior:'smooth'});
}

/* back */
backBtn.addEventListener('click', ()=>{
  lessonView.style.display = 'none';
  quizArea.style.display = 'none';
});

/* read aloud */
readBtn.addEventListener('click', ()=>{
  if(!currentLesson) return;
  const msg = new SpeechSynthesisUtterance(currentLesson.text);
  msg.lang = "en-US"; // yoki "uz-UZ" agar o'zbekcha kerak bo'lsa
  speechSynthesis.speak(msg);
});

/* show quiz */
quizBtn.addEventListener('click', ()=>{
  if(!currentLesson) return;
  quizArea.style.display = 'block';
  renderQuiz(currentLesson);
});

/* render quiz */
function renderQuiz(l){
  quizArea.innerHTML = '';
  const qbox = document.createElement('div');
  qbox.innerHTML = `<p style="font-size:20px;margin-bottom:12px">${l.quiz.q}</p>`;
  l.quiz.choices.forEach((c, idx)=>{
    const b = document.createElement('div');
    b.className = 'q-item';
    b.innerText = c;
    b.addEventListener('click', ()=>{
      if(idx === l.quiz.a){
        b.classList.add('correct');
        speakShort("Well done! Correct.");
        setTimeout(()=> showCorrectScreen(),700);
      } else {
        b.classList.add('wrong');
        speakShort("Try again!");
        setTimeout(()=> b.classList.remove('wrong'),800);
      }
    });
    qbox.appendChild(b);
  });
  quizArea.appendChild(qbox);
}

/* helper speak short */
function speakShort(text){
  const m = new SpeechSynthesisUtterance(text);
  m.lang = "en-US";
  speechSynthesis.speak(m);
}

/* after correct show small congrats */
function showCorrectScreen(){
  quizArea.innerHTML = `<div style="padding:18px;border-radius:12px;background:#e8f5e9;font-size:20px">🎉 Tabrik! To'g'ri javob.</div>
  <div style="margin-top:12px"><button class="primary" onclick="lessonView.style.display='none'">👍 Davom</button></div>`;
}
