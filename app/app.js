'use strict';

import React from 'react';

let session = new Semantria.Session('fcf586fe-db8e-44f6-b15a-80132c4045ad','86c82e06-c537-41ef-90c7-6f9f6a60157d');

// let session = new Semantria.Session('KEY','SECRET');

window.session = session;

const {
  Component
} = React;

class App extends Component {
  constructor() {
    super();

    this.state = {
      documentInfo: {}
    }
    this.handleTextButton = this.handleTextButton.bind(this);
    this.analysisBreakdown = this.analysisBreakdown.bind(this);
  }

  handleTextButton() {
    let text = this.refs.text.getDOMNode().value;
    console.log(text);
    this.refs.text.getDOMNode().value = '';

    let doc = {"id": 1, "text": text};
    let status = session.queueDocument(doc);
    if (status === 202) {
      console.log("\"", doc["id"], "\" document queued successfully.", "\r\n");
    }

    let timeout = setInterval(() => {
      let processed = session.getProcessedDocuments();

      clearInterval(timeout);
      this.analysisBreakdown(processed[0]);
    }, 3000);
  }

  analysisBreakdown(analysis) {
    if (analysis) {
      this.setState({documentInfo: analysis})
    }
  }

  render() {
    let analysisContent = Object.keys(this.state.documentInfo).sort().map((output, index) => {
      if (typeof this.state.documentInfo[output] === 'string') {
        return (
          <div key={index} style={{marginBottom: 20}}>
            <h4>{output.replace('_', ' ').toUpperCase()}</h4>
            <p>{this.state.documentInfo[output]}</p>
          </div>
        );
      } else if (typeof this.state.documentInfo[output] === 'number') {
        return (
          <div key={index} style={{marginBottom: 20}}>
            <h4>{output.replace('_', ' ').toUpperCase()}</h4>
            <p>{this.state.documentInfo[output]}</p>
          </div>
        );
      } else {
        if (this.state.documentInfo[output]) {
          let items = this.state.documentInfo[output].map((item) => {
            return item['title'];
          }).reduce((prev, current) => {
            return prev + ', ' + current;
          });
          return(
            <div key={index} style={{marginBottom: 20}}>
              <h4>{output.replace('_', ' ').toUpperCase()}</h4>
              <p>{items}</p>
            </div>
          );
        }
      }
    });

    let sentimentColor = {
      red: 255,
      green: 255,
      blue: 255
    };

    let score = this.state.documentInfo['sentiment_score'];

    if (score > 0) {
      sentimentColor['red'] -= Math.ceil(score * 90);
      sentimentColor['blue'] -= Math.ceil(score * 90);
    } else if (score < 0) {
      score = Math.abs(score);
      sentimentColor['green'] -= Math.ceil(score * 90);
      sentimentColor['blue'] -= Math.ceil(score * 90);
    };

    let sentimentStyle = {
      backgroundColor: '#' + sentimentColor['red'].toString(16) + sentimentColor['green'].toString(16) + sentimentColor['blue'].toString(16)
    };

    return (
      <div>
        <div className='navbar navbar-default'>
          <div className='container'>
          </div>
        </div>
        <div className='content'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-6 col-md-offset-3'>
                <div className='panel panel-primary'>
                  <div className='panel-heading lead'>
                    Enter Text to Analyze
                  </div>
                  <div className='panel-body'>
                    <textarea
                      className='center-block form-control'
                      ref='text'
                      style={{height: 150}}>
                    </textarea>
                    <button
                      className='btn btn-primary center-block content'
                      onClick={this.handleTextButton}>
                      Send For Analysis
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6 col-md-offset-3'>
                <div className='panel panel-default' style={sentimentStyle}>
                  <div className='panel-heading lead'>Analysis</div>
                  <div className='panel-body'>
                    <p>{analysisContent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

React.render(
  <App />,
  document.getElementById('example')
);
