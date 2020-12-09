import React, { Component } from 'react'
import {connect} from 'react-redux';
import { receivePrivateMessage, unRegisterReceivePrivateMessage } from '../../services/socketIo';
import  ChatMessenger  from '../chat-messages/chat-messages.component';
import ChatSendBox from '../chat-send-box/chat-send-box.component';
import { getMessages } from '../../redux/action/message.action';
import { getLocation } from '../../redux/action/user.action';

 
class PrivateMessages extends Component {
	constructor (props) {
		super(props);
		this.chatArea = React.createRef()
		this.state ={
		  currentUser:props.currentUser,
		  location:null,
		  messages:props.messages
		}
	}

	componentDidMount(){
	  receivePrivateMessage(this.setReceivedMessage);    
	  this.scrollToBottom();
	  this.props.getMessages(this.state.currentUser._id, this.props.recipient._id);
	}

	componentDidUpdate(prevProps) {      
	  if (this.props.messages !== prevProps.messages) {          
		  this.setState((prevState) =>({
			...prevState,
			messages: this.props.messages,
			recipient:this.props.recipient,
		  }), () =>  this.scrollToBottom()
		)
	  }
	}

	componentWillUnmount(){
	  unRegisterReceivePrivateMessage()
	}


	scrollToBottom = () =>{
	  this.chatArea.current.scroll(0, this.chatArea.current.scrollHeight)
	}


	setReceivedMessage = (message) =>{ 
	  this.setState(prevState => ({
		...prevState,
		messages: [...prevState.messages, message ]
	  }), () => this.scrollToBottom()
	  )}

	

	getUserLocation = () => {
		if (!navigator.geolocation) {
			return alert("Sorry this browser doesn't support geolocation")
		}    

		navigator.geolocation.getCurrentPosition((position)=>{
			let lat = position.coords.latitude
			let long = position.coords.longitude
			let coords = {lat, long}
			this.props.getLocation(coords)
			.then((res)=>{
				this.setState((prevState)=>({
					...prevState,
					location: res
					})
				)
			})
			})
	}
  
	
	render() {
		const {messages} = this.state;
		const {recipient} = this.props;
		console.log(recipient)
		return (
			<div className='chat-container'>
			<div className='chat-area-header'>
				<div className="user">
					<img
							src={recipient.image || recipient.userImage}
						alt="your profile"
						className="user__photo" />
					<div className="user__username">{recipient.username}</div>
				</div>

			</div>
			<div className='chat-area' ref={this.chatArea}>
				{ messages &&
				messages.map((message) =>(
					<ChatMessenger message={message}
					location = {this.state.location}/>
					))
					}
			</div>
			<ChatSendBox 
				location={this.state.location}
				recipient={recipient}/>
		</div>
	  )
	}
}

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
  errors : state.errors,
  allUsers: state.user.users,
  messages: state.messages.messages
})
  
const mapDispatchToProps = dispatch => ({
  getLocation: (coords) => dispatch(getLocation(coords)) , 
  getMessages: (userId, recipientId) => dispatch(getMessages(userId, recipientId)),
})


export default connect(mapStateToProps , mapDispatchToProps)(PrivateMessages);