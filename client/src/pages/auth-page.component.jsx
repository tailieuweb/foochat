import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {Login, SignUp, setAllUsers } from '../redux/action/user.action';
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import { removeError } from '../redux/action/errors.action';
import validator from '../components/validator/validator';
import { getOnlineUsers, connectOnAuth, startIOConnection, getAllUsers } from '../services/socketIo';
import {isMobile} from 'react-device-detect';
import { ReactComponent as Logo } from '../assets/images/comment.svg'
import AuthImage from '../assets/images/backgroundapple.jpeg'
import Loader from '../components/loader.component';

//lớp tạo form đăng nhập và đăng kí cho người dùng
class Auth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
		loggedIn:false,
		isLoading: false,
		disableSubmitButton: true,
        auth: props.auth || 'register',
        error:null,
        isMobile:isMobile,
        loginData: {
          email: '',
          password: '',
        },
        registerData: {
          username: {
			value: '',
			focused: false,
			validated: false
          },
          email: {
            validated: false,
            value: '',
            focused:false
          },
          password: {
            validated: false,
            value: '',
            focused:false

          },
          confirmPassword: {
            validated: false,
            value: '',
            focused:false
            },
          },
		imageFile:'',
		imageUploaded: false
      }

	}
	
	  //Resize with mobile theo life-cycle
  componentDidMount(){
    window.addEventListener('resize', this.setIsMobile)
  }

  componentDidUpdate(prevProps){
    if(this.props.auth !== prevProps.auth){
      this.setState((prevState) =>({
        ...prevState,
        auth: this.props.auth
      })
      )
    }
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.setIsMobile)
    this.props.removeError()
  }
  
  //Thay đổi state khi nguời dùng nhập thông tin vào form đăng nhập
  onChangeHandlerLogin =(e) =>{
    let {name, value} = e.target;
    this.setState((prevState)=>({
      ...prevState,
      loginData:{
        ...prevState.loginData,
        [name]:value
      }
    }))
  }

  setIsMobile = () =>{
    this.setState((prevState) => ({
      ...prevState,
      isMobile: window.innerWidth <= 600
    }))
  }

  //Thay đổi state khi người dùng nhập thông tin vào form đăng kí
  onChangeHandlerRegister = (e) =>{
	const {name, value} = e.target;
	const updatedControls = {
		  ...this.state.registerData
	};
	const updatedFormElement = {
		...updatedControls[name]
	};
	updatedFormElement.value = value;
	updatedFormElement.touched = true;
	updatedFormElement.validated = validator(name,
		name === 'confirmPassword' ?  {
			password:this.state.registerData.password.value,
			confirm: value
			} : value)

	updatedControls[name] = updatedFormElement;

	let formIsValid = true;
	for (let inputIdentifier in updatedControls) {
		formIsValid = updatedControls[inputIdentifier].validated;
	}

	this.setState({
		registerData: updatedControls,
		disableSubmitButton: !formIsValid
	});
  }
  
//Gửi đi thông tin khi người dùng nhập vào form đăng nhập và đăng kí
  onSubmitHandler = (e) =>{
	  this.setState(prevState =>({
		  ...prevState,
		  isLoading: true
	  }))
    let userData = {
        username:this.state.registerData.username.value,
        email:this.state.registerData.email.value,
        password: this.state.registerData.password.value,
        confirmPassword: this.state.registerData.confirmPassword.value,
      }
    e.preventDefault()
    const header = {
      headers: {
          'content-type': 'multipart/form-data'
        }
      };
    switch (this.state.auth) {
      case 'register':
		if(!this.state.imageFile){
			alert('Please Upload Image')
			return;
		}
        this.props.SignUp(header, this.state.imageFile, userData)
          .then((response) =>{
            startIOConnection()
            getOnlineUsers()
			connectOnAuth(response)
			getAllUsers()
			  this.setState(prevState => ({
				  ...prevState,
				  isLoading: false
			  }))
            this.props.history.push('/')
		  })
		  .catch((error) =>{
			  this.setState(prevState => ({
				  ...prevState,
				  isLoading: false
			  }))
		  })
        break;
      case 'login':
        this.props.Login(this.state.auth, this.state.loginData).then((response)=>{
          startIOConnection()
          getOnlineUsers()
		  connectOnAuth(response)
			  .catch((error) => {
				  this.setState(prevState => ({
					  ...prevState,
					  isLoading: false
				  }))
			  })
          this.props.history.push('/')
		}).catch((error) => {
			this.setState(prevState => ({
				...prevState,
				isLoading: false
			}))
		})
          
        break;
      default:
        break;
    }
  }
  //hàm xử lý việc tải lên và đọc tệp hình ảnh
  onImageUploadHandler = () =>{
    let fileUpload = document.querySelector('.image-upload__input');
    let filePath = document.querySelector('.image-upload__message');
	fileUpload.click()
    fileUpload.onchange =  () => {
      let fileName = fileUpload.value.split('\\')[fileUpload.value.split('\\').length - 1];
	  filePath.value = fileName
	  console.log(fileUpload.files[0])
      this.setState((prevState, props) => ({
        ...prevState,
		  imageFile:fileUpload.files[0],
		  imageUploaded: true
        })
      )  
    };
  }

    //thay đổi state sau khi user đăng nhập
  changeAuthState = (value)=>{
    this.props.removeError()
    this.setState({auth:value})
  }

  render() {
    const { errors } = this.props;
	const {auth, registerData, loginData, isMobile, disableSubmitButton, isLoading } = this.state;

    return (
		<div className='auth-page'>
			{isLoading && <Loader/>}
			<div className="auth-page__left-section">
				<div className="auth-page__header">
					<Logo className='logo' />
					<span className='app-name'>Foo Chat</span>
				</div>
				<nav className='form-nav'>
					<ul className="form-nav__list">
						<li className="form-nav__item">
							<NavLink className="form-nav__link" activeClassName='active-auth' to='/auth/login'>login </NavLink>
						</li>
						<li className="form-nav__item">
							<NavLink className="form-nav__link" activeClassName='active-auth' to='/auth/register'>signUp </NavLink>
						</li>

					</ul>
				</nav>
				<form className='form' onSubmit={this.onSubmitHandler} >
					{(auth === 'register') ?
						<div className='form__inner'>
							<div className='alert-error'>{
								errors.message === "Email không tồn tại vui lòng đăng ký" ?
									<div>
										<span>Email không tồn tại vui lòng đăng ký </span>
										<span
											className='switch-auth'
											style={{ color: 'blue', cursor: 'pointer' }}
											onClick={() => this.changeAuthState('register')}> Register </span>
									</div> : errors.message
								}
							</div>
							<div className='form__component'>
								<i className='form__group__icon'><FontAwesomeIcon icon={faUser} /></i>
								<div className='form__group'>
									<input
										type='text'
										name='username'
										placeholder={isMobile ? "Username" : ""}
										onChange={this.onChangeHandlerRegister}
										style={{ color: registerData.username.validated ? 'black' : 'red' }}
										value={registerData.username.value}
										className='form__input' required />
									<label htmlFor='username' className='form__label'>
										Username
									</label>
								</div>
							</div>
							<div className='form__component'>
								<i className='form__group__icon'>
									<FontAwesomeIcon icon={faEnvelope} />
								</i>
								<div className='form__group'>
									<input
										type='email'
										placeholder={isMobile ? "Email" : ""}
										onChange={this.onChangeHandlerRegister}
										value={registerData.email.value}
										style={{ color: registerData.email.validated ? 'black' : 'red' }}
										name='email'
										className='form__input' required />
									<label htmlFor='email' className='form__label'>Email</label>
								</div>
							</div>
							<div className='form__component'>
								<i className='form__group__icon'><FontAwesomeIcon icon={faKey} /></i>
								<div className='form__group'>
									<input
										type='password'
										placeholder={isMobile ? "Mật khẩu phải chứa ít nhất 8 kí tự" : ""}
										name='password'
										onChange={this.onChangeHandlerRegister}
										style={{ color: registerData.password.validated ? 'black' : 'red' }}
										value={registerData.password.value}
										className='form__input' required />
									<label htmlFor='password' className='form__label'>
										<span>Password</span>
										<span>(Must be at least 8 characters)</span>
									</label>
								</div>
							</div>
							<div className='form__component'>
								<i className='form__group__icon'>
									<FontAwesomeIcon icon={faKey} />
								</i>
								<div className='form__group'>
									<input
										type='password'
										name='confirmPassword'
										placeholder={isMobile ? "Confirm password" : ""}
										onChange={this.onChangeHandlerRegister}
										style={{ color: registerData.confirmPassword.validated ? 'black' : 'red' }}
										value={registerData.confirmPassword.value}
										className='form__input' required />
									<label htmlFor='confirm-password' className='form__label'>Confirm Password</label>
								</div>
							</div>
							<div className='form__group-image'>
								<input type='file'
									className='image-upload__input'
									name='image'
									onChange={this.url} accept='image/*'  />
								<input type='text'
									className='image-upload__message'
									disabled placeholder='Upload Profile Image' />
								<button
									className='image-upload__button'
									onClick={this.onImageUploadHandler}
									type='button'> Browse
								</button>
							</div>
						</div> :
						<div className='form__inner'>
							<div className='alert-error'>{
								errors.message === "Email không tồn tại vui lòng đăng ký" ?
									<div>
										<span>Email không tồn tại vui lòng đăng ký </span>
										<span
											className='switch-auth'
											style={{ color: 'blue', cursor: 'pointer' }}
											onClick={() => this.changeAuthState('register')}> Register </span>
									</div>
									:
									errors.message
							}
							</div>
							<div className='form__component'>
								<i className='form__group__icon'>
									<FontAwesomeIcon icon={faEnvelope} />
								</i>
								<div className='form__group'>
									<input
										type='email'
										placeholder={isMobile ? "Email" : ""}
										onChange={this.onChangeHandlerLogin}
										value={loginData.email}
										name='email'
										className='form__input'  />
									<label htmlFor='email' className='form__label'>Email</label>
								</div>
							</div>
							<div className='form__component'>
								<i className='form__group__icon'><FontAwesomeIcon icon={faKey} /></i>
								<div className='form__group'>
									<input
										type='password'
										name='password'
										placeholder={isMobile ? "Password" : ""}
										onChange={this.onChangeHandlerLogin}
										value={loginData.password}
										className='form__input' />
									<label htmlFor='password' className='form__label'>Password</label>
								</div>
							</div>
						</div>
					}
					<input type='submit' 
						className='form-submit-button' 
						value='Submit' 
						disabled={disableSubmitButton && auth === 'register' } />
				</form>
			</div>
			<div className="auth-page__right-section" style={{backgroundImage: `url(${AuthImage})`}}>
		</div>	
    </div>   
    )
  }
}

//Map giá trị của state và props để sử dụng trong components
const mapStateToProp = state =>({
  errors : state.errors
})

//Map việc gọi từ action đến reducer thành props
const mapDispatchToProps = (dispatch) => ({
	Login: (auth, loginData) => dispatch(Login(auth, loginData)),
	removeError: () =>dispatch(removeError()),
	SignUp: (header, imageFile, userData) => dispatch(SignUp(header, imageFile, userData)),
	setAllUsers: (users) => dispatch(setAllUsers(users))

})

export default withRouter(connect(mapStateToProp,mapDispatchToProps)(Auth))