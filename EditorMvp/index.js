import SVG from "svg.js"
import Plot from "./plot.js"
import katex from "katex"
import {symbolizer, latexFromString} from "./symbolizer.js"
import {Graph, Node, drawGraph} from "./TreeVis.js"
import './style/katex.css'
import './style/monokai-sublime.min.css'
import './style/quill.snow.css'
import './style/style.css'
import {initQuill} from './editor.js'
import {initQuiz} from './quizzer.js'




initQuill();
initQuiz();

let slides = [{"slidetype": "quill", "content":{}}];
window.slides = slides
let currentSlideIndex = 0;
let numberOfSlides = 1;

const switchToSlide = function(destinationIndex) {
    slides[currentSlideIndex].content = window.quill.getContents()
    const previousButton = document.getElementsByName("slide-button")[currentSlideIndex];
    currentSlideIndex = destinationIndex;
    const currentSlideContent = slides[currentSlideIndex]
    console.log(currentSlideContent);
    if (currentSlideContent.slidetype == "quiz") {
    	document.getElementById('slickQuiz').setAttribute("style", "");
    	document.getElementById('editor').setAttribute("style", "display: none;");
    } else if (currentSlideContent.slidetype == "quill") {
    	document.getElementById('slickQuiz').setAttribute("style", "display: none;");
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

