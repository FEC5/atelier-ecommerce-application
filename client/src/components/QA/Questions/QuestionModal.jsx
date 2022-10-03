import React from 'react';
import QModalCSS from './QuestionModal.module.css';
import axiosConfig from '../../../../../axiosConfig.js';

class QuestionModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    // this.handlePhotos = this.handlePhotos.bind(this);
    this.submitQuestion = this.submitQuestion.bind(this);
    this.validateForm = this.validateForm.bind(this);
    const { productId } = this.props;
    this.state = {
      product_id: productId,
      body: '',
      name: '',
      email: '',
    };
  }

  validateForm = () => {
    let isValid = true;
    let warning = 'You must enter the following: ';
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const { body, name, email } = this.state;
    if (body.length < 1) {
      isValid = false;
      warning += 'valid question,';
    }
    if (name.length < 1) {
      isValid = false;
      warning += ' valid name,';
    }
    if (email.length < 1 || regex.test(email) === false) {
      isValid = false;
      warning += ' valid email,';
    }
    warning = warning.slice(0, warning.length - 1);
    if (isValid) {
      this.submitQuestion();
    } else {
      alert(warning);
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // handlePhotos = (e) => {
  //   const { photos } = this.state;
  //   photos.push(e.target.value);
  //   this.setState({
  //     photos,
  //   });
  // };

  submitQuestion = () => {
    const { toggleQModal, getQuestions } = this.props;
    console.log('inside submit Question');
    axiosConfig.post('/qa/questions', this.state)
      .then(() => {
        toggleQModal(false);
        getQuestions();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { toggleQModal, productName } = this.props;
    return (
      <div className={QModalCSS.modalBackground}>
        <div className={QModalCSS.modalContainer}>
          <button
            type="submit"
            className={QModalCSS.exitBtn}
            onClick={() => { toggleQModal(false); }}
          >
            CANCEL
          </button>
          <h2>Ask Your Question</h2>
          <h4>
            {`About the ${productName}`}
          </h4>
          <div className={QModalCSS.body}>
            <div>
              <p>Your Question</p>
              <textarea placeholder="Ask away..." maxLength="1000" rows="4" cols="60" name="body" required onChange={(e) => { this.handleChange(e); }} />
            </div>
            <div>
              <p>What is your nickname?</p>
              <input
                type="type"
                placeholder="Example: jackson11!"
                maxLength="60"
                size="50"
                name="name"
                required
                onChange={(e) => { this.handleChange(e); }}
              />
              <div className={QModalCSS.security}>
                <p>For privacy reasons, do not use your full name or email address.</p>
              </div>
            </div>
            <div>
              <p>Your email</p>
              <input
                type="email"
                placeholder="Example: jackson@email.com"
                name="email"
                maxLength="60"
                size="50"
                required
                onChange={(e) => { this.handleChange(e); }}
              />
              <div className={QModalCSS.security}>
                <p>For authentication reasons, you will not be emailed.</p>
              </div>
            </div>
            <div className={QModalCSS.footer}>
              <button
                type="submit"
                className={QModalCSS.submitBtn}
                onClick={this.validateForm}
              >
                Submit question
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionModal;
