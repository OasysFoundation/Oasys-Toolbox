import Quill from "quill"
import katex from "katex"
import './style/katex.css'
import d3 from "d3"
import Sortable from "sortablejs"

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

let BlockEmbed = Quill.import('blots/block/embed');
let Embed = Quill.import('blots/embed');

class GraphBlot extends Embed {
  static create(initialValue) {
    const node = super.create();
	node.setAttribute("spellcheck", false);
	console.log(initialValue);


	window.d3 = require('d3')
	const functionPlot = require('function-plot')
	const plot = functionPlot({
	  target: node,
	  disableZoom: true,
	  data: [{
	    fn: initialValue.equation
	  }]
	})
	node.equation = initialValue.equation;
    return node;
  }
  
  static value(node) {
    return {
      equation: node.equation
    };
  }
}

GraphBlot.blotName = 'graph';
GraphBlot.tagName = 'div';
GraphBlot.className = 'graph';

Quill.register(GraphBlot);

document.getElementById('graph-button').addEventListener('click', function(e) {
	var equation=prompt("Enter equation","x^3");
    if (equation != null) {
		let range = quill.getSelection(true);
		quill.insertEmbed(range.index + 1, 'graph', {equation: equation}, Quill.sources.USER);
   }
});



// initialize editor
const initQuill = function () {
	Quill.register('modules/counter', counter);

	var quill = new Quill('#quilljs-container', {
	modules: {
	  formula: true,
	  toolbar: "#toolbar-container",
	  
	  counter: {
	  	container: '#counter',
		unit: 'word'
	  },
	},
	placeholder: 'Start your educational kick-ass journey…',
	theme: 'snow'
	});
	window.quill = quill;

	
	const ImageBlot = Quill.import('formats/image');
	const Parchment = Quill.import('parchment');

	window.quill.root.addEventListener('click', (ev) => {
	  let selectedBlob = Parchment.find(ev.target);


	  if (selectedBlob instanceof ImageBlot) {
	    window.quill.setSelection(selectedBlob.offset(window.quill.scroll), 1, 'user');
	  }

	  if (selectedBlob instanceof GraphBlot) {
	    window.quill.setSelection(selectedBlob.offset(window.quill.scroll), 1, 'user');
	  }

	});
}


export {initQuill};