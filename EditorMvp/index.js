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




initQuill();

let slides = [];
let currentSlide = 0;
let numberOfSlides = 1;

const switchToSlide = function(destination) {
    slides[currentSlide] = window.quill.getContents()
    currentSlide = destination;
    window.quill.setContents(slides[destination]);
}
window.switchToSlide = switchToSlide;


document.getElementById('new-slide').addEventListener('click', function(e) {
	numberOfSlides++;
	let newSlideButton = document.createElement('button');
	const currentSlideIndex = numberOfSlides-1;
	newSlideButton.setAttribute("onclick", "switchToSlide("+ currentSlideIndex +")");
	newSlideButton.innerHTML = 'Slide ' + numberOfSlides;
	document.getElementById('new-slide').parentNode.insertBefore(newSlideButton, document.getElementById('new-slide'));
});


export {switchToSlide};