import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

const STR_QUIZ_QUESTIONFIELD_EN = 'Formulate a question';
const STR_QUIZ_ANSWERFIELD_EN = 'Formulate an answer';
const STR_QUIZ_HEADER_EN = 'Quiz editor';
const STR_QUIZ_INTRO_EN = 'This is a short description of the quiz editor';
const STR_QUIZ_ANSWERCORRECT_EN = 'correct';
const STR_QUIZ_ANSWERWRONG_EN = 'wrong';
const STR_EDIT_EN = 'edit';
const STR_PREVIEW_EN = 'preview';

const paperElevation = 4;

const compStyles = theme => ({
  button: {
  },
  buttonPreview: {
  },
  dragHandle: {
  },
});

let domStyles = {
    answerField: {
      paddingTop: 3,
      paddingBottom: 3,
      resize: 'none',
      width: 500,
      height: 30,
      margin: 5,
    },
    answerList: {
      marginTop: 10,
    },
    questionField: {
      resize: 'none',
      width: 500,
      height: 50,
      margin: 5,
    },
    answerWrap: {
      display: 'flex',
      flexDirection: 'row', 
      alignItems: 'center',
    },
    wrapper: {
    },
    questionPreview: {
      fontWeight: 'strong',
    },
    answerListPreview: {
      listStyleType: 'none',
    },
    answerPreview: {
    },
}

class Question extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <textarea style={domStyles.questionField} defaultValue={this.props.value} />
    )
  }

  handleChange(event) {
    this.props.funHandleChangeQuestion(event.target.value);
  }
}

const DragHandle = SortableHandle(() => <DragHandleIcon className={compStyles.dragHandle} />);

class Answer extends Component {

  constructor(props) {
    super(props);
    this.handleSelfDestruct = this.handleSelfDestruct.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCorrect = this.handleChangeCorrect.bind(this);
  }

  render() {
    return (
      <div style={domStyles.answerField}>
        <Paper elevation={paperElevation}> 
          <div style={domStyles.answerWrap}>
            <DragHandle />
            <textarea style={domStyles.answerField} 
                      onChange={this.handleChange} 
                      value={this.props.value.desc} />
            <select onChange={this.handleChangeCorrect} value={this.props.value.correct ? "1" : "0"}>
              <option value="1">{STR_QUIZ_ANSWERCORRECT_EN}</option>
              <option value="0">{STR_QUIZ_ANSWERWRONG_EN}</option>
            </select>
            <DeleteIcon onClick={this.handleSelfDestruct}  />
          </div>
        </Paper>
      </div>
      )
  }

  handleSelfDestruct(){
    // call Answerlist.handleRemoveAnswer
    this.props.funHandleDestroyAnswer(this.props.index);
  }

  handleChange(event) {
    // call Answerlist.handleChangeAnswer
    this.props.funHandleChangeAnswer(this.props.index, event.target.value);
  }

  handleChangeCorrect(event) {
    // call Answerlist.handleChangeAnswerCorrect
    this.props.funHandleChangeAnswerCorrect(this.props.index, event.target.value);
  }

}

// this wraps Answer with SortableElement. As a result, 
// SortableAnswer is a sortable Answer component.
// the prop index gets silently consumed by sortableelement; easiest workaround
// is probably to define another prop called indexCopy
const SortableAnswer = SortableElement(
  (props => <Answer index={props.indexCopy} 
                   value={props.value} 
                   funHandleDestroyAnswer={props.funHandleDestroyAnswer} 
                   funHandleChangeAnswer={props.funHandleChangeAnswer}
                   funHandleChangeAnswerCorrect={props.funHandleChangeAnswerCorrect} />)
);

const SortableAnswerList = SortableContainer(props =>
  <div>
    {props.items.map((value, index) => 
      <SortableAnswer key={`item-${index}`} 
                      index={index} 
                      indexCopy={index} 
                      value={value} 
                      funHandleDestroyAnswer={props.funHandleDestroyAnswer}
                      funHandleChangeAnswer={props.funHandleChangeAnswer}
                      funHandleChangeAnswerCorrect={props.funHandleChangeAnswerCorrect} />
    )}
  </div>  
);

class Quiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      question: STR_QUIZ_QUESTIONFIELD_EN,
      answerList: [{'desc': STR_QUIZ_ANSWERFIELD_EN, 'correct': true}],
    }
    this.handleRemoveAnswer = this.handleRemoveAnswer.bind(this);
    this.handleChangeAnswer = this.handleChangeAnswer.bind(this);
    this.handleChangeAnswerCorrect = this.handleChangeAnswerCorrect.bind(this);
    this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
  }

  handleChangeQuestion(index, desc) {
    this.setState({question: desc});
  }

  handleAddAnswer() {
    let answerListTemp = this.state.answerList.slice();
    answerListTemp = answerListTemp.concat({'desc': STR_QUIZ_ANSWERFIELD_EN, 'correct': true})
    this.setState({
      answerList: answerListTemp,
    });
  }

  handleChangeAnswer(index, desc) {
    let answerListTemp = this.state.answerList.slice();
    answerListTemp[index].desc = desc;
    this.setState({answerList: answerListTemp});
  }

  handleChangeAnswerCorrect(index, correct) {
    let answerListTemp = this.state.answerList.slice();
    if (correct === "1") {
      answerListTemp[index].correct = true;
    } else {
      answerListTemp[index].correct = false;
    }
    this.setState({answerList: answerListTemp});
  }

  handleRemoveAnswer(index) {
    let answerListTemp = this.state.answerList.slice();
    answerListTemp.splice(index, 1);
    this.setState({answerList: answerListTemp})
  }

  handlePreview() {
    this.setState({
      preview: !this.state.preview,
    });
  }

  onSortEnd = (props) => {
    const {answerList} = this.state;
    this.setState({
      answerList: arrayMove(answerList, props.oldIndex, props.newIndex),
    });
  };

  render() {
      return (
        <div style={domStyles.wrapper}>
          <div style={{textAlign: 'right'}}>
            <Button variant="raised" color="secondary" 
                  className={compStyles.buttonPreview} 
                  onClick={this.handlePreview.bind(this)}>
               {this.state.preview ? STR_EDIT_EN : STR_PREVIEW_EN}
            </Button>
          </div>
          {this.state.preview ? ( // ternary beginning
            <div>
              <p style={domStyles.questionPreview}>{this.state.question}</p>
              <ul style={domStyles.answerListPreview}>
                {this.state.answerList.map((a) => <li style={domStyles.answerPreview}> {a.desc} </li>)}
              </ul>
            </div>
          ) : ( // ternary middle
            <div>
              <Typography variant="headline" component="h3">
                  {STR_QUIZ_HEADER_EN}
              </Typography>
              <Typography component="p">
                  {STR_QUIZ_INTRO_EN}
              </Typography>

              <Question value={this.state.question} 
                        funHandleChangeQuestion={this.handleChangeQuestion}/>

              <div style={domStyles.answerList}>
                <Button variant="raised" color="primary" aria-label="add" 
                      className={compStyles.button} 
                      onClick={this.handleAddAnswer.bind(this)}>
                   Add answer
                  <AddIcon />
                </Button>
                <SortableAnswerList items={this.state.answerList} 
                              onSortEnd={this.onSortEnd} 
                              useDragHandle={true} 
                              funHandleDestroyAnswer={this.handleRemoveAnswer}
                              funHandleChangeAnswer={this.handleChangeAnswer}
                              funHandleChangeAnswerCorrect={this.handleChangeAnswerCorrect}
                />
              </div>
            </div> // ternary end
          ) } 
      </div>

        
      )
  }
}

export default Quiz
