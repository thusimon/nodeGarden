const React = require('react');
const ChatJoin = ({display, joinClick, cancelClick}) => {
  let displayStyle = display ? 'block' : 'none';
  let userNameInputRef = React.createRef();
  let roomInputRef = React.createRef();
  const joinBtnClick = function (evt) {
    //evt.preventDefault();
    let displayName = userNameInputRef.current.value;
    let room = roomInputRef.current.value;
    joinClick(displayName, room);
  }
  const cancelBtnClick = function (evt) {
    evt.preventDefault();
    cancelClick();
  }
  return (
    <div className='chat-wrapper-join' style={{display: displayStyle}}>
      <div className='centered-form'>
        <div className='centered-form__box'>
          <h1>Join</h1>
          <form action='javascript:void(0);'>
            <label>Display Name</label>
            <input type='text' name='username' placeholder='Display Name' required ref={userNameInputRef}/>
            <label>Room</label>
            <input type='text' name='room' placeholder='Room' required ref={roomInputRef}/>
            <button onClick={joinBtnClick}>Join</button>
            <button onClick={cancelBtnClick}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  )
}

module.exports = ChatJoin;