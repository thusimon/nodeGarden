const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
require('./chat.scss');
const ChatJoin = require('./chat-join.jsx');

const socket = io();

const $root = document.getElementById('chat-container');

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSendLocClick = this.onSendLocClick.bind(this);
    this.joinAsBtnClick = this.joinAsBtnClick.bind(this);
    this.sendMsgBtnRef = React.createRef();
    this.sendMsgInputRef = React.createRef();
    this.sendLocBtnRef = React.createRef();
    this.onSocketMessage = this.onSocketMessage.bind(this);
    this.socket.on('message', this.onSocketMessage);
    this.state={messages:[], joinModalDisplay:false};
  }
  onSocketMessage(msg) {
    this.setState(state => {
      state.messages.push(msg);
      return state;
    });
  }
  onFormSubmit(evt) {
    evt.preventDefault();
    const msg = evt.target.elements.message.value;
    if (msg) {
      this.sendMsgBtnRef.current.setAttribute('disabled', 'disabled');
      socket.emit('sendMessage', msg, (err) => {
        // delivered call back
        this.sendMsgBtnRef.current.removeAttribute('disabled');
        this.sendMsgInputRef.current.value = '';
        this.sendMsgInputRef.current.focus();
        if(err) {
          console.log(err);
        } else {
          console.log('Message Delivered');
        }
      });
    }
  }
  onSendLocClick(evt) {
    evt.preventDefault();
    if (!navigator.geolocation) {
      console.log('browser does not support geolocation');
      return;
    }
    this.sendLocBtnRef.current.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((location) => {
      socket.emit('sendLocation', {
        lat: location.coords.latitude,
        long: location.coords.longitude
      }, (err) => {
        this.sendLocBtnRef.current.removeAttribute('disabled');
        if (err) {
          console.log(err);
        } else {
          console.log('Location Shared');
        }
      });
    })
  }
  joinAsBtnClick(evt) {
    this.setState((state) => {
      state.joinModalDisplay = !state.joinModalDisplay;
      return state;
    })
  }
  render() {
    return (<div className='chat-wrapper'>
      <div className='chat'>
        <div className='chat__sidebar'>
          <button onClick={this.joinAsBtnClick}>Join As</button>
        </div>
        <div className='chat__main'>
          <ChatJoin display={this.state.joinModalDisplay} />
          <div id="messages" className='chat__messages'>
            {this.state.messages.map((message, idx) => {
              const time = moment(message.createdAt).format('HH:mm:ss');
              if (message.type=='text') {
                return (
                  <div key={`msg-p-${idx}`} className='message'>
                    <p>
                      <span className='message__name'>Guest</span>
                      <span className='message__meta'>{time}</span>
                    </p>
                    <p>{message.text}</p>
                  </div>);
              } else if (message.type=='loc') {
                return (
                  <div key={`msg-p-${idx}`} className='message'>
                    <p>
                      <span className='message__name'>Guest</span>
                      <span className='message__meta'>{time}</span>
                    </p>
                    <p><a href={message.text} target="_blank">Current location</a></p>
                  </div>);
              } else {
              }
            })}
          </div>
          <div className='compose'>
            <form id="messge-form" onSubmit={this.onFormSubmit}>
              <input type="text" name="message" id="chat-input" placeholder="Input your message here" 
                ref={this.sendMsgInputRef}/>
              <button id="chat-send" ref={this.sendMsgBtnRef}>Send</button>
            </form>
            <br></br>
            <button id="send-location" ref={this.sendLocBtnRef} onClick={this.onSendLocClick}>Send Location</button>
          </div>
        </div>
      </div>
    </div>);
  }
}
 
ReactDOM.render(<Chat />, $root);