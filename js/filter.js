// Function finds out who my most recent conversation partner was
// And returns only the messages from, or to that person
module.exports = function filter(msgs, myId) {
  const firstMessage = msgs[0];
  const { sender_id } = firstMessage.message_create;
  const { recipient_id } = firstMessage.message_create.target;
  const sentByMe = sender_id === myId;
  const friend_id = sentByMe?recipient_id:sender_id;

  const messages = [];

  msgs.forEach( msg => {
    const { sender_id } = msg.message_create;
    const { recipient_id } = msg.message_create.target;
    if ( sender_id === friend_id || recipient_id === friend_id ) {
      messages.push(msg);
    }
  });

  return {
    messages,
    friend_id
  }
}
