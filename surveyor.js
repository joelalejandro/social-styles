        var options = {
            neutral: 0.5,
            negative: 0,
            positive: 1,
        };
        var ui = {
            begin: document.querySelector('[data-js="begin"]'),
            header: document.querySelector('#header'),
            survey: document.querySelector('#survey'),
            answers: document.querySelectorAll('[data-js="answer"]'),
            progress: document.querySelector('progress.survey'),
            results: document.querySelector('#results'),
            templates: {
                question: document.querySelector('[data-template="question"]'),
            },
        };
        var questionIndex = 0;
        
        function renderQuestion() {
            var questionElement = ui.templates.question.cloneNode(true);
            var questionUi = {
                text: questionElement.querySelector('[data-js="question"]'),
            };
            questionUi.text.innerHTML = questions[questionIndex].text;
            ui.survey.innerHTML = questionElement.innerHTML;
        }
        
        function nextQuestion(e) {
            if (e.target && e.target.dataset.js === 'answer' || e.target.parentNode.dataset.js === 'answer') {
                var value = options[e.target.dataset.value || e.target.parentNode.dataset.value];
                questions[questionIndex].value = value;
                
                if (questions[questionIndex + 1]) {
                    questionIndex += 1;
                    ui.progress.value = questionIndex;
                    renderQuestion();
                } else {
                    showResults();
                }
            }
        }
        
        function showResults() {
            ui.survey.style.display = 'none';
            ui.progress.style.display = 'none';
            
            var results = _.mapObject(
                _.groupBy(questions, 'style'), 
                function (question) {
                    return question.map(function (data) {
                        return data.value;
                    }).reduce(function (leftNumber, rightNumber) {
                        return leftNumber + rightNumber;
                    }, 0);
                }
            );

            _.each(results, function (value, key) {
                document.querySelector('progress[data-type="' + key + '"]').value = value;
            });

            ui.results.style.display = 'block';
        }
        
        function beginSurvey() {
            ui.header.style.display = 'none';
            ui.survey.style.display = 'block';
            ui.progress.max = questions.length - 1;
            renderQuestion();
        }
        
        ui.begin.addEventListener('click', beginSurvey);
        ui.survey.addEventListener('click', nextQuestion);        