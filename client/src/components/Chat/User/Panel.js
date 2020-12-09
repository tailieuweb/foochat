import React from "react";

import getAvatar from "../../../configs/getAvatar";
import LogoutButton from "./LogoutButton";

const Panel = () => {
	return (
		<div className="panel">
			<div className="d-flex justify-content-center bg-part">
				<div className="col-lg-8 d-flex align-items-center hidden-mobile">
					<img
						src={getAvatar(localStorage.username)}
						className="avt-ico"
						alt="My avatar"
					/>
					<h1 className="display-5">
						Chat
					</h1>
				</div>
				<div className="col-lg-4 d-flex align-items-center justify-content-center">
					<LogoutButton />
				</div>
			</div>
		</div>
	);
};

export default Panel;
