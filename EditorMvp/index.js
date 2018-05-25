import SVG from "svg.js"
import Plot from "./plot.js"
import katex from "katex"
import {symbolizer, latexFromString} from "./symbolizer.js"
import {Graph, Node, drawGraph} from "./TreeVis.js"
import "./js/slickQuiz.js"
import './style/katex.css'
import './style/monokai-sublime.min.css'
import './style/quill.snow.css'
import './style/style.css'
import {initQuill} from './editor.js'
//import {initQuiz} from './quizzer.js'
import {quizEditor} from './quizEditor.js'


initQuill();
//initQuiz();

let slides = [{"slidetype": "quill", "content":{}}];
window.slides = slides
let currentSlideIndex = 0;
let numberOfSlides = 1;

const switchToSlide = function(destinationIndex) {
	if (slides[currentSlideIndex].slidetype == "quiz") {
    	slides[currentSlideIndex].content = document.getElementById('quiz-editor').cloneNode(true);
	} else if (slides[currentSlideIndex].slidetype == "quill") {
    	slides[currentSlideIndex].content = window.quill.getContents();
	}
    const previousButton = document.getElementsByName("slide-button")[currentSlideIndex];
    currentSlideIndex = destinationIndex;
    const currentSlideContent = slides[currentSlideIndex];

    if (currentSlideContent.slidetype == "quiz") {
    	document.getElementById('quiz').setAttribute("style", "");
    	if (Object.keys(currentSlideContent.content) == 0 && // check if object empty
    		currentSlideContent.content.constructor == Object){
    		const editor = new quizEditor(document.getElementById('quiz-editor'));
    	} else {
    		var editor = document.getElementById('quiz-editor');
    		editor = currentSlideContent.content;
    	}
    	document.getElementById('editor').setAttribute("style", "display: none;");
    } else if (currentSlideContent.slidetype == "quill") {
    	document.getElementById('quiz').setAttribute("style", "display: none;");
    	document.getElementById('editor').setAttribute("style", "");
    	window.quill.setContents(currentSlideContent.content);
    }
    
    const currentButton = document.getElementsByName("slide-button")[currentSlideIndex];
    if (previousButton != null) {
    	previousButton.setAttribute("class", "item");	
    }
    currentButton.setAttribute("class", "item active");
}
window.switchToSlide = switchToSlide;

const saveContent = function() {
	var xhr = new XMLHttpRequest();
	var url = "http://api.joinoasys.org/saveEditor";
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	        console.log(xhr.responseText);
	    }
	};
	xhr.send(JSON.stringify({"slides": slides}));
}
window.saveContent = saveContent;


const loadContent = function() {
	var xhr = new XMLHttpRequest();
	var url = "http://api.joinoasys.org/loadEditor";
	xhr.open("GET", url, true);

	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("id", "5b0825a38a745375be810999");
	xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	        var json = JSON.parse(xhr.responseText);
	        console.log(json);
	    }
	};
	xhr.send();
}
window.loadContent = loadContent;

document.getElementById('new-slide').addEventListener('click', function(e) {
	numberOfSlides++;
	let newSlideButton = document.createElement('a');
	newSlideButton.setAttribute("class", "item");
	const currentSlideIndex = numberOfSlides-1;
	slides[currentSlideIndex] = {
									"slidetype": "quill",
									"content": {"ops":[{"insert":"This is the beginning of the exiting journey of slide no " + numberOfSlides + "\n"}]}
								}
	newSlideButton.setAttribute("onclick", "switchToSlide("+ currentSlideIndex +")");
	newSlideButton.setAttribute("name", "slide-button");
	newSlideButton.setAttribute("style", "width:100%;");
	newSlideButton.innerHTML = 'Slide ' + numberOfSlides + '<i class="paragraph icon"></i>';
	document.getElementById('insert-new-slide-here').parentNode.insertBefore(newSlideButton, document.getElementById('insert-new-slide-here'));
	switchToSlide(currentSlideIndex);
});

document.getElementById('new-quiz-slide').addEventListener('click', function(e) {
	numberOfSlides++;
	let newSlideButton = document.createElement('a');
	newSlideButton.setAttribute("class", "item");
	const currentSlideIndex = numberOfSlides-1;
	slides[currentSlideIndex] = {
									"slidetype": "quiz",
									"content": {}
								}
	newSlideButton.setAttribute("onclick", "switchToSlide("+ currentSlideIndex +")");
	newSlideButton.setAttribute("name", "slide-button");
	newSlideButton.setAttribute("style", "width:100%;");
	newSlideButton.innerHTML = 'Slide ' + numberOfSlides + ' – Quiz <i class="help icon"></i>';
	document.getElementById('insert-new-slide-here').parentNode.insertBefore(newSlideButton, document.getElementById('insert-new-slide-here'));
	switchToSlide(currentSlideIndex);
});

document.getElementById('quiz-navi-editor').addEventListener('click', function(e) {
	document.getElementById('quiz-editor').setAttribute("style", "");
	document.getElementById('quiz-preview').setAttribute("style", "display: none;");
});

document.getElementById('quiz-navi-preview').addEventListener('click', function(e) {
	document.getElementById('quiz-editor').setAttribute("style", "display: none;");
	document.getElementById('quiz-preview').setAttribute("style", "");

	var question = document.getElementById('question-text').text;
	var correct = document.getElementById('feedback-correct').text;
	var incorrect = document.getElementById('feedback-incorrect').text;

	var answers = [];

	var answerDivs = document.getElementById('quiz-answers');
	var answerElems = answerDivs.getElementsByClassName('answer-text');
	var correctElems = answerDivs.getElementsByClassName('answer-value-select');

	for (var i=0; i<answerElems.length; i++) {
		var option = answerElems[i].textContent;
		console.log(correctElems[i]);
		var correct = correctElems[i].value;
		var answer = {"option": option,    "correct": correct};
		answers.push(answer);
	}

	const quizJSON = {
            "info": {
                "name":    "Quiz-Slide",
                "main":    ""
            },
            "questions": [{ 
                    "q": question,
                    "a": answers,
                    "correct": correct,
                    "incorrect": incorrect 
                }
            ]
        };

    $('#quiz-preview').slickQuiz({
        skipStartButton: true,
        json: quizJSON
    });
});