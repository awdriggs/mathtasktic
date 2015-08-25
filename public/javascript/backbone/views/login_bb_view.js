

App.Views.LoginView = Backbone.View.extend({

	el: '#login_form',
	template: _.template(app.templates.view),
	initialize: function () {
		console.log('single login view created');
		
		this.render();
	},

	render: function () {
		
		var html = new EJS({url:'/javascript/backbone/views/login.ejs'})

		this.$el.html(html);
	}

})