import React, { Component } from 'react';
import {Link} from 'react-router-dom';


export default class Profile extends Component {

    render() {
        const {userData} = this.props;
        return (
            <div className='profile'>
                { userData ?
                    <div>
                        <div className='profile__image'>
                            <img
                               alt={userData.username}
                                src={ userData.userImage}
                                className='profile__image-user'/>
                        </div>
                        <h2 className='profile__username'>{userData.username}</h2>
                        <Link 
                            className='btn btn-white' 
                            to={{
                                pathname: `/user/${userData._id}/profile`,
                                state: { userData: userData}
                            }}
                        >
                            Profile
                        </Link> 
                    </div> :
                    <div>
                    </div>}
            </div>
        )
    }
}
