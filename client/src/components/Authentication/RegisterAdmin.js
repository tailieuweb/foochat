import React from "react";
import { Link } from "react-router-dom";
import request from "request";
import url from "../../configs/url";
import { history } from "../../configs/browserHistory";
import video_bg from "../../assets/images/bg.mp4";

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fullname: "",
			email: "",
			username: "",
			password: "",
			cf_password: "",
			isRegistering: false,
			errMessage: "",
		};
		this._isMounted = false;

		this.onChangeFullname = this.onChangeFullname.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onChangeCfPassword = this.onChangeCfPassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.success = this.success.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (this._isMounted) document.title = "Đăng ký";
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	onChangeFullname(e) {
		this.setState({
			fullname: e.target.value,
		});
	}
	onChangeEmail(e) {
		this.setState({
			email: e.target.value,
		});
	}
	onChangeUsername(e) {
		this.setState({
			username: e.target.value,
		});
	}
	onChangePassword(e) {
		this.setState({
			password: e.target.value,
		});
	}
	onChangeCfPassword(e) {
		this.setState({
			cf_password: e.target.value,
		});
	}

	success = (httpResponse, body) => {
		if (httpResponse.statusCode !== 200) {
			this.setState({
				isRegistering: false,
				errMessage: "Co loi xay ra",
			});
		} else {
			history.push("/admin");
			if (this._isMounted) {
				this.setState({
					isRegistering: false,
				});
			}
		}
	};
	
	handleSubmit(e) {
		e.preventDefault();
		if (this._isMounted) {
			const info = {
				fullname: this.state.fullname,
				email: this.state.email,
				username: this.state.username,
				password: this.state.password,
				cf_password: this.state.cf_password,
				admin: true,
			};
			if (!info.username || !info.password || !info.cf_password) {
				this.setState({
					errMessage: "Please input username or password",
				});
				return;
			} else if (info.password !== info.cf_password) {
				this.setState({
					errMessage: "Password do not match",
				});
				return;
			}
			this.setState({
				isRegistering: true,
			});

			const process = {
				uri: url.LOCAL + "/api/register",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...info,
				}),
			};

			request.post(process, (err, httpResponse, body) => {
				this.success(httpResponse, body);
			});
		}
	}
	render() {
		return (
			<section className="auth-page">
				<video autoPlay muted loop id="bg-video">
					<source src={video_bg} type="video/mp4" />
				</video>
				<div className="container">
					<div className="display-screen">
						<h1 className="text-center display-4">Register Admin</h1>
						<form method="POST" onSubmit={this.handleSubmit}>
							<div className="form-group">
								<label htmlFor="fullname">Tên đầy đủ</label>
								<input
									type="text"
									name="fullname"
									id="fullname"
									value={this.state.fullname}
									onChange={this.onChangeFullname}
									className="form-control"
									autoComplete="off"
									spellCheck="false"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input
									type="email"
									name="email"
									id="email"
									value={this.state.email}
									onChange={this.onChangeEmail}
									className="form-control"
									autoComplete="off"
									spellCheck="false"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="username">Tên tài khoản</label>
								<input
									name="username"
									id="username"
									value={this.state.username}
									onChange={this.onChangeUsername}
									className="form-control"
									autoComplete="off"
									spellCheck="false"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="password">Mật khẩu</label>
								<input
									type="password"
									name="password"
									id="password"
									value={this.state.password}
									onChange={this.onChangePassword}
									className="form-control"
									autoComplete="off"
									spellCheck="false"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="cf_password">
									Xác nhận mật khẩu
								</label>
								<input
									type="password"
									name="cf_password"
									id="cf_password"
									value={this.state.cf_password}
									onChange={this.onChangeCfPassword}
									className="form-control"
									autoComplete="off"
									spellCheck="false"
								/>
							</div>
							<div>
								{this.state.errMessage &&
								this.state.errMessage.length !== 0 ? (
									<p>{this.state.errMessage}.</p>
								) : null}
							</div>
							<div className="form-group submit">
								<button
									type="submit"
									className="btn btn-primary"
								>
									{this.state.isRegistering
										? "Processing"
										: "Register"}
								</button>
							</div>
							<div className="text-center">
								<Link to="/admin">Tôi đã có tài khoản!</Link>
							</div>
						</form>
					</div>
				</div>
			</section>
		);
	}
}

export default Register;
