

App.Views.LoginView = Backbone.View.extend({

	el: '#login_form',

	initialize: function () {
		console.log('single login view created');
		
		this.render();
	},

	render: function () {
		var ejs           = require('ejs');

		var html = ejs({url:'/views/login'})

		this.$el.html(html);
	}

})