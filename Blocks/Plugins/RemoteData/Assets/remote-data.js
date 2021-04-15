(function($, undefined) {
	var Field = acf.Field.extend({
		type: 'remote_data',
		events: {
			'keypress [data-filter]': 				'onKeypressFilter',
			'change [data-filter]': 				'onChangeFilter',
			'keyup [data-filter]': 					'onChangeFilter',
			'click [data-action="sticky"]': 		'onClickSticky',
			'click [data-action="refresh"]': 		'fetch',
		},
		
		$control: function() {
			return this.$('.acf-remote-data');
		},

		$stickyInput: function() {
			return this.$control().find('[data-sticky]');
		},

		$limitInput: function() {
			return this.$control().find('[data-limit]');
		},

		$valuesInput: function() {
			return this.$control().find('[data-values]');
		},
		
		$list: function() {
			return this.$('.values-list');
		},

		stickyItems: function() {
			return this.$stickyInput().val().split(',');
		},
		
		$listItems: function() {
			return this.$list().find('.acf-rel-item');
		},
		
		$listItem: function(id) {
			return this.$list().find('.acf-rel-item[data-id="' + id + '"]');
		},

		order: function() {
			var index = 0;

			this.$control().find('li').each(function() {
				var itemOrder = $(this).css('order');
				index = itemOrder < index ? itemOrder : index;
			});

			return index - 1;
		},
		
		// getValue: function(){
		// 	var val = [];
		// 	this.$listItems('values').each(function(){
		// 		val.push( $(this).data('id') );
		// 	});
		// 	return val.length ? val : false;
		// },
		
		// newChoice: function( props ){
		// 	return [
		// 	'<li>',
		// 		'<span data-id="' + props.id + '" class="acf-rel-item">' + props.text + '</span>',
		// 	'</li>'
		// 	].join('');
		// },
		
		// newValue: function( props ){
		// 	return [
		// 	'<li>',
		// 		'<input type="hidden" name="' + this.getInputName() + '[]" value="' + props.id + '" />',
		// 		'<span data-id="' + props.id + '" class="acf-rel-item">' + props.text,
		// 			'<a href="#" class="acf-icon -minus small dark" data-name="remove_item"></a>',
		// 		'</span>',
		// 	'</li>'
		// 	].join('');
		// },
		
		initialize: function() {
			this.set('limit', this.$limitInput().val());
			this.set('sticky', this.$stickyInput().val());

			// Delay initialization until "interacted with" or "in view".
			var delayed = this.proxy(acf.once(function() {
				// Avoid browser remembering old scroll position.
				this.$list('choices').scrollTop(0);
				
				// Fetch choices.
				this.fetch();
			}));
			
			// Bind "interacted with".
			this.$el.one('mouseover', delayed);
			this.$el.one('focus', 'input', delayed);
			
			// Bind "in view".
			acf.onceInView(this.$el, delayed);
		},
		
		onKeypressFilter: function(e, $el) {
			// don't submit form
			if(e.which == 13)
				e.preventDefault();
		},
		
		onChangeFilter: function(e, $el) {
			// vars
			var val = $el.val();
			var filter = $el.data('filter');
				
			// Bail early if filter has not changed
			if(this.get(filter) === val)
				return;
			
			// update attr
			this.set(filter, val);

			// search must go through timeout
			this.maybeFetch(filter);
		},
		
		// onClickAdd: function( e, $el ){
			
		// 	// vars
		// 	var val = this.val();
		// 	var max = parseInt( this.get('max') );
			
		// 	// can be added?
		// 	if( $el.hasClass('disabled') ) {
		// 		return false;
		// 	}
			
		// 	// validate
		// 	if( max > 0 && val && val.length >= max ) {
				
		// 		// add notice
		// 		this.showNotice({
		// 			text: acf.__('Maximum values reached ( {max} values )').replace('{max}', max),
		// 			type: 'warning'
		// 		});
		// 		return false;
		// 	}
			
		// 	// disable
		// 	$el.addClass('disabled');
			
		// 	// add
		// 	var html = this.newValue({
		// 		id: $el.data('id'),
		// 		text: $el.html()
		// 	});
		// 	this.$list('values').append( html )
			
		// 	// trigger change
		// 	this.$input().trigger('change');
		// },
		
		onClickSticky: function(e, $el) {
			// Prevent default here because generic handler wont be triggered.
			e.preventDefault();
			
			// vars
			var $span = $el.parent();
			var $li = $span.parent();
			var id = $span.data('id');
			var sticky = !$li.hasClass('-sticky');
			
			$li.toggleClass('-sticky', sticky);

			if(this.$stickyInput().val() == 0)
				this.$stickyInput().val('');

			$li.css('order', sticky ? this.order() : 0);

			if(sticky)
				this.$stickyInput().val(`${id},${this.$stickyInput().val()}`);
			else
				this.$stickyInput().val(this.$stickyInput().val().replace(`${id},`, ''));

			this.$stickyInput().val(this.$stickyInput().val().replace(/(\s*,?\s*)*$/, ''));
			this.set('sticky', this.$stickyInput().val());
		},
		
		maybeFetch: function(filter) {	
			// vars
			var timeout = this.get('timeout');
			
			// abort timeout
			if(timeout)
				clearTimeout(timeout);
			
		    // fetch
		    timeout = this.setTimeout(filter == 's' ? this.search : this.fetch, 300);
		    this.set('timeout', timeout);
		},
		
		getAjaxData: function() {
			// load data based on element attributes
			var ajaxData = this.$control().data();

			for(var name in ajaxData)
				ajaxData[name] = this.get(name);
			
			// extra
			ajaxData.action = 'acf/fields/remote_data/query';
			ajaxData.field_key = this.get('key');
			ajaxData.sticky = this.get('sticky');
			ajaxData.limit = this.get('limit');
			
			// Filter.
			ajaxData = acf.applyFilters('remote_data_ajax_data', ajaxData, this);
			
			// return
			return ajaxData;
		},
		
		fetch: function() {
			// abort XHR if this field is already loading AJAX data
			var xhr = this.get('xhr');
			if(xhr)
				xhr.abort();
			
			// add to this.o
			var ajaxData = this.getAjaxData();
			
			// clear html if is new query
			var $list = this.$list();
			$list.html('');
			
			// loading
			var $loading = $('<li class="-loading"><i class="acf-loading"></i> ' + acf.__('Loading') + '</li>');
			$list.append($loading);
			this.set('loading', true);
			
			// callback
			var onComplete = function() {
				this.set('loading', false);
				$loading.remove();
			};
			
			var onSuccess = function(json) {
				// no results
				if(!json || !json.results || !json.results.length) {
					// add message
					this.$list().append('<li>' + acf.__('No matches found') + '</li>');
	
					// return
					return;
				}

				// get new results
				var html = this.walkChoices(json.results);
				var $html = $(html);
				
				// append
				$list.append($html);
				this.$valuesInput().val(json.data);
			};
			
			// get results
		    var xhr = $.ajax({
		    	url:		acf.get('ajaxurl'),
				dataType:	'json',
				type:		'post',
				data:		acf.prepareForAjax(ajaxData),
				context:	this,
				success:	onSuccess,
				complete:	onComplete,
			});
			
			// set
			this.set('xhr', xhr);
		},

		getSearchData: function() {
			// load data based on element attributes
			var ajaxData = this.$control().data();

			for(var name in ajaxData)
				ajaxData[name] = this.get(name);
			
			// extra
			ajaxData.action = 'acf/fields/remote_data/search';
			ajaxData.field_key = this.get('key');
			
			// Filter.
			ajaxData = acf.applyFilters('remote_data_search_data', ajaxData, this);
			
			// return
			return ajaxData;
		},

		search: function() {
			// abort XHR if this field is already loading AJAX data
			var xhr = this.get('xhr');
			if(xhr)
				xhr.abort();
			
			// add to this.o
			var ajaxData = this.getAjaxData();
			
			// clear html if is new query
			var $list = this.$list();
			$list.html('');
			
			// loading
			var $loading = $('<li class="-loading"><i class="acf-loading"></i> ' + acf.__('Loading') + '</li>');
			$list.append($loading);
			this.set('loading', true);
			
			// callback
			var onComplete = function() {
				this.set('loading', false);
				$loading.remove();
			};
			
			var onSuccess = function(json) {
				// no results
				if(!json || !json.results || !json.results.length) {
					// add message
					this.$list().append('<li>' + acf.__('No matches found') + '</li>');
	
					// return
					return;
				}

				// get new results
				var html = this.walkChoices(json.results);
				var $html = $(html);
				
				// append
				$list.append($html);
				this.$valuesInput().val(json.data);
			};
			
			// get results
		    var xhr = $.ajax({
		    	url:		acf.get('ajaxurl'),
				dataType:	'json',
				type:		'post',
				data:		acf.prepareForAjax(ajaxData),
				context:	this,
				success:	onSuccess,
				complete:	onComplete,
			});
			
			// set
			this.set('xhr', xhr);
		},
		
		walkChoices: function(data) {
			var stickyItems = this.stickyItems();

			// walker
			var walk = function(data) {
				// vars
				var html = '';
				
				// is array
				if($.isArray(data))
					data.map(function(item) { html += walk(item); });
				// is item
				else if($.isPlainObject(data)) {
					var attrs = '';

					if(stickyItems.includes(data.id.toString()))
						attrs = ' class="-sticky"';

					html += '<li' + attrs + '><span class="acf-rel-item" data-id="' + acf.escAttr(data.id) + '"><a href="#" class="acf-icon -pin small dark acf-js-tooltip" data-action="sticky" title="Fixar/Desafixar item"></a>' + acf.escHtml(data.title.rendered) + '</span></li>';
				}
				
				// return
				return html;
			};
			
			return walk(data);
		}
		
	});
	
	acf.registerFieldType(Field);
})(jQuery);