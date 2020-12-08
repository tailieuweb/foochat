import React, { useState, useContext } from "react";
import Panel from "../User/Panel";
import ListConversation from "./ListConversation";
import SearchBar from "./SearchBar";
import url from "../../../configs/url";
import request from "request";
import { GlobalContext } from "../../../contexts/ConversationState";
import { history } from "../../../configs/browserHistory";
import socket from "../../../configs/socket";
import ListSearchTile from "./ListSearchTile";
const ChatList = (props) => {
	const { addConversation, getConversation } = useContext(GlobalContext);
	const [isSearchFocusing, updateSearchFocusing] = useState(false);
	const [isMouseOverResult, updateMouseOverResult] = useState(false);

	const [searchResult, setSearchResult] = useState([]);

	const myId = localStorage.userId;
	const fetchPeople = (query) => {
		const options = {
			uri: url.LOCAL + `/api/search?s=${query}`,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.chattoken}`,
			},
		};
		request.get(options, function (err, httpResponse, body) {
			var objBody = JSON.parse(body);
			const userCurrent = localStorage.username;
			objBody = objBody.result;
			const indexCurrentUser = objBody.findIndex(
				(item) => item.username === userCurrent
			);
			objBody = objBody.splice(indexCurrentUser + 1, 1);
			if (httpResponse.statusCode !== 200) {
				searchResult.length = 0;
				return;
			} else {
				setSearchResult([...objBody]);
			}
		});
	};

	const searchOnFocus = () => {
		updateSearchFocusing(true);
		fetchPeople("");
	};

	const searchOutFocus = (event) => {
		event.target.value = "";
		updateSearchFocusing(false);
	};

	const openConversation = (id) => {
		const options = {
			uri: url.LOCAL + `/api/conversation?id1=${myId}&id2=${id}`,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.chattoken}`,
			},
		};

		request.get(options, function (err, httpResponse, body) {
			if (err) return;

			if (httpResponse.statusCode === 200) {
				const obj = JSON.parse(body);

				const newConversation = getConversation(obj.conversation._id);
				if (newConversation) {
				} else {
					addConversation(obj.conversation);
					socket.emit("new-conversation", {
						conversation: obj.conversation,
						createId: localStorage.userId,
					});
				}
				updateSearchFocusing(false);
				updateMouseOverResult(false);
				history.push(`/admin/chat/${obj.conversation._id}`);
			}
		});
	};

	const setMouseOverResult = (isOver) => {
		updateMouseOverResult(isOver);
	};

	return (
		<div className="float-1">
			<div className="chat-list">
				<Panel />
				<SearchBar
					searchOnFocus={searchOnFocus}
					searchOutFocus={searchOutFocus}
					searchPeople={fetchPeople}
				/>
				{!isSearchFocusing && !isMouseOverResult ? (
					<ListConversation
						className="flex-grow"
						chatId={props.chatId}
					/>
				) : (
					<ListSearchTile
						className="flex-grow"
						listResults={searchResult}
						setMouse={setMouseOverResult}
						openConversation={openConversation}
					/>
				)}
			</div>
		</div>
	);
};

export default ChatList;
