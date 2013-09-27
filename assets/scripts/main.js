var app = app || {};
app.ENTER = 13;
app.Comment = Backbone.Model.extend({
initialize: function() {
		this.on('add', this.addHandler, this);
	},

	idAttribute: '_id',
	defaults: {
		name: '',
		like: '',
		text:'',
		creationDate: ''
		},

	urlRoot: 'http://localhost:9090/comments',

	addHandler: function() {

		if (this.isNew()) {
			this.set({
				creationDate: new Date()
			});
		}
	},

	addLike: function() {
		var likeN = this.get('like') - 0;
		likeN++;
		this.set({
			like: likeN
		});
	},

	addDislike: function() {
		var dislikeN = this.get('dislike') - 0;
		dislikeN++;
		this.set({
			dislike: dislikeN
		});
	}

});


app.Comments = Backbone.Collection.extend({
	model: app.Comment,
	url: 'http://localhost:9090/comments'
});


app.AddCommentView = Backbone.View.extend({
	initialize: function() {

	},

	events : {
		'click #btnAddComment': 'add',
	},

	initForm: function() {
		this.$('#appendedInputButton').val('');
		this.$('#appendedInputButton').focus();
		this.save();
	},

	add : function() {
		var comment = new app.Comment({
			name: this.$('#author').val(),
			text: this.$('#appendedInputButton').val()
		});

		this.collection.create(comment);
		this.initForm();
	}
});


app.CommentView = Backbone.View.extend({
	tagName: 'div',

	className: 'comment',

	events: {
		'click .upvote': 'like',
		'click .delete': 'remove'
	},


	template: _.template($('#comment-template').html()),

	initialize: function() {

		this.model.on('change', this.render, this);
	},

	render: function() {

		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},



	like: function() {
		this.model.addLike();
		this.model.save();
	},

	remove: function() {
		var that = this;
		this.model.destroy();

		this.$el.fadeOut('slow', function() {
			that.$el.remove();
		});
	}
});

app.AppView = Backbone.View.extend({
	initialize: function() {

		this.collection.on('add', this.addOneComment, this);
		this.collection.on('reset', this.addAllComments, this);
		this.render();
	},

	render: function() {

	app.addCommentView = new app.AddCommentView({
			collection: app.comments
		});
		app.addCommentView.setElement($('#btnAddComment'));
	},

	addAllComments: function() {
		var that = this;
		this.collection.each(that.addOneComment);
	},

	addOneComment: function(comment) {
		var commentV = new app.CommentView({
			model: comment
		});

		$('#comment_list').prepend(commentV.render().$el.fadeIn('slow'));
	}
});


(function() {
	app.comments = new app.Comments();

	app.appView = new app.AppView({
		collection: app.comments
	});


	app.comments.fetch();

}());

