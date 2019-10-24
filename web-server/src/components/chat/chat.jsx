const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
require('./chat.scss');
const ChatJoin = require('./chat-join.jsx');


const $root = document.getElementById('chat-container');

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSendLocClick = this.onSendLocClick.bind(this);
    this.joinAsBtnClick = this.joinAsBtnClick.bind(this);
    this.joinClick = this.joinClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
    this.autoScroll = this.autoScroll.bind(this);
    this.sendMsgBtnRef = React.createRef();
    this.sendMsgInputRef = React.createRef();
    this.sendLocBtnRef = React.createRef();
    this.messageBoxRef = React.createRef();
    this.onSocketMessage = this.onSocketMessage.bind(this);
    this.onSocketRoomUpdate = this.onSocketRoomUpdate.bind(this);
    this.socket.on('message', this.onSocketMessage);
    this.socket.on('roomUpdate', this.onSocketRoomUpdate);
    this.state={messages:[], joinModalDisplay:false, users: {}};
    this.socket.emit('requestData', 'getUsers', (err) => {
      if (err) {
        console.log(err);
      }
    })
  }
  onSocketMessage(msg) {
    this.setState(state => {
      state.messages.push(msg);
      return state;
    });
  }
  onSocketRoomUpdate(users) {
    this.setState(state => {
      state.users = users;
      return state;
    })
  }
  onFormSubmit(evt) {
    evt.preventDefault();
    const msg = evt.target.elements.message.value;
    if (msg) {
      this.sendMsgBtnRef.current.setAttribute('disabled', 'disabled');
      this.socket.emit('sendMessage', msg, (err) => {
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
      this.socket.emit('sendLocation', {
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
    this.setState(state => {
      state.joinModalDisplay = !state.joinModalDisplay;
      return state;
    })
  }
  joinClick(name, room) {
    if (name && room) {
      this.socket.emit('join', {name, room}, (err) => {
        if (err) {
          console.log(`there is err when join: ${err}`);
        }
      });
      this.setState(state => {
        state.joinModalDisplay = !state.joinModalDisplay;
        return state;
      })
    }
    return false;
  }
  cancelClick() {
    this.setState(state => {
      state.joinModalDisplay = !state.joinModalDisplay;
      return state;
    });
  }
  autoScroll() {
    if (this.state.joinModalDisplay) {
      return;
    }
    const $msgBox = this.messageBoxRef.current;
    const $lastMsg = $msgBox.lastElementChild;
    if (!$lastMsg) {
      return;
    }
    // get the last message height height+marginBottom
    const lastMsgHeight = parseInt(getComputedStyle($lastMsg).marginBottom) + $lastMsg.offsetHeight;
    // entire msgBox scroll height
    const msgBoxScrollHeight = $msgBox.scrollHeight;
    // msgBox visible height
    const msgBoxVisibleHeight = $msgBox.offsetHeight;
    // current msgBox scroll top
    const msgBoxScrollTop = $msgBox.scrollTop;
    const currentScrolledHeight = msgBoxScrollTop + msgBoxVisibleHeight;
    if (currentScrolledHeight + lastMsgHeight < msgBoxScrollHeight) {
      //do nothing
    } else {
      $msgBox.scrollTop = $msgBox.scrollHeight;
    }
  }
  componentDidUpdate() {
    this.autoScroll();
  }
  render() {
    console.log(this.state.users);
    return (<div className='chat-wrapper'>
      <div className='chat'>
        <div className='chat__sidebar'>
          <div className='centered-form' style={{height: '10%'}}>
            <button onClick={this.joinAsBtnClick}>Join As</button>
          </div>
          <div>
            {
              Object.keys(this.state.users).map((room,idx) => {
                const users = this.state.users[room];
                const userList = users.map((user,idx) => <li key={`li${user.name}${idx}`}>{user.name}</li>);
                return (<div>
                  <h2 className='room-title' key={`h2${room}${idx}`} title='room'>{room}</h2>
                  <ul key={`ul${room}${idx}`} className='users' title='users'>
                    {userList}
                  </ul>
                  </div>)
              })
            }
          </div>
        </div>
        <div className='chat__main'>
          <ChatJoin display={this.state.joinModalDisplay} joinClick={this.joinClick} cancelClick={this.cancelClick}/>
          <div id="messages" className='chat__messages' ref={this.messageBoxRef}>
            {this.state.messages.map((message, idx) => {
              const time = moment(message.createdAt).format('HH:mm:ss');
              if (message.type=='text') {
                return (
                  <div key={`msg-p-${idx}`} className='message'>
                    <p className='user-info'>
                      <span className='message__name'>{message.name}</span>
                      <span className='message__meta'>{time}</span>
                    </p>
                    <p className='message-info'>{message.text}</p>
                  </div>);
              } else if (message.type=='loc') {
                return (
                  <div key={`msg-p-${idx}`} className='message'>
                    <p className='user-info'>
                      <span className='message__name'>{message.name}</span>
                      <span className='message__meta'>{time}</span>
                    </p>
                    <p className='message-info'><a href={message.text} target="_blank">Current location</a></p>
                  </div>);
              } else {
              }
            })}
          </div>
          <div className='compose'>
            <form id="messge-form" onSubmit={this.onFormSubmit}>
              <input type="text" name="message" id="chat-input" placeholder="Input your message here" 
                ref={this.sendMsgInputRef} required autoComplete="off" />
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