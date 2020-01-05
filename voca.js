class Voca {
    constructor(eng, kor, pronounce, audioKey) {
        this.eng = eng;
        this.kor = kor;
        this.pronounce = pronounce;
        this.audioKey = audioKey
    }

    engHtml() {
        var result = this.eng

        // if( this.pronounce ) {
        //     result += "<br>" + this.pronounce
        // }

        if( this.audioKey ) {
            result += "<br> <audio controls autoplay id='pronounce' src='" + this.audioUrl() + "'>가능?</audio>"
        }

        return result
    }

    audioUrl() {
        if( this.audioKey.startsWith("/") ) {
            return "./audio/" + this.eng + ".mp3"
        } else {
            return "http://t1.daumcdn.net/language/" + this.audioKey
        }
    }
}

const vocas = [];
(function () {
    for (var i = 0; i < vocaDatas.length; i++) {
        var item = vocaDatas[i];
        vocas[i] = new Voca(item[0], item[1], item[2], item[3]);
    }
})()

var voca = null

var vocaGroupSize = 50

function onLoadBody() {
    lsCheckVocaKrToEn = new LSCheckbox(checkbox_kr_to_en, "voca_kr_to_en", false)
    lsCheckVocaRandom = new LSCheckbox(checkbox_random, "vocal_random", false)
}


var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) { quiz() } else { answer() }
}
function audioPlay() {
    pronounce.play()
}

function clear() {
    div_question.innerText=""
    div_answer.innerText=""
    div_status.innerText=""
}


var currentIndex = 0
function getNextVoca() {
    currentIndex %= vocas.length
    var voca = vocas[currentIndex];
    currentIndex++
    return voca
}

var randomStartIndex = 0
var randomEndIndex = 0
var randomQuizSlot = []
function getRandomVoca() {
    randomStartIndex = 0
    randomEndIndex = vocas.length

    if(randomQuizSlot.length == 0 ) {
        randomQuizSlot = []
        for( var i = randomStartIndex; i < randomEndIndex; i++ ) {
            randomQuizSlot.push(eval(i))
        }
        shuffle(randomQuizSlot)
    }

    var randomIndex = randomQuizSlot.pop()

    return vocas[randomIndex]
}

function quiz() {
    clear()

    if( lsCheckVocaRandom.checked() ) {
        voca = getRandomVoca()
        div_status.innerText = "Random: " + randomStartIndex + "~" + randomEndIndex + ", remains:" + (randomQuizSlot.length)
    } else {
        voca = getNextVoca()
        div_status.innerText = "Sequential: " + currentIndex + "/" + vocas.length
    }

    if( lsCheckVocaKrToEn.checked() ) {
        div_question.innerText = voca.kor
    } else {
        div_question.innerHTML = voca.engHtml()
    }
}

function answer() {
    if( checkbox_kr_to_en.checked ) {
        div_answer.innerHTML = voca.engHtml()
    } else {
        div_answer.innerText = voca.kor
    }
}

function onclickCheckbox() {
    lsCheckVocaKrToEn.save();
    lsCheckVocaRandom.save();
    nextCount = 0
}
