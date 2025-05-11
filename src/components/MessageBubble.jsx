function MessageBubble({ sender, text }) {
    return (
      <div style={{
        backgroundColor: sender === 'user' ? '#e0f7fa' : '#f1f8e9',
        padding: '10px',
        borderRadius: '8px',
        margin: '5px 0',
        alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '70%'
      }}>
        <strong>{sender}:</strong> {text}
      </div>
    );
  }
  
  export default MessageBubble;
  