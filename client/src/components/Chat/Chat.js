import React, { useEffect } from "react";

import { GlobalProvider } from "../../contexts/ConversationState";
import ChatList from "./ChatList/ChatList";
import ChatBox from "./ChatBox/ChatBox";
import Info from "./User/Info";

const Chat = (props) => {
	const userId = localStorage.userId;
	const chatId = props.match.params.id;

	useEffect(() => {
		document.title = "Chat";
	}, []);

	return (
		<GlobalProvider>
			<div className="chat">
				<div className="container-fluid">
					<div className="float-content">
						<ChatList chatId={chatId} />
						<ChatBox chatId={chatId} userId={userId} />
						<Info chatId={chatId} userId={userId} />
					</div>
				</div>
			</div>
		</GlobalProvider>
	);
};

export default Chat;
