import React,{useState} from "react";
import {connect} from "react-redux";
import {setCurrentUser, logOut,  addFriend } from "../../redux/action/user.action";
import {withRouter, Link} from "react-router-dom";
import {ReactComponent as Logo} from '../../assets/images/comment.svg'

function Navigation ({currentUser, logOut}) {
    
    const clickHandler = () => {
    
        document.querySelector('.navigation__checkbox').checked = false
        console.log(document.querySelector('.navigation__checkbox').checked )
    }
    const [showDropDown, toggleDropDown] = useState(false)
    const toggleDropDownHandler = () =>{
        toggleDropDown(!showDropDown)
    }

    return (
        <React.Fragment>
            <nav className="navigation">
                <div className="logo-box">
                    <Logo className='logo'/>
                    <Link to="/" className='app-name'>
                        Foo Chat
                    </Link>
                </div>
                <div className="navigation__dropdown">
                    <Link to="" onClick={toggleDropDownHandler}
                        className="navigation__link-001">
                            H
                    </Link>
                </div>
                <input type='checkbox' className='navigation__checkbox' id='toggle' />
                <label className='navigation__button' htmlFor='toggle'>
                    <span className='navigation__icon'>&nbsp;</span>
                </label>
                <ul className="navigation__list">
                    <li className="navigation__item" onClick={() => clickHandler()}>
                        <Link to="/" className="navigation__link">
                            Home
                        </Link>
                    </li>
                    
                        <li className="navigation__item">
                            <Link to="/" onClick={() =>logOut()} className="navigation__link">
                                Log Out
                            </Link>
                        </li>
                </ul>
            </nav>
        </React.Fragment>
    )   
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
    isAuthenticated:state.user.isAuthenticated,

 })

 const mapDispatchToProps = dispatch =>({
    addFriend: (addedUserId) => dispatch(addFriend(addedUserId)),
    setCurrentUser: user => dispatch(setCurrentUser(user)),
    logOut : () => dispatch(logOut())
 })
 
 export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));