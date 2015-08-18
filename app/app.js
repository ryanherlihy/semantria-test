'use strict';

import React from 'react';

let session = new Semantria.Session('','');

window.session = session;

const {
  Component
} = React;

class App extends Component {
  constructor() {
    super();

    this.state = {
      documentInfo: []
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

    let p = new Promise((resolve, reject) => {
      resolve(session.getProcessedDocuments());
    });

    p.then(
      (val) => {
        console.log(val[0]);
        let received = "Document " + val[0]["id"] + " Sentiment score: " + val[0]["sentiment_score"] + "\r\n";
        this.analysisBreakdown(val[0]);
        console.log("Document ", val[0]["id"], " Sentiment score: ", val[0]["sentiment_score"], "\r\n");
      }
    ).catch(
      (reason) => {
        console.log(reason);
      }
    );
  }

  analysisBreakdown(analysis) {
    let entities = analysis.entities.map((item, index) => {
      return ['Title: ' + item.title, 'Label: ' + item.label, 'Sentiment Polarity: ' + item.sentiment_polarity];
    });

    this.setState({documentInfo: entities})
  }

  render() {
    let analysisContent = this.state.documentInfo.map((item) => {
      return item.map((element) => {
        return <p key={100 * Math.random()}>{element}</p>;
      });
    });

    return (
      <div className='content'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6 col-md-offset-3'>
              <div className='panel panel-primary'>
                <div className='panel-heading lead'>
                  Enter Text to Analyze
                </div>
                <div className='panel-body'>
                  <textarea className='center-block form-control' ref='text'></textarea>
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
              <div className='panel panel-default'>
                <div className='panel-heading lead'>Analysis</div>
                <div className='panel-body'>
                  <p>{analysisContent}</p>
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
