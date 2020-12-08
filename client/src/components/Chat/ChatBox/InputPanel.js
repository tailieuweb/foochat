import React, { useRef, useContext, useState, useEffect } from "react";
import request from "request";
import url from "../../../configs/url";
import { GlobalContext } from "../../../contexts/ConversationState";
import socket from "../../../configs/socket";
import EmojiPicker from "emoji-picker-react";

const InputPanel = ({ cid, uid }) => {
	console.log(cid + ", " + uid);
	const chatFieldRef = useRef(null);
	const { updateConversation, addNewMessage, isReady } = useContext(
		GlobalContext
	);
	const [isSending, setSending] = useState(false);
	const [block, setBlock] = useState(false);

	const [openEmoji, setOpenEmoji] = useState("none");
	console.log(openEmoji);
	const [chosenEmoji, setChosenEmoji] = useState(null);

	const onEmojiClick = (event, emojiObject) => {
		setChosenEmoji(emojiObject);
		chatFieldRef.current.value += emojiObject.emoji;
	};

	useEffect(() => {
		if (isReady) {
			const info = {
				id: uid,
			};
			const process = {
				uri: url.LOCAL + `/api/getuser`,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.chattoken}`,
				},
				body: JSON.stringify({
					...info,
				}),
			};

			request.post(process, (err, httpResponse, body) => {
				var objBody = JSON.parse(body);
				if (httpResponse.statusCode === 200) {
					console.log(objBody.result.isBlock);
					setBlock(objBody.result.isBlock);
				}
			});
		}
	}, [isReady]);

	let timeout = null;
	const myUsername = localStorage.username;
	const sendMessage = () => {
		const content = chatFieldRef.current.value;
		chatFieldRef.current.value = "";
		if (!content || content === "") return;
		setSending(true);
		const options = {
			uri: `${url.LOCAL}/api/send-message`,
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.chattoken}`,
			},
			body: JSON.stringify({
				cid: cid,
				uid: uid,
				content: content,
				username: myUsername,
			}),
		};

		request.post(options, function (err, httpResponse, body) {
			if (httpResponse.statusCode !== 200) {
			} else {
				const obj = JSON.parse(body);
				addNewMessage({
					conversation: obj.conversation,
					message: obj.newMessage,
				});

				updateConversation(obj.conversation);
				if (timeout) clearTimeout(timeout);
				stoppedTyping();
				socket.emit("user-send-message", {
					conversation: obj.conversation,
					newMessage: obj.newMessage,
				});
			}
			setSending(false);
		});
	};

	const stoppedTyping = () => {
		socket.emit("user-typing-message", {
			cid: cid,
			uid: uid,
			isTyping: false,
		});
	};

	return (
		<div className="w-full h-16 bg-white flex p-2">
			<div className="flex-grow flex-shrink d-flex align-items-center position-relative">
				<input
					disabled={block}
					type="search"
					ref={chatFieldRef}
					className="px-4 py-2 w-full bg-gray-300 text-gray-900 rounded-full outline-none truncate"
					onChange={() => {
						socket.emit("user-typing-message", {
							cid: cid,
							uid: uid,
							isTyping: true,
							name: myUsername,
						});
						if (timeout) clearTimeout(timeout);
						timeout = setTimeout(stoppedTyping, 1500);
					}}
					onKeyPress={(event) => {
						if (event.key === "Enter" || event.keyCode === 13) {
							sendMessage();
						}
					}}
					placeholder={
						block
							? "You have blocked chat"
							: "Input your message..."
					}
				/>
				<div
					className="sticker position-absolute"
					style={{ display: openEmoji }}
				>
					<EmojiPicker onEmojiClick={onEmojiClick} />
				</div>
				<div
					className="btn-emoji"
					onClick={() =>
						setOpenEmoji(openEmoji === "none" ? "block" : "none")
					}
					style={{display: block?'none':'block'}}
				></div>
			</div>
			<button
				className="flex-shrink-0 my-1 mx-2 bg-blue-500 rounded-full  focus:outline-none"
				style={{ flexBasis: 50 }}
				onClick={sendMessage}
				disabled={isSending||block}
			>
				{isSending ? (
					<div className="spinner">A</div>
				) : (
					<div className="flex items-center justify-center text-white ">
						<svg
							className="h-4 w-4 fill-current"
							viewBox="0 0 1000 1000"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M10,991.1l980-493.2L10,8.9l101.1,415.7l532.7,73.4l-532.7,70.5L10,991.1z" />
						</svg>
					</div>
				)}
			</button>
		</div>
	);
};

export default InputPanel;
