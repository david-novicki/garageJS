(function () {
	var token = localStorage.getItem('token');
	function Garage() {
		$.ajax({
			beforeSend: function (req) {
				req.setRequestHeader('x-access-token', token)
			},
			url: "/api/garage",
			method: "POST",
			data: {
				// id: type,
				pass: $('#pass').val()
			}
		});
	}
})();
