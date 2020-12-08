import React, { useState, useEffect, useContext } from "react";
import request from "request";
import url from "../../../configs/url";
import { GlobalContext } from "../../../contexts/ConversationState";

const Info = (props) => {
	const [user, setUser] = useState([]);
	const [block, setBlock] = useState(false);
	const [unblock, setUnBlock] = useState(false);
	const { getConversation, isReady } = useContext(GlobalContext);
	const cvs = getConversation(props.chatId);
	let idGuess = "";
	if (cvs) {
		idGuess = props.userId === cvs.firstId ? cvs.secondId : cvs.firstId;
		console.log(idGuess);
	}
	let info = [];
	if (idGuess !== "") {
		info = {
			id: idGuess,
		};
	}

	const handleBlock = (idBlock) => {
		if (isReady) {
			const process = {
				uri: url.LOCAL + "/api/block_chat",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.chattoken}`,
				},
				body: JSON.stringify({
					id: idBlock,
				}),
			};
			request.post(process, (err, httpResponse, body) => {
				if (httpResponse.statusCode === 200) {
					setBlock(true);
				}
			});
		}
	};

	useEffect(() => {
		if (isReady) {
			const getUser = () => {
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
						setUser(objBody.result);
					}
				});
			};
			getUser();
		}
	}, [idGuess]);

	return (
		<div className="float-3">
			{user.rule === "user" ? (
				<div className="info-user">
					<div className="px-2 title-bar d-flex align-items-center">
						<h2>Công cụ</h2>
					</div>
					<div className="info">
						<h3 className="text-center mb-3">Thông tin user</h3>
						<ul>
							<li>
								ID:{" "}
								<span className="text-border">{user._id}</span>
							</li>
							<li>
								Họ và tên:
								<span className="text-border">
									{user.fullname}
								</span>
							</li>
							<li>
								Username:{" "}
								<span className="text-border">
									{user.username}
								</span>
							</li>
							<li>
								Email:{" "}
								<span className="text-border">
									{user.email}
								</span>
							</li>
						</ul>
					</div>
					<hr className="my-5" />
					<div className="tool">
						<button
							onClick={() => handleBlock(idGuess)}
							type="button"
							className="btn btn-danger"
						>
							Cấm chat
						</button>
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default Info;
