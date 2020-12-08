import React from "react";
import { Link, Redirect } from "react-router-dom";
import request from "request";
import { history } from "../../configs/browserHistory";
import url from "../../configs/url";
import socket from "../../configs/socket";
import video_bg from "../../assets/images/bg.mp4";

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			isLogin: false,
			errMessage: "",
		};
		this._isMounted = false;
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.success = this.success.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (this._isMounted) document.title = "Đăng nhập";
	}
	componentWillUnmount() {
		this._isMounted = false;
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

	success = (httpResponse, body) => {
		const objBody = JSON.parse(body);
		if (httpResponse.statusCode !== 200) {
			this.setState({
				isLogin: false,
				errMessage: objBody.message,
			});
		} else {
			localStorage.setItem("chattoken", objBody.token);
			localStorage.setItem("userId", objBody.user.id);
			localStorage.setItem("username", objBody.user.username);

			socket.emit("user-login", objBody.user.id);
			history.push("/admin/chat");
		}
	};

	async handleSubmit(e) {
		e.preventDefault();
		if (this._isMounted) {
			const info = {
				username: this.state.username,
				password: this.state.password,
			};
			if (!info.username || !info.password) {
				this.setState({
					errMessage: "Please input username or password",
				});
				return;
			}
			this.setState({
				isLoggin: true,
			});

			const process = {
				uri: url.LOCAL + "/api/login",
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
		return localStorage.getItem("chattoken") ? (
			<Redirect to="/user/chat" push={true} />
		) : (
			<section className="auth-page">
				<video autoPlay muted loop id="bg-video">
					<source src={video_bg} type="video/mp4" />
				</video>
				<div className="container">
					<div className="display-screen">
						<h1 className="text-center display-4">Login</h1>
						<form method="POST" onSubmit={this.handleSubmit}>
							<div className="form-group">
								<label htmlFor="username">Tên tài khoản</label>
								<input
									type="text"
									onChange={this.onChangeUsername}
									name="username"
									id="username"
									value={this.state.username}
									className="form-control"
									autoComplete="off"
									spellCheck="false"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="password">Mật khẩu</label>
								<input
									type="password"
									onChange={this.onChangePassword}
									name="password"
									id="password"
									value={this.state.password}
									className="form-control"
									autoComplete="off"
									spellCheck="false"
								/>
							</div>
							<div className="form-group submit">
								<button
									type="submit"
									className="btn btn-primary"
								>
									{this.state.isLogin
										? "Processsing"
										: "Login"}
								</button>
							</div>
							{this.state.errMessage.length !== 0 ? (
								<p>{this.state.errMessage}.</p>
							) : null}
							<div className="text-center">
								<Link
									to="/register"
									className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
								>
									Bạn chưa có tài khoản? Đăng ký nào!
								</Link>
							</div>
						</form>
					</div>
				</div>
			</section>
		);
	}
}

export default Login;
