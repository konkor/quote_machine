'use strict';

const DEBUG = 0;

let app = null;

class QuoteMachine extends React.Component {
  constructor(props) {
    super(props);
    app = this;
    this.state = {
      fetched: false,
      quote: {}
    };
    this.tweet = "";
    this.color = "#333";
    this.quotes = [];
    this.fetch_quotes ();
    this.newQuote = this.newQuote.bind (this);
  }

  fetch_quotes () {
    fetch("https://type.fit/api/quotes")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        data.forEach((item, i) => {
          item.author = item.author.split(", ")[0];
        });

        debug (data);

        app.quotes = data;
        app.state.fetched = true;
        app.newQuote ();
      });
  }

  newQuote () {
    if (this.quotes.length < 1) return;
    let nq = this.quotes[
      Math.floor (Math.random() * this.quotes.length)
    ];
    this.newTweet (nq);
    this.newColor ();
    this.setState ({
      fetched: this.state.fetched,
      quote: nq
    });
  }

  newTweet (quote) {
    this.tweet = 'https://twitter.com/intent/tweet?hashtags=quotes&text=' +
      encodeURIComponent('"' + quote.text + '" ' + quote.author);
  }

  newColor () {
    this.color = "#" + this.getHex (Math.floor (Math.random () * 88)) +
                 this.getHex (Math.floor (Math.random () * 88)) +
                 this.getHex (Math.floor (Math.random () * 88));
    debug (this.color);
  }

  getHex(num = 0) {
    let s = num.toString(16);
    s = s.length < 2 ? '0' + s : s;
    return s;
  }

  render() {
    let animation = this.state.fetched ? "" : "fades-animation";
    let fontColor = {color: this.color};
    let background = {backgroundColor: this.color};
    return (
      <div id="quote-back" style={background}>
      <div id="quote-box" className={animation}>
        <div id="text" style={fontColor}>
          <i className="fa fa-quote-left"> </i> {this.state.quote.text}
        </div>
        <div id="author" style={fontColor}>
          {this.state.quote.author}
        </div>
        <div id="quote-panel">
          <a id="tweet-quote" className="btn" href={this.tweet} alt="Tweet the quote" target="_blank" style={background}><i className="fa fa-twitter" /></a>
          <button id="new-quote" className="btn" onClick={this.newQuote} style={background}>More</button>
        </div>
      </div>
        <footer>Created by <a href="https://github.com/konkor">konkor</a></footer>
      </div>
    );
  }
}

function debug (msg) {
    if (DEBUG) console.log (msg);
}

const domContainer = document.querySelector('#quote_machine_container');
const root = ReactDOM.createRoot(domContainer);
root.render(<QuoteMachine />);
