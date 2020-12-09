import React from 'react'
import {Link} from "react-router-dom";
import {connect} from "react-redux";

function UserListItem({addFriend = f => f, user, currentUser}) {     
  const {_id, userImage, username} = user;
  function checkUserStatus(){
     if (currentUser.friends.some(friend => friend.userInfo.username === username)||
      currentUser.username === username
      ){
        return (
			<div className='user__buttons'>
				<Link
					className='user__button prof'
					to={{
						pathname: `/user/${_id}/profile`,
						state: { userData: user }
					}}
				>
					Profile
				</Link>
			</div>
		)
      }

    else{
      return  (
		  <div className='user__buttons'>
			  <p className='user__button add' onClick={() => addFriend(_id)} >Add Friend</p>
			  <Link
				  className='user__button prof'
				  to={{
					  pathname: `/user/${_id}/profile`,
					  state: { userData: user }
				  }}
			  >
				  Profile
				</Link>
		  </div>
          )
    }
  }
  
  
  return (
    <div className='user__item'>
		<div className='user__image'>
			<img src={userImage} className="image" />
		</div>
		<div className='user__details'>
			<p className="user__name">{username}</p>
			{checkUserStatus()}
		</div>
    </div>
  );
}

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
})
  
 export default connect(mapStateToProps, null)(UserListItem);
