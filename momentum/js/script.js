'use strict';

let state = {
    lang: 'en',
    sourceBg: 'git',
    tag: '',
    blocks: {
        time: true,
        date: true,
        'greeting-container': true,
        'quote-wrap': true,
        weather: true,
        player: true
    }
}

/*greeting*/
function getTimeOfDay(){
    let arrTime = ['night', 'morning', 'afternoon', 'evening'];
    const date = new Date();
    const hours = date.getHours();
    return arrTime[Math.trunc(hours / 6)];
}

function greetingTranslation(){
    let greeting = ['Good night', 'Good morning', 'Good afternoon', 'Good evening'];
    if (state.lang == 'ru'){
        greeting = ['Доброй ночи', 'Доброе утро', 'Добрый день', 'Добрый вечер'];
    }
    const date = new Date();
    const hours = date.getHours();
    return greeting[Math.trunc(hours / 6)];
}

function showGreeting(){
    const name = document.querySelector('.name');
    const greeting = document.querySelector('.greeting');
    const timeOfDay = greetingTranslation();
    greeting.textContent = timeOfDay;
    if (name.value){
        name.size = name.value.length - 2;
    }else{
        name.size = 20;
    }
}

function setLocalStorage(){
    const name = document.querySelector('.name');
    const city = document.querySelector('.city');
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('state', JSON.stringify(state));
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage(){
    const name = document.querySelector('.name');
    const city = document.querySelector('.city');
    const tag = document.querySelector('.tag input');
    if(localStorage.getItem('name')){
        name.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')){
        city.value = localStorage.getItem('city');
        getWeather();
    }else{
        city.value = 'Minsk';
        getWeather();
    }
    if(localStorage.getItem('state')){
        state = JSON.parse(localStorage.getItem('state'));
        tag.value = state.tag;
    }
}
getLocalStorage();

function placeholderTranslation(){
    const name = document.querySelector('.name');
    const city = document.querySelector('.city');
    const tag = document.querySelector('input[name="tag"]');
    name.placeholder = '[Enter name]';
    city.placeholder = '[Enter city]';
    tag.placeholder = '[Enter tag]';
    if (state.lang == 'ru'){
        name.placeholder = '[Введите имя]';
        city.placeholder = '[Введите город]';
        tag.placeholder = '[Введите тег]';
    }
}
placeholderTranslation();

/*time and date*/
function showDate(){
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (state.lang == 'ru'){
        days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    }
    const dateWrap = document.querySelector('.date');
    const date = new Date();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const dayWeek = days[date.getDay()];
    dateWrap.textContent = `${dayWeek}, ${month} ${day}`;
    if (state.lang == 'ru'){
        dateWrap.textContent = `${dayWeek}, ${day} ${month}`;
    }
}
function showTime(){
    const time = document.querySelector('.time');
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
    showDate();
    showGreeting()
}
showTime();

/*slider*/
let randomNum = getRandomNum(1, 20);
function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSlideNext(){
    if (randomNum < 20){
        randomNum++;
        setBg();
    }else{
        randomNum = 1;
        setBg();
    }
}

function getSlidePrev(){
    if (randomNum > 1){
        randomNum--;
        setBg();
    }else{
        randomNum = 20;
        setBg();
    }
}

function setBg(){
    const body = document.querySelector('body');
    const timeOfDay = getTimeOfDay();
    let bgNum = String(randomNum).padStart(2, "0");

    const img = new Image();
    if (state.sourceBg == 'git'){
        img.src = `https://raw.githubusercontent.com/prizzz/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    }else if (state.sourceBg == 'unsplash' || state.sourceBg == 'flickr'){
        getLinkToImage();
    }
    
    img.onload = () => {      
        body.style.backgroundImage = `url(${img.src})`;
    }; 
}
setBg();

function slider(){
    const slideNext = document.querySelector('.slide-next');
    const slidePrev = document.querySelector('.slide-prev');
    slideNext.addEventListener('click', getSlideNext);
    slidePrev.addEventListener('click', getSlidePrev);
}
slider();

/*weather*/
async function getWeather() {
    const weatherIcon = document.querySelector('.weather-icon');
    const temperature = document.querySelector('.temperature');
    const wind = document.querySelector('.wind');
    const humidity = document.querySelector('.humidity');
    const weatherDescription = document.querySelector('.weather-description');
    const weatherError = document.querySelector('.weather-error');
    const city = document.querySelector('.city');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${state.lang}&appid=98e3967de60400906772052ed2952232&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if(+data.cod >= 400 &&  +data.cod <= 600){
        weatherError.textContent = data.message;
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
        weatherDescription.textContent = '';
    }else{
        weatherError.textContent = '';
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        weatherDescription.textContent = data.weather[0].description;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        wind.textContent = `Wind speed: ${Math.round(data.wind.speed)}m/s`;
        humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
        if (state.lang == 'ru'){
            wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)}м/с`;
            humidity.textContent = `Влажность: ${Math.round(data.main.humidity)}%`;
        }
    }
}
getWeather();

function changeWeatherCity(){
    const city = document.querySelector('.city');
    city.addEventListener('change', getWeather);
}
changeWeatherCity();

/*quotes*/

async function getQuote(){
    const quote = document.querySelector('.quote');
    const author = document.querySelector('.author');

    const url = `js/${state.lang}Quotes.json`;
    const res = await fetch(url);
    const data = await res.json();

    let randomNum = getRandomNum(0, 60);

    quote.textContent = data.quotes[randomNum].quote;
    author.textContent = data.quotes[randomNum].author;
}
getQuote();

function quotes(){
    const changeQuote = document.querySelector('.change-quote');
    changeQuote.addEventListener('click', getQuote);
}
quotes();

/*audio*/
import {playList} from './playList.js';

function audio(){
    const audio = new Audio();
    const playListContainer = document.querySelector('.play-list');
    const play = document.querySelector('.play');
    const btnPlayNext = document.querySelector('.play-next');
    const btnPlayPrev = document.querySelector('.play-prev');
    let isPlay = false;
    let playNum = 0;

    for(let i = 0; i < playList.length; i++) {
        const li = document.createElement('li');
        li.classList.add('play-item');
        li.textContent = playList[i].title;
        playListContainer.append(li);
    }

    const items = document.querySelectorAll('.play-item');

    audio.src = `assets/sounds/${playList[playNum].title}.mp3`;
    document.querySelector('.audioName').textContent = playList[playNum].title;
    document.querySelector(".audioTime .length").textContent = playList[playNum].duration;
    audio.currentTime = 0;

    function playNext(){
        isPlay = false;
        items[playNum].classList.remove('item-active');
        if (playNum < 3){
            playNum++;
            audio.src = `assets/sounds/${playList[playNum].title}.mp3`;
            playAudio();
        }else{
            playNum = 0;
            audio.src = `assets/sounds/${playList[playNum].title}.mp3`;
            playAudio();
        } 
    }
    
    function playPrev(){
        isPlay = false;
        items[playNum].classList.remove('item-active');
        if (playNum > 0){
            playNum--;
            audio.src = `assets/sounds/${playList[playNum].title}.mp3`;
            playAudio();
        }else{
            playNum = 3;
            audio.src = `assets/sounds/${playList[playNum].title}.mp3`;
            playAudio();
        }
    }

    function playAudio() {
        document.querySelector('.audioName').textContent = playList[playNum].title;
        document.querySelector(".audioTime .length").textContent = playList[playNum].duration;
        if (!isPlay){
            audio.play();
            play.classList.add('pause');
            items[playNum].classList.add('item-active');
            isPlay = true;
        }else{
            audio.pause();
            play.classList.remove('pause');
            items[playNum].classList.remove('item-active');
            isPlay = false;
        }
    }

    play.addEventListener('click', playAudio);
    btnPlayNext.addEventListener('click', playNext);
    btnPlayPrev.addEventListener('click', playPrev);
    audio.addEventListener('ended', playNext);

    function getTimeCodeFromNum(num) {
        let seconds = parseInt(num);
        let minutes = parseInt(seconds / 60);
        seconds -= minutes * 60;
        const hours = parseInt(minutes / 60);
        minutes -= hours * 60;
      
        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(
          seconds % 60
        ).padStart(2, 0)}`;
    }

    audio.volume = .2;

    const timeline = document.querySelector('.timeline');
    const progressbar = document.querySelector('.progressbar')
    timeline.addEventListener("click", e => {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
        audio.currentTime = timeToSeek;
        progressbar.style.width = timeToSeek + '%';
    }, false);

    setInterval(() => {
        const progressBar = document.querySelector(".progressbar");
        progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
        document.querySelector(".audioTime .current").textContent = getTimeCodeFromNum(audio.currentTime);
    }, 500);

    const volumeSlider = document.querySelector(".volumeline");
    volumeSlider.addEventListener('click', e => {
        const sliderWidth = window.getComputedStyle(volumeSlider).width;
        const newVolume = e.offsetX / parseInt(sliderWidth);
        audio.volume = newVolume;
        document.querySelector(".volumebar").style.width = newVolume * 100 + '%';
    }, false);

    document.querySelector(".volume-btn").addEventListener("click", () => {
        const volumeEl = document.querySelector(".volume-btn");
        audio.muted = !audio.muted;
        if (audio.muted) {
          volumeEl.classList.add("mute");
        } else {
          volumeEl.classList.remove("mute");
        }
    });

    playListContainer.addEventListener('click', (e) => {
        const arrItems = Array.from(items);
        if (e.target.classList.contains('play-item')){
            if (e.target.classList.contains('item-active')){
                audio.pause();
                play.classList.remove('pause');
                items[playNum].classList.remove('item-active');
                isPlay = false;
            }else{
                audio.pause();
                play.classList.remove('pause');
                items[playNum].classList.remove('item-active');
                isPlay = false;
                playNum = arrItems.indexOf(e.target);
                audio.src = `assets/sounds/${playList[playNum].title}.mp3`;
                playAudio();
            }  
        }
    });
}
audio();

/*api bg*/
async function getLinkToImage() {
    const body = document.querySelector('body');
    let tag = `${getTimeOfDay()} nature`;
    if (state.tag != ''){
        tag = state.tag;
    }
    const img = new Image();
    if (state.sourceBg == 'unsplash'){
        const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=UnsAmNg1WyxbUK_fL1MSHlA6935NzV_e1X99f3HnJ7o`;
        const res = await fetch(url);
        const data = await res.json();
        img.src = data.urls.regular;
    }else{
        const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=32e8e0c6e8cbeaa9225985114a06dfa4&text=${tag}&extras=url_l&format=json&nojsoncallback=1`;
        const res = await fetch(url);
        const data = await res.json();
        img.src = data.photos.photo[randomNum].url_l;
    }
    img.onload = () => {      
        body.style.backgroundImage = `url(${img.src})`;
    }; 
}

/*settings*/

function settingBtn() {
    const setting = document.querySelector('.setting-modal');
    const btn = document.querySelector('.setting-button');

    btn.addEventListener('click', () => {
        if (setting.classList.contains('hidden')){
            setting.classList.remove('hidden');
            setTimeout(() => {setting.style.opacity = '1'}, 100);
        }else{
            setting.style.opacity = '0';
            setTimeout(() => {setting.classList.add('hidden')}, 100);
        }
    });
}
settingBtn();

function settingTranslate() {
    const settingTitle = document.querySelectorAll('.setting-title');
    const settingItem = document.querySelectorAll('.setting-item span');
    const settingTitleDefault = ['Language:', 'Background source:', 'Show:'];
    const settingItemDefault = ['English', 'Russian', 'GitHub', 'Unsplash API', 'Flickr API', 'Tag for API', 'Time', 'Date', 'Greeting', 'Quote', 'Weather', 'Audio'];
    settingTitle.forEach((el, i) => {
        el.textContent = settingTitleDefault[i]
    });
    settingItem.forEach((el, i) => {
        el.textContent = settingItemDefault[i]
    });
    if (state.lang == 'ru'){
        const settingTitleTranslate = ['Язык:', 'Источник фона:', 'Показать:'];
        const settingItemTranslate = ['Английский', 'Русский', 'GitHub', 'Unsplash API', 'Flickr API', 'Тег для API', 'Время', 'Дата', 'Приветствие', 'Цитаты', 'Погода', 'Аудио'];
        settingTitle.forEach((el, i) => {
            el.textContent = settingTitleTranslate[i]
        });
        settingItem.forEach((el, i) => {
            el.textContent = settingItemTranslate[i]
        });
    }
}
settingTranslate();

function settingShowBLocks() {
    for (let key in state.blocks){
        if (state.blocks[key] == false){
            document.querySelector(`.${key}`).style.opacity = '0';
            setTimeout(() => {document.querySelector(`.${key}`).style.visibility = 'hidden';}, 100);
        }else{
            document.querySelector(`.${key}`).style.visibility = 'inherit';
            setTimeout(() => {document.querySelector(`.${key}`).style.opacity = '1';}, 100);
        }
    }
}
settingShowBLocks();

function changeSettingTag(){
    const tag = document.querySelector('.tag input');
    tag.addEventListener('change', () => {
        state.tag = tag.value;
        getLinkToImage();
    });
}
changeSettingTag();

function setSettings() {
    const inputsRadio = document.querySelectorAll('.setting-modal input[type="radio"]');
    const inputsCheckbox = document.querySelectorAll('.setting-modal input[type="checkbox"]');
    inputsRadio.forEach(el => {
        for (let key in state){
            if (state[key] == el.value){
                el.checked = true;
            }
        }
    });

    inputsCheckbox.forEach(el => {
        for (let key in state.blocks){
            if (el.value == key && state.blocks[key] == true){
                el.checked = true;
            }
        }
    });
}
setSettings();

function settingUse() {
    document.querySelector('.setting-modal').addEventListener('click', (e) => {
        if (e.target.name == 'lang'){
            state.lang = e.target.value;
            placeholderTranslation();
            settingTranslate();
            showDate();
            showGreeting();
            getWeather();
            getQuote();
        }else if (e.target.name == 'source'){
            state.sourceBg = e.target.value;
            setBg();
        }else if (e.target.name == 'show'){
            if (e.target.checked){
                state.blocks[e.target.value] = true;
            }else{
                state.blocks[e.target.value] = false;
            }
            settingShowBLocks();
        }
    });
}
settingUse();