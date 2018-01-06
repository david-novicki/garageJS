(function () {
	function Login() {
		$.ajax({
			url: "/authenticate",
			method: "Post",
			data: {
				username: $('#inputUsername').val(),
				password: $('#inputPassword').val(),
				remember: $('#chkRemember').val()
			},
			success: function (data) {
				localStorage.setItem('token', data.token);
				window.location.href = data.redirect;
			},
			error: function (err) {
				console.log(err);
			}
		});
	}
})();