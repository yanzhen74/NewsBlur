NEWSBLUR.Views.FeedNotificationView = Backbone.View.extend({
    
    events: {
        "click .NB-feed-notification-filter-unread": "toggle_unread",
        "click .NB-feed-notification-filter-focus" : "toggle_focus",
        "click .NB-feed-notification-email"        : "toggle_email",
        "click .NB-feed-notification-ios"          : "toggle_ios",
        "click .NB-feed-notification-android"      : "toggle_android",
        "click .NB-feed-notification-web"          : "toggle_web"
    },
    
    initialize: function(m) {
    },
        
    render: function() {
        var feed = this.model;
        var $feed = $(_.template('<div class="NB-feed-notification <% if (selected) { %>selected<% } %>">\
            <div class="NB-feed-notification-controls">\
                <ul class="segmented-control NB-feed-notification-filter">\
                    <li class="NB-feed-notification-filter-unread <% if (!is_focus) { %>NB-active<% } %>">\
                        <div class="NB-unread-icon"></div>\
                        Unread stories\
                    </li>\
                    <li class="NB-feed-notification-filter-focus  <% if (is_focus) { %>NB-active<% } %>">\
                        <div class="NB-focus-icon"></div>\
                        Focus\
                    </li>\
                </ul>\
                <ul class="segmented-control NB-feed-notification-types">\
                    <li class="NB-feed-notification-option NB-feed-notification-email <% if (is_email) { %>NB-active<% } %>">Email</li>\
                    <li class="NB-feed-notification-option NB-feed-notification-web <% if (is_web) { %>NB-active<% } %>">Web</li>\
                    <li class="NB-feed-notification-option NB-feed-notification-ios <% if (is_ios) { %>NB-active<% } %>">iOS</li>\
                    <li class="NB-feed-notification-option NB-feed-notification-android <% if (is_android) { %>NB-active<% } %>">Android</li>\
                </ul>\
            </div>\
            <img class="NB-feed-icon" src="<%= $.favicon(feed) %>">\
            <div class="NB-feed-title"><%= feed.get("feed_title") %></div>\
            <div class="NB-feed-frequency-icon"></div>\
            <div class="NB-feed-frequency"><%= frequency %></div>\
        </div>\
        ', {
          feed                : feed,
          selected            : this.options.selected,
          frequency           : feed && this.frequency(feed.get('average_stories_per_month')),
          frequency_count     : this.frequency_count(),
          is_email            : _.contains(feed.get('notification_types'), 'email'),
          is_ios              : _.contains(feed.get('notification_types'), 'ios'),
          is_android          : _.contains(feed.get('notification_types'), 'android'),
          is_web              : _.contains(feed.get('notification_types'), 'web'),
          is_focus            : feed.get('notification_filter') == 'focus'
        }));
        
        this.$el.replaceWith($feed);
        this.setElement($feed);
        
        return this;
    },
    
    frequency: function(count) {
        if (count == 0) {
            return "No stories published last month";
        } else if (count < 30) {
            return Inflector.pluralize("story", count, true) + " per month";
        } else if (count >= 30) {
            return Inflector.pluralize("story", Math.round(count / 30.0), true) + " per day";
        }
    },
    
    frequency_count: function() {
        var freq = this.model.get('notification_frequency');
        var story_count = this.model.get('stories_per_month') / 30.0;
        
        if (!freq) freq = 0;
        if (freq == 0) {
            return Inflector.pluralize("story", Math.ceil(story_count), true);
        } else if (freq < 24) {
            return Inflector.pluralize("story", Math.ceil(story_count), true);
        } else if (freq >= 24) {
            return Inflector.pluralize("story", story_count, true);
        }
    },
    
    // ==========
    // = Events =
    // ==========
    
    toggle_email: function() {
        this.toggle_type('email');
    },
    
    toggle_ios: function() {
        this.toggle_type('ios');
    },
    
    toggle_android: function() {
        this.toggle_type('android');
    },
    
    toggle_web: function() {
        this.toggle_type('web');
    },
    
    toggle_type: function(type) {
        var notification_types = this.model.get('notification_types') || [];
        var is_type = _.contains(notification_types, type);
        if (is_type) {
            notification_types.splice(notification_types.indexOf(type), 1);
        } else {
            notification_types.push(type);
        }
        this.model.set('notification_types', notification_types);
        
        this.save();
    },
    
    toggle_focus: function() {
        this.model.set('notification_filter', 'focus');
        
        this.save();
    },
    
    toggle_unread: function() {
        this.model.set('notification_filter', 'unread');
        
        this.save();
    },
    
    save: function() {
        NEWSBLUR.assets.set_notifications_for_feed(this.model, function() {
            
        });
        
        this.render();
    }
    
});