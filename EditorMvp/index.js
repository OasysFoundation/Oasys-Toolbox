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

const reloadForSlideData = function(newSlides) {
	slides = newSlides;
	resetEditor();
	slides.forEach(function(slide) {
		console.log(slide);
		addNewSlide(slide.slidetype, slide.content, false);
	})
}

const resetEditor = function() {
	currentSlideIndex = 0;
	numberOfSlides = 0;
	var nodes = document.getElementsByName("slide-button");
	nodes.forEach(function(node) {
		node.parentNode.removeChild(node);
	})
}

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

	const contentId = document.getElementById("load-content-id").value;
	console.log(contentId);

	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("id", contentId);
	xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	        var json = JSON.parse(xhr.responseText);
	        reloadForSlideData(json.slides);
	    }
	};
	xhr.send();
}
window.loadContent = loadContent;


document.getElementById('new-slide').addEventListener('click', function(e) {
	const content = {"ops":[{"insert":"This is the beginning of the exiting journey of slide no " + numberOfSlides + "\n"}]};
	addNewSlide("quill", content, true);
});


document.getElementById('new-quiz-slide').addEventListener('click', function(e) {
	addNewSlide("quiz", {}, true);
});

const addNewSlide = function(slideType, slideContent, switchToNewSlide) {
	numberOfSlides++;
	let newSlideThumbnail = document.createElement('a');
	newSlideThumbnail.setAttribute("class", "item");
	const currentSlideIndex = numberOfSlides-1;
	slides[currentSlideIndex] = {
									"slidetype": slideType,
									"content": slideContent
								};
    newSlideThumbnail.setAttribute("onclick", "switchToSlide("+ currentSlideIndex +")");
    newSlideThumbnail.setAttribute("name", "slide-button");
	newSlideThumbnail.setAttribute("style", "width:100%;");
	if (slideType == "quiz") {
		newSlideThumbnail.innerHTML = 'Slide ' + numberOfSlides + ' – Quiz <i class="help icon"></i>';
	} else {
		newSlideThumbnail.innerHTML = 'Slide ' + numberOfSlides + '<i class="paragraph icon"></i>';
	}
	
	document.getElementById('insert-new-slide-here').parentNode.insertBefore(newSlideThumbnail, document.getElementById('insert-new-slide-here'));
	if (switchToNewSlide) {
		switchToSlide(currentSlideIndex);
	}
}

