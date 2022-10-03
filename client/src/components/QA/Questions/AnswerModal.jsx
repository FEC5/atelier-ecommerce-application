import React from 'react';
import axios from 'axios';
import AModalCSS from './AnswerModal.module.css';
import axiosConfig, { IMGBB_API_KEY } from '../../../../../axiosConfig.js';

class AnswerModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.state = {
      photos: [],
      imgFileURLs: [],
      body: '',
      email: '',
      name: '',
    };
  }

  validateForm = (e) => {
    e.preventDefault();
    let isValid = true;
    let warning = 'You must enter the following: ';
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const {
      body, name, email, photos, imgFileURLs,
    } = this.state;

    if (body.length < 1) {
      isValid = false;
      warning += 'valid answer,';
    }
    if (name.length < 1) {
      isValid = false;
      warning += ' valid name,';
    }
    if (email.length < 1 || regex.test(email) === false) {
      isValid = false;
      warning += ' valid email,';
    }
    if (photos.length !== imgFileURLs.length) {
      isValid = false;
      warning += ' valid image file type,';
    }

    warning = warning.slice(0, warning.length - 1);
    if (isValid) {
      this.submitAnswer();
    } else {
      alert(warning);
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handlePhotos = (e) => {
    const { photos, imgFileURLs } = this.state;
    photos.push(e.target.value);
    this.setState({ photos });

    const body = new FormData();
    body.set('key', IMGBB_API_KEY);
    body.append('image', e.target.files[0]);

    axios({
      method: 'post',
      url: 'https://api.imgbb.com/1/upload',
      data: body,
    })
      .then((response) => {
        imgFileURLs.push(response.data.data.display_url);
        this.setState({ imgFileURLs });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  submitAnswer = () => {
    const { question, hideModal, getAnswers } = this.props;
    const { question_id } = question;
    const {
      body, name, email, imgFileURLs,
    } = this.state;

    axiosConfig.post(`/qa/questions/${question_id}/answers`, {
      body, name, email, photos: imgFileURLs,
    })
      .then(() => {
        hideModal();
        getAnswers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { hideModal, question, productName } = this.props;
    const { question_body } = question;
    const { imgFileURLs, photos } = this.state;
    let showUpload = true;
    if (photos.length === 5) {
      showUpload = false;
    }
    const displayPhotos = imgFileURLs.map((url, index) => (
      <img
        src={url}
        alt=""
        className={AModalCSS.thumbnail_img}
        key={index}
      />
    ));
    return (
      <div className={AModalCSS.modalBackground}>
        <form className={AModalCSS.modalContainer}>
          <div className={AModalCSS.exitButton}>
            <button type="submit" className={AModalCSS.exitBtn} onClick={hideModal}>CANCEL</button>
          </div>
          <h2 className={AModalCSS.title}>Submit Your Answer</h2>
          <h4 className={AModalCSS.subtitle}>
            {`${productName}: ${question_body}`}
          </h4>
          <div className={AModalCSS.body}>
            <div>
              <p>Your Answer</p>
              <textarea placeholder="Answer away..." maxLength="1000" rows="4" cols="60" name="body" required onChange={(e) => { this.handleChange(e); }} />
            </div>
            <div>
              <p>What is your nickname?</p>
              <input type="type" placeholder="Example: jack543!" maxLength="60" size="50" name="name" required onChange={(e) => { this.handleChange(e); }} />
              <div className={AModalCSS.security}>
                <p>For privacy reasons, do not use your full name or email address.</p>
              </div>
            </div>
            <div>
              <p>Your email</p>
              <input type="email" placeholder="Example: jack@email.com" maxLength="60" size="50" name="email" required onChange={(e) => { this.handleChange(e); }} />
              <div className={AModalCSS.security}>
                <p>For authentication reasons, you will not be emailed.</p>
              </div>
            </div>
            <div>
              <p>Upload photos</p>
              {showUpload && <input type="file" display="none" className={AModalCSS.file} onChange={(e) => { this.handlePhotos(e); }} />}
              <div className={AModalCSS.imgContainer}>
                {displayPhotos}
              </div>

            </div>

          </div>
          <div className={AModalCSS.footer}>
            <button type="submit" className={AModalCSS.submitBtn} onClick={this.validateForm}>Submit answer</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AnswerModal;
