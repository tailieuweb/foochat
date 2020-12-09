import  React from 'react';
import  UserIcon from '../user-icon-status/user-icon-status';
import {connect} from 'react-redux';


function Contacts({currentUser}) {  
    
  return (
      <div className='contact-container'>
          {currentUser.friends ?
            <div className='user-contacts'>
              {currentUser.friends.map((friend, i)=>(
                  <div 
                    key={i} 
                    className='user-contacts__item'>
                      <UserIcon 
                        imageUri={friend.userInfo.userImage}
                        username = {friend.userInfo.username} 
                      />
                      <div className='user-contacts__username'>{friend.userInfo.username}</div>
                  </div>
              ))}
            </div>:
            <div className='user-contacts'> 
              KHÔNG CÓ BẠN BÈ    
            </div>
            }
      </div>
    
  )
}


const mapStateToProps = (state) =>({
   currentUser:state.user.currentUser,
})

export default connect(mapStateToProps, null)(Contacts)