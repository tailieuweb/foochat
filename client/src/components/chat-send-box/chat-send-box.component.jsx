import  React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import { sendMessageToGroup, sendPrivateMessage } from '../../services/socketIo';
import { sendMessage } from '../../redux/action/message.action';



const ChatSendBox = ({groupId, recipient, currentUser, sendMessage, location}) =>  {    

    const [message, setMessage] = useState('') 
    console.log(recipient)
    const onSubmitHandler = (e) =>{
        e.preventDefault()            
        if(groupId){ 
            sendMessageToGroup(message, groupId)            
        }
        else if (recipient){
            let body = {message, location}
            sendPrivateMessage(message, currentUser.username,  recipient.username, location)
            sendMessage(recipient._id, body)
            
        }
        else{
            alert('Click vào icon friend để tham gia vào group để gửi tin nhắn')
        }           
       
        setMessage('')
    }

    return(
        <form onSubmit={onSubmitHandler} className='chat-box'>
            <input type='hidden' value='something'/>
            <button  type='submit' className='chat-box__icon'>
                <FontAwesomeIcon icon={faPaperPlane}/>  </button>
            <input 
                type='text'
                name='chat_message' 
                onChange={(e)=>setMessage(e.target.value)}
                autoComplete='new-password'
                value={message}
                placeholder='Gửi tin nhắn' 
                className='chat-box__input chat_message' required/>
        </form>
    )
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })

 const mapDispatchToProps = (dispatch) =>({
    sendMessage: (message, receiverId) => dispatch(sendMessage(message, receiverId))
 })
 
 export default connect(mapStateToProps, mapDispatchToProps)(ChatSendBox)
