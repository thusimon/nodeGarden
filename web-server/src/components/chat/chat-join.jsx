const React = require('react');

const ChatJoin = ({display}) => {
  const displayStyle = display ? 'block' : 'none';
  return (
    <div className='chat-wrapper-join' style={{display: displayStyle}}>
      <div className='centered-form'>
        <div className='centered-form__box'>
          <h1>Join</h1>
          <form>
            <label>Display Name</label>
          </form>
        </div>
      </div>
    </div>
  )
}

module.exports = ChatJoin;