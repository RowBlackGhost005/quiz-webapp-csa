let fetchQuestionButton = document.getElementById("buttonFetch");

let quizzContainer = document.getElementById("questionContainer");

let quizzNavbar = document.getElementById("quizzNavButtons");
quizzNavbar.style.display = "none";

let buttonStartQuizz = document.getElementById("buttonStartQuizz");

let buttonPrevious = document.getElementById("previousQuestion");

let buttonSubmit = document.getElementById("submitQuestion");
buttonSubmit.style.visibility = "hidden";

let buttonNext = document.getElementById("nextQuestion");

let questionTracker = document.getElementById("questionNumberTrack");

let correctAnswerContainer = document.getElementById("correctAnswerLegend");
correctAnswerContainer.style.display = "none";

let correctAnswerCount = document.getElementById("correctAnswerAmmount");


let correctAnswers = [10];

let responses = [10];

let questions = [10];

let questionNumber = 0;

let questionId = 0;

let answersCorrect = 0;

fetchQuestionButton.addEventListener("click" , function() {
    startQuizz();
});

function startQuizz(){

    quizzContainer.replaceChildren();

    diseableSubmit()

    correctAnswerCount.innerText = 0;

    questionId = 0;

    answersCorrect = 0;

    fetchQuestions()
    .then(quizz => {

        for(let i = 0 ; i < 10 ; i++){
            let question = quizz[i];

            let incorrectAnswers = question.incorrectAnswers;

            let correctAnswer = question.correctAnswer;

            let difficulty = question.difficulty;

            let category = question.category;

            let questionTitle = question.question.text;

            incorrectAnswers.push(correctAnswer);

            let questionData = {
                "title" : questionTitle,
                "category" : category,
                "difficulty" : difficulty,
                "answers" : incorrectAnswers,
                "correctAnswer" : correctAnswer,
            }

            createQuestion(questionData);
        }

        quizzContainer.appendChild(questions[0]);

        quizzNavbar.style.display = "block";

        buttonStartQuizz.style.display = "none";

        setQuestionNumber(0);
        
    })
    .catch(err => {
        alert(err);
    });
}

async function fetchQuestions(){
    try{

        const headers = new Headers();

        headers.append("X-API-Key" , "");

        const response = await fetch("https://the-trivia-api.com/v2/questions" , {
            method: 'GET',
            headers: headers,
        });

        const data = await response.json();

        return data;
    }catch(err){
        alert(err);
    }
}

function createQuestion(questionData){

    // Create container
    const quizContainer = document.createElement("div");
    quizContainer.className = "container pt-5";
    quizContainer.id = "questionContainer" + questionId;

    // Create title row
    const titleRow = document.createElement("div");
    titleRow.className = "row text-center";
    const title = document.createElement("h2");
    title.textContent = questionData.title;
    titleRow.appendChild(title);
    quizContainer.appendChild(titleRow);

    // Create answers row
    const answersRow = document.createElement("div");
    answersRow.className = "row py-2";
    //answersRow.id = ""; // Leaving it empty

    // Generate columns with radio buttons
    for (let i = 0; i < 4; i++) {
        const column = document.createElement("div");
        column.className = "row justify-content-end py-1";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer" + questionId; // Leaving empty
        input.id = questionId + "" + i; // Leaving empty
        input.value = questionData.answers[i]; // Leaving empty
        input.className = "col-1 w-auto";

        const label = document.createElement("label");
        label.setAttribute("for", "answer" + i); // Keeping the static 'test' value
        label.textContent = questionData.answers[i];
        label.className = "col-7"

        column.appendChild(input);
        column.appendChild(label);
        answersRow.appendChild(column);
    }

    quizContainer.appendChild(answersRow);

    questions[questionId] = quizContainer;
    correctAnswers[questionId] = questionData.correctAnswer;

    questionId++;
    // Append to body or any other container
    //quizzContainer.appendChild(quizContainer);
}

function setQuestionNumber(number){
    questionTracker.innerText = number + 1;
}

function checkCompletion(){
    let answered = responses.filter(response => response !== undefined).length;

    if(answered === 10){
        enableSubmit();
    }
}

function enableSubmit(){
    buttonSubmit.style.visibility = "visible";
}

function diseableSubmit(){
    buttonSubmit.style.visibility = "hidden";
}

function showScore(){
    quizzContainer.replaceChildren();
    quizzNavbar.style.display = "none";

    let score = document.createElement("h2");
    score.className = "text-center py-5"


    score.innerText = "Your score is: " + answersCorrect;

    quizzContainer.appendChild(score);

    buttonStartQuizz.style.display = "block";
    
}

quizzContainer.addEventListener("change" , function(event) {
    if(event.target.name.includes("answer")){

        let question = Number(event.target.id.slice(0 , 1));

        let answer = Number(event.target.id.slice(1));

        responses[question] = event.target.value;

        //console.log(responses);
        //console.log(correctAnswers);

        checkCompletion();
    }
});

buttonNext.addEventListener("click" , function() {
    if(questionNumber === 9){
        return;
    }

    quizzContainer.replaceChildren();

    questionNumber++;

    quizzContainer.appendChild(questions[questionNumber]);

    setQuestionNumber(questionNumber);
});

buttonPrevious.addEventListener("click" , function() {
    if(questionNumber === 0){
        return;
    }

    quizzContainer.replaceChildren();

    questionNumber--;

    quizzContainer.appendChild(questions[questionNumber]);

    setQuestionNumber(questionNumber);
});

buttonSubmit.addEventListener("click" , function() {
    answersCorrect = 0;

    for(let i = 0 ; i < 10 ; i++){
        if(correctAnswers[i] === responses[i]){
            answersCorrect++;
        }
    }

    correctAnswerContainer.style.display = "block";
    correctAnswerCount.innerText = answersCorrect;

    showScore();
});