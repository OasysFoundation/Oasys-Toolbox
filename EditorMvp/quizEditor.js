import "./js/jquery.js"

const QUEST_PLACEHOLDER_EN = 'Question';
const ANSWER_PLACEHOLDER_EN = 'Answer';
const ANSWER_ADD_EN = 'Add answer';
const ANSWER_REMOVE_EN = 'Remove answer';
const FEEDBACK_CORRECT_EN = 'Feedback for correct answer';
const FEEDBACK_INCORRECT_EN = 'Feedback for incorrect answer';

const quizEditor = class {

	constructor(elem){
		this.arrAnswerValues =  [1,	        0];
		this.arrAnswerLabels =  ['correct', 'false'];

		this.content = elem;
		this.content.innerHTML = '';
		this.content.className = 'ten wide stretched column';

		this.content.appendChild(this.createQuestion());

		this.answersDiv = document.createElement('div');
		this.answersDiv.className = 'ui grid';
		this.answersDiv.id = 'quiz-answers';
		this.content.appendChild(this.answersDiv);
		this.answersDiv.appendChild(this.createAnswer());
		this.content.appendChild(this.createFeedback());
	}

	createDOMElement(name, attributes) {
		var elem = document.createElement(name);
		for (var key in attributes) {
			if (key=='textContent') {
				elem.textContent = attributes[key];
			} else {
				elem.setAttribute(key, attributes[key]);
			}
		}
		return elem;
	}

	createUIRow(elems) {
		var row = document.createElement('div');
		row.className = 'row';
		for (var i=0; i<elems.length; i++) {
			row.appendChild(elems[i]);
		}
		return row;
	}

	createUICell(elems) {
		var cell = document.createElement('div');
		cell.className = 'ui action input';
		for (var i=0; i<elems.length; i++) {
			cell.appendChild(elems[i]);
		}
		return cell;
	}

	makeSelect(className, values, labels) {
		var select = document.createElement('select');
		select.className = className;
		for (var i=0; i< values.length; i++) {
			var option = document.createElement("option");
		    option.value = values[i];
		    option.text = labels[i];
		    select.appendChild(option);
		}
		return select;
	}


	createQuestion() {
		var questionDiv = this.createDOMElement('div', {'class': 'question ui grid'});

		var input = this.createDOMElement('textarea', 
			{'id': 'question-text', 'rows': 4, 'cols': 60, 'placeholder': QUEST_PLACEHOLDER_EN}
		);

		var btn = this.createDOMElement('button', 
			{'className': 'ui teal right labeled', 'textContent': ANSWER_ADD_EN}
		);
		btn.addEventListener('click', function(e) {
			this.answersDiv.appendChild(this.createAnswer());
		}.bind(this));

		var row = this.createUIRow([this.createUICell([input]), this.createUICell([btn])]);

		questionDiv.appendChild(row);
		return questionDiv;
	}

	createAnswer() {
		var answerDiv = this.createDOMElement('div', {'class': 'answer ui grid'});

		var input = this.createDOMElement('textarea', 
			{'class': 'answer-text', 'rows': 2, 'cols': 50, 'placeholder': ANSWER_PLACEHOLDER_EN}
		);

		var select = this.makeSelect('answer-value-select', 
							  this.arrAnswerValues, 
							  this.arrAnswerLabels);

		var btn = this.createDOMElement('button', 
			{'className': 'ui teal right labeled', 'textContent': ANSWER_REMOVE_EN}
		);
		btn.addEventListener('click', function(e) {
			btn.parentNode.parentNode.parentNode.remove();
		}.bind(btn));

		var cell = this.createUICell([input, select, btn]);
		var row = this.createUIRow([this.createUICell([input]),this.createUICell([select]),this.createUICell([btn])]);

		answerDiv.appendChild(row);
		return answerDiv;
	}

	createFeedback(){
		var feedbackDiv = this.createDOMElement('div', {'class': 'feedback ui grid'});
		var inputCorrect = this.createDOMElement('textarea', 
			{'id': 'feedback-correct', 'rows': 2, 'cols': 60, 'placeholder': FEEDBACK_CORRECT_EN}
		);
		var inputIncorrect = this.createDOMElement('textarea', 
			{'id': 'feedback-incorrect', 'rows': 2, 'cols': 60, 'placeholder':  FEEDBACK_INCORRECT_EN}
		);

		var row = this.createUIRow([this.createUICell([inputCorrect]), this.createUICell([inputIncorrect])]);

		feedbackDiv.appendChild(row);
		return feedbackDiv;
	}

};


export {quizEditor};