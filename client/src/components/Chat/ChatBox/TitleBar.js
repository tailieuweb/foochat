import React from "react";
import getAvatar from "../../../configs/getAvatar";

const TitleBar = ({ name }) => {
	return (
		<div className="title-bar">
			<div className="d-flex bg-part">
				<div className="d-flex align-items-center px-2">
					<img src={getAvatar(name)} className="avt-ico" alt="avt" />
					<h1 className="display-5">{name}</h1>
				</div>
			</div>
		</div>
	);
};

export default TitleBar;
