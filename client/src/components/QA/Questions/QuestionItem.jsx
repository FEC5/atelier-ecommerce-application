import React from 'react';
import QItemCSS from './QuestionItem.module.css';
import AnswerList from './Answers/AnswerList.jsx';
import axiosConfig from '../../../../../axiosConfig.js';
import AnswerModal from './AnswerModal.jsx';

class QuestionItem extends React.Component {
  constructor(props) {
    super(props);
    this.getAnswers = this.getAnswers.bind(this);
    this.getMoreAnswers = this.getMoreAnswers.bind(this);
    this.addQYes = this.addQYes.bind(this);
    this.state = {
      results: [],
      display: [],
      count: 2,
      yesCount: 0,
      showAModal: false,
    };
  }

  componentDidMount() {
    this.getAnswers();
  }

  sortAnswers = (data) => {
    const sorted = data.reduce((acc, element) => {
      if (element.author === 'Seller') {
        return [element, ...acc];
      }
      return [...acc, element];
    }, []);
    return sorted;
  };

  getAnswers = () => {
    const { question } = this.props;
    const { question_id } = question;
    const { count } = this.state;
    axiosConfig.get(`qa/questions/${question_id}/answers?page=1&count=1000`)
      .then((response) => {
        const newData = this.sortAnswers(response.data.results);
        this.setState({
          results: newData,
          display: newData.slice(0, count),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getMoreAnswers = () => {
    let { count } = this.state;
    const { results } = this.state;
    count += 2;
    this.setState({
      display: results.slice(0, count),
      count,
    });
  };

  addQYes = () => {
    const { question } = this.props;
    const { question_id } = question;
    const { yesCount } = this.state;
    if (yesCount < 1) {
      axiosConfig.put(`/qa/questions/${question_id}/helpful`)
        .then(() => {
          this.setState({
            yesCount: yesCount + 1,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    let answerDisplay;
    const {
      results, showAModal, yesCount, display,
    } = this.state;
    const { question, productName } = this.props;
    const { question_body, question_helpfulness } = question;
    if (display.length !== 0) {
      answerDisplay = (
        <AnswerList
          answers={display}
          compare={results}
          getMoreAnswers={this.getMoreAnswers}
          getAnswers={this.getAnswers}
        />
      );
    } else {
      answerDisplay = <button type="submit" className={QItemCSS.answerQBtn} onClick={() => { this.setState({ showAModal: true }); }}> Answer this question </button>;
    }
    return (
      <div className={QItemCSS.questionEach}>
        <div className={QItemCSS.container}>
          <div className={QItemCSS.qbody} style={{ fontWeight: 'bold' }}>
            Q:
            { question_body }
          </div>
          <div className={QItemCSS.interactions}>
            <span className={QItemCSS.helpful}>
              Helpful?
              <button
                type="submit"
                className={QItemCSS.yesHelpful}
                onClick={() => { this.addQYes(); }}
              >
                Yes
              </button>
            </span>
            <span>
              {`(${question_helpfulness + yesCount})`}
            </span>
            |
            <span>
              <button className={QItemCSS.addAnswerBtn} type="submit" onClick={() => { this.setState({ showAModal: true }); }}>Add Answer</button>
            </span>
          </div>
        </div>

        <div>
          { showAModal && (
          <AnswerModal
            question={question}
            productName={productName}
            hideModal={() => { this.setState({ showAModal: false }); }}
            getAnswers={this.getAnswers}
            getMoreAnswers={this.getMoreAnswers}
          />
          )}
        </div>

        { answerDisplay }
      </div>
    );
  }
}

export default QuestionItem;
