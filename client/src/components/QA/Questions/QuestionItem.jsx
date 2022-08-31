import React from 'react';
import QItemCSS from './QuestionItem.module.css';
import AnswerList from './Answers/AnswerList.jsx';
import axiosConfig from '../../../../../axiosConfig.js';
import AnswerModal from './AnswerModal.jsx';

class QuestionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      count: 2,
    };
  }

  componentDidMount() {
    const { question } = this.props;
    const { question_id } = question;
    const { count } = this.state;
    axiosConfig.get(`qa/questions/${question_id}/answers?page=1&count=${count}`)
      .then((response) => {
        this.setState({
          showAModal: false,
          results: response.data.results,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    let answerDisplay;
    const { showAModal } = this.state;
    const { question } = this.props;
    const { question_body } = question;
    const { results } = this.state;
    if (results.length !== 0) {
      answerDisplay = <AnswerList answers={results} />;
    } else {
      answerDisplay = <button type="submit" onClick={() => {}}> Answer this question </button>;
    }
    return (
      <div className={QItemCSS.questionEach}>
        <span>
          <span style={{ fontWeight: 'bold' }}>
            Q:
            { question_body }
          </span>
          <span>
            Helpful?
            <span>
              Yes
            </span>
            <span>
              {`(${question.question_helpfulness})`}
            </span>
            |
            <span>
              <button type="submit" onClick={() => { this.setState({ showAModal: true }); }}>Add Answer</button>
            </span>
            { showAModal && (
            <AnswerModal hideModal={() => { this.setState({ showAModal: false }); }} />
            )}
          </span>
        </span>
        { answerDisplay }
      </div>
    );
  }
}

export default QuestionItem;
