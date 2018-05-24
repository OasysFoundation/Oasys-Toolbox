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

let slides = [];
window.slides = slides
let currentSlide = 0;
let numberOfSlides = 1;

const switchToSlide = function(destination) {
    slides[currentSlide] = window.quill.getContents()
    const previousButton = document.getElementsByName("slide-button")[currentSlide];
    currentSlide = destination;
    window.quill.setContents(slides[destination]);
    const currentButton = document.getElementsByName("slide-button")[destination];
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
	        var json = JSON.parse(xhr.responseText);
	        console.log(json);
	    }
	};
	var data = JSON.stringify(slides);
	xhr.send(data);
}
window.saveContent = saveContent;


document.getElementById('new-slide').addEventListener('click', function(e) {
	numberOfSlides++;
	let newSlideButton = document.createElement('a');
	newSlideButton.setAttribute("class", "item");
	const currentSlideIndex = numberOfSlides-1;
	slides[currentSlideIndex] = {"ops":[{"insert":"This is the beginning of the exiting journey of slide no " + numberOfSlides + "\n"}]}
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
	slides[currentSlideIndex] = {"ops":[{"insert":"This is the beginning of the exiting journey of slide no " + numberOfSlides + "\n"}]}
	newSlideButton.setAttribute("onclick", "switchToSlide("+ currentSlideIndex +")");
	newSlideButton.setAttribute("name", "slide-button");
	newSlideButton.setAttribute("style", "width:100%;");
	newSlideButton.innerHTML = 'Slide ' + numberOfSlides + ' – Quiz <i class="help icon"></i>';
	document.getElementById('insert-new-slide-here').parentNode.insertBefore(newSlideButton, document.getElementById('insert-new-slide-here'));
	switchToSlide(currentSlideIndex);
});

