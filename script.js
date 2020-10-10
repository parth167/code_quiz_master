function initQuiz() {
    //  Initialize "time remaining" variable
        var timeRemaining=0;
    //  Clicking the "Start Quiz" button starts the quiz, hides the landing container, and displays the quiz container
        var startButtonEl = document.getElementById("start-button");
        var playButtonEl = document.getElementById("play-button");
        var clearButtonEl= document.getElementById("clear-button");
        var timeRemainingEl = document.getElementById("time-remaining");
        var finalScoreEl = document.getElementById("final-score");
        var numQuestions = questions.length;
        var landingContainerEl = document.getElementById("landing-container");
        var quizContainerEl = document.getElementById("quiz-container");
        var finalContainerEl = document.getElementById("final-container");
        var submitButtonEl = document.getElementById("submit-initials");
        var highscoreButtonEl = document.getElementById("highscore-button");
        var highscoreContainerEl = document.getElementById("highscore-container");
        var highScores = [];

        
            //  Method to store and retrieve arrays in/from local storage 
        if (JSON.parse(localStorage.getItem('scores')) !== null) {
            highScores = JSON.parse(localStorage.getItem("scores"));
        }
    
        function startQuiz() {
            landingContainerEl.setAttribute("class","container d-none");
            highscoreContainerEl.setAttribute("class","container d-none");
            var rowEl = null;
            var colEl = null;
            var headerEl = null;
            var buttonEl = null;
            quizContainerEl.setAttribute("class","container");
            var currentQuestion = 1;
            var score = 0;
    //  Upon starting the quiz, the time remaining variable is assigned a value equal to 15 seconds * the number of questions and starts decreasing by 1 each second
            timeRemaining=numQuestions * 15;
            timeRemainingEl.setAttribute("value",timeRemaining);
            //  Method for stopping the interval once it has started obtained from https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals
            var myInterval = setInterval(function() {
                if (timeRemaining<1) {
                    clearInterval(myInterval);
                    //  When the final question is answered or the timer reaches zero, the quiz container is hidden and the score container is displayed, where the user enters their initials
                    quizContainerEl.setAttribute("class","container d-none");
                    finalContainerEl.setAttribute("class","container");
                    return;
                }
                timeRemaining = timeRemaining - 1;
                timeRemainingEl.setAttribute("value",timeRemaining);
            },1000);
            var clickTimeout = false;
            // this function start question answer
            function generateQuestion(questionNum) {
                //  During the quiz, the header has the current question, and the answer buttons have the possible answers for that question
                quizContainerEl.innerHTML = "";
                rowEl = document.createElement("div");
                rowEl.setAttribute("class","row mt-5");
                quizContainerEl.append(rowEl);

                colEl = document.createElement("div");
                colEl.setAttribute("class","col-0 col-sm-2");
                rowEl.append(colEl);

                colEl = document.createElement("div");
                colEl.setAttribute("class","col-12 col-sm-8");
                rowEl.append(colEl);

                colEl = document.createElement("div");
                colEl.setAttribute("class","col-0 col-sm-2");
                rowEl.append(colEl);

                colEl = rowEl.children[1];
                rowEl = document.createElement("div");
                rowEl.setAttribute("class","row mb-3 mt-2");
                colEl.append(rowEl);

                colEl = document.createElement("div");
                colEl.setAttribute("class","col-12");
                rowEl.append(colEl);
            // question start 
                headerEl = document.createElement("h2");
                headerEl.innerHTML = questions[questionNum-1].title;
                colEl.append(headerEl);
            // answer 4 option
                colEl = quizContainerEl.children[0].children[1];
                for (var i=0; i<4; i++) {
                    var rowEl = document.createElement("div");
                    rowEl.setAttribute("class","row mb-1");
                    colEl.append(rowEl);
            // button creat for user can select answer and run function to check answer is right or wrong
                    var colEl2 = document.createElement("div");
                    colEl2.setAttribute("class","col-12");
                    rowEl.append(colEl2);

                    buttonEl = document.createElement("button");
                    buttonEl.setAttribute("class","btn btn-primary btn-block");
                    buttonEl.setAttribute("type","button");
                    buttonEl.innerHTML = questions[currentQuestion-1].choices[i];
                    colEl2.append(buttonEl);
                    buttonEl.addEventListener("click",function(){
                        // if it is the correct answer, the message "Correct" is displayed, and if not, the message "Incorrect" is displayed and 15 seconds deducted from the timer
                        if (clickTimeout) {
                            return;
                        }
                        clickTimeout = true;
                        clearInterval(myInterval);
                        var colEl = quizContainerEl.children[0].children[1];
                        var rowEl = document.createElement("div");
                        rowEl.setAttribute("class","row border-top");
                        colEl.append(rowEl);

                        colEl = document.createElement("div");
                        colEl.setAttribute("class","col-12");
                        rowEl.append(colEl);

                        var parEl = document.createElement("p");
                        colEl.append(parEl);
                        // answer is correct take it to the next question 
                        // answer is wrong it penalised user 15 sec
                        if (this.innerHTML === questions[currentQuestion - 1].answer) {
                            parEl.innerHTML = "Correct!";
                        } else {
                            parEl.innerHTML = "Incorrect";
                            timeRemaining = timeRemaining - 15;
                            if (timeRemaining < 0) {
                                timeRemaining = 0;
                            }
                            timeRemainingEl.setAttribute("value",timeRemaining);
                        }
                        // take to the next question
                        currentQuestion++;
                        if (currentQuestion>questions.length) {
                            score = timeRemaining;
                        }
                        setTimeout(function() {
                            // When an answer is chosen, pause the timer and show the result for 1 seconds before loading the next question
                            // when user answer the  last question its go into if stetment ant take it to the result page 
                           
                            if (currentQuestion>questions.length) {
                                // Move to the results page
                                quizContainerEl.setAttribute("class","container d-none");
                                finalContainerEl.setAttribute("class","container");
                                finalScoreEl.setAttribute("value",score);
                            } else {
                                generateQuestion(currentQuestion);
                                clickTimeout = false;
                                myInterval = setInterval(function() {
                                    if (timeRemaining<1) {
                                        clearInterval(myInterval);
                                        quizContainerEl.setAttribute("class","container d-none");
                                        finalContainerEl.setAttribute("class","container");
                                        return;
                                    }
                                    timeRemaining = timeRemaining - 1;
                                    timeRemainingEl.setAttribute("value",timeRemaining);
                                },1000);
                            }
                        },1000);
                    });
                }
                

            }
            // by savehighscore function save the score and store data to local storage user can see the high score
            function saveHighScore() {
                var initialsEl = document.getElementById("initials-entry");
                var newHighScore = {
                    initials: initialsEl.value,
                    highScore: score
                };
                console.log(newHighScore);
                highScores.push(newHighScore);
                console.log(highScores);
                localStorage.setItem("scores",JSON.stringify(highScores));
            }
            submitButtonEl.addEventListener("click",saveHighScore);
            
            generateQuestion(currentQuestion);
        }
        // start button start quiz 
        startButtonEl.addEventListener("click",startQuiz);
        playButtonEl.addEventListener("click",startQuiz);
       
        // highscoreButton take to the highscore page and user can add/see the score
        highscoreButtonEl.addEventListener("click",function() {
            landingContainerEl.setAttribute("class","container d-none");
            quizContainerEl.setAttribute("class","container d-none");
            finalContainerEl.setAttribute("class","container d-none");
            highscoreContainerEl.setAttribute("class","container");
            var colEl = document.getElementById("highscore-table");
            for (i=0; i<highScores.length; i++) {
                var rowEl = document.createElement("div");
                rowEl.setAttribute("class","row mb-1");
                colEl.append(rowEl);

                var colEl2 = document.createElement("div");
                colEl2.setAttribute("class","col-12 text-center");
                rowEl.append(colEl2);

                var parEl = document.createElement("div");
                parEl.innerHTML = "Initials: " + highScores[i].initials + "   Score: " + highScores[i].highScore;
                colEl2.append(parEl);
            }
           
        });
        clearButtonEl.addEventListener("click",clearScore);
        function clearScore() {
            localStorage.removeItem('scores');
        }
    }
    
initQuiz();