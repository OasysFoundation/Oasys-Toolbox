import Quill from "quill"
import katex from "katex"
import d3 from "d3"

  // define custom module 
  const counter = class {
	constructor(quill, options) {
		this.quill = quill;
		this.options = options;
		this.container = document.querySelector(options.container);
		quill.on('text-change', this.update.bind(this));
		this.update();  // Account for initial contents
	}

	calculate() {
		let text = this.quill.getText();
		if (this.options.unit === 'word') {
			text = text.trim();
			// Splitting empty text returns a non-empty array
			return text.length > 0 ? text.split(/\s+/).length : 0;
		} else {
			return text.length;
		}
	}

	update() {
		console.log('updating counter')
		var length = this.calculate();
		var label = this.options.unit;
		if (length !== 1) {
			label += 's';
		}
		this.container.innerText = length + ' ' + label;
	}
}

/* // register custom module
let Block = Quill.import('blots/block');
class BlockquoteBlot extends Block { }
BlockquoteBlot.blotName = 'blockquote';
BlockquoteBlot.tagName = 'blockquote';
Quill.register(BlockquoteBlot);
// --> we can now do stuff like quill.formatText(0, 4, 'bold', true);
*/

// ------------------------------------------------------------------------
// custom handler for the toolbar button
// utility function used to inherit non prototypical methods/properties
/*
function extend(target, base) {
  for (var prop in base) {
    target[prop] = base[prop];
  }
}

// definition of a custom Blot
(function(Embed) {
  'use strict';

  function Span() {
    Object.getPrototypeOf(Embed).apply(this, arguments);
  }

  Span.prototype = Object.create(Embed && Embed.prototype);
  Span.prototype.constructor = Span;
  extend(Span, Embed);

  Span.create = function create(value) {
    return value; // expects a domNode as value
  };

  Span.value = function value(domNode) {
    return domNode;
  };

  Span.blotName = 'span';
  Span.tagName = 'SPAN';
  Span.className = 'complex';

  Quill.register(Span, true);
})(Quill.import('blots/embed')); // import the embed blot. This is important as this is being extended

var myHandler = function() {
  var complexSpan = document.getElementById('complextype').firstElementChild.cloneNode(true);
  var selection = quill.getSelection();

  quill.insertEmbed(selection.index, 'span', complexSpan);
}
*/

// initialize editor
const initQuill = function () {
	Quill.register('modules/counter', counter);

	var quill = new Quill('#editor-container', {
	modules: {
	  formula: false, // latex formulas
	  syntax: false, // code syntax highlighting
	  counter: {
	  	container: '#counter',
		unit: 'word'
	  },
	  toolbar: '#toolbar-container'
	},
	placeholder: 'Compose an epic...',
	theme: 'snow'
	});
	window.quill = quill;

	/*
	document.getElementById('blockquote-button').addEventListener('click', function(e) {
	    quill.format('blockquote', true);
	});
	*/
}

window.d3 = require('d3')
  const functionPlot = require('function-plot')
  functionPlot({
	  target: '#quadratic',
	  data: [{
	    fn: 'x^2'
	  }]
  })


export {initQuill};