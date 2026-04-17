(function($) {
  'use strict';

  var ACTIONS = {
    blocks:     'blocks/update_remote_data',
    taxonomies: 'sync/taxonomies'
  };

  var STRINGS = {
    started: 'Sincronização iniciada',
    error:   'Erro ao iniciar a sincronização'
  };

  function noticeContainer() {
    var $inline = $('.iasd-sync-notices');
    return $inline.length ? $inline : $('#wpbody-content');
  }

  function showNotice(type, message) {
    var $container = noticeContainer();
    var $notice = $(
      '<div class="notice notice-' + type + ' is-dismissible">' +
        '<p></p>' +
        '<button type="button" class="notice-dismiss">' +
          '<span class="screen-reader-text">Dismiss this notice.</span>' +
        '</button>' +
      '</div>'
    );
    $notice.find('p').text(message);
    $notice.find('.notice-dismiss').on('click', function() { $notice.remove(); });

    if($container.hasClass('iasd-sync-notices')) {
      $container.empty().append($notice);
    } else {
      $container.prepend($notice);
    }
  }

  function fireSync(target) {
    return $.ajax({
      url:  window.ajaxurl,
      type: 'post',
      data: { action: ACTIONS[target] }
    });
  }

  function runSync(target, event) {
    if(event) event.preventDefault();

    var $btn = (event && event.currentTarget && $(event.currentTarget).is('button'))
      ? $(event.currentTarget)
      : $();
    var $spinner = $btn.length ? $btn.siblings('.spinner') : $();

    $btn.prop('disabled', true);
    $spinner.addClass('is-active');

    var requests = (target === 'all')
      ? [fireSync('blocks'), fireSync('taxonomies')]
      : [fireSync(target)];

    $.when.apply($, requests)
      .done(function() { showNotice('success', STRINGS.started); })
      .fail(function(jqXHR) {
        var msg = (jqXHR && jqXHR.statusText && jqXHR.statusText !== 'error')
          ? jqXHR.statusText
          : STRINGS.error;
        showNotice('error', msg);
      })
      .always(function() {
        $btn.prop('disabled', false);
        $spinner.removeClass('is-active');
      });
  }

  $(document).on('click', '[data-sync]', function(event) {
    runSync($(this).data('sync'), event);
  });

  // Backward-compatible globals for admin-bar onclick handlers.
  window.syncBlocks     = function(event) { runSync('blocks', event); };
  window.syncTaxonomies = function(event) { runSync('taxonomies', event); };
  window.syncRemoteData = function(event) { runSync('all', event); };
})(jQuery);
