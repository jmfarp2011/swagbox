/**
* Created with swagbox.
* User: jmfarp2011
* Date: 2015-05-01
* Time: 05:56 AM
* To change this template use Tools | Templates.
*/
(function ( $ ) {
  var _swagcallback;
  $.fn.swagbox = function(text) {
    function parseTags(text) {
      var tags = text.match(/[\#\^\@]([A-Z])[\w\:]+(?=\s|,|\.|$)/igm);

      tags.sort(function(a, b) {
        return a.substring(1).toLowerCase() > b.substring(1).toLowerCase() ? 1 : -1;
      });

      tags.forEach(function(e, i, a) {
        switch (tags[i].charAt(0)) {
          case '@':
            tags[i] = {
              type: 'mention',
              text: tags[i].replace(/@/, '')
            };
            break;
          case '#':
            tags[i] = {
              type: 'hashtag',
              text: tags[i].replace(/\#/, '').replace(/\_/, ' ')
            };
            break;
          case '^':
            var keyval = tags[i].replace(/\^/, '').split(':');
            tags[i] = {
              type: 'swag',
              text: {
                key: keyval[0],
                val: keyval[1]
              }
            };
            if (!!_swagcallback) {
              var pair = {};
              pair[keyval[0]]=keyval[1];
              _swagcallback.call(this, pair);
            }
            break;
        }
      });

      return tags;
    }

    function displayTags() {
      var $this = $(this),
        tags = parseTags($this.val()),
        cachedTags = $this.data('tags');

      if (!cachedTags || ($(cachedTags).not(tags).length !== 0 && $(tags).not(cachedTags).length !== 0)) {
        var $tagList = $this.siblings('div.tagList')
        $this.data('tags', tags);

        if ($tagList.length < 1) {
          $tagList = $('<div class="tagList"></div>');
          $tagList.insertAfter($this);
        }

        $tagList.text('');

        function hashtag(tag) {
          $tagList.append(
            $('<span class="tag hashtag"></span>')
            .text(tag)
            .data('type', 'hashtag')
            .append(
              $('<a href="javascript:void(0)" class="close"></a>')
            )
          );
        }

        function mention(tag) {
          $tagList.append(
            $('<span class="tag mention"></span>')
            .text(tag)
            .data('type', 'mention')
            .append(
              $('<a href="javascript:void(0)" class="close"></a>')
            )
          );
        }

        function swag(tag) {
          $tagList.append(
            $('<span class="tag swag"></span>')
            .text(tag.key + ' = ' + tag.val)
            .data('type', 'swag')
            .data('key', tag.key)
            .data('val', tag.val)
            .append(
              $('<a href="javascript:void(0)" class="close"></a>')
            )
          );
        }

        tags.forEach(function(e, i, a) {
          var tag = a[i];
          switch (tag.type) {
            case 'hashtag':
              hashtag(tag.text);
              break;
            case 'mention':
              mention(tag.text);
              break;
            case 'swag':
              swag(tag.text);
              break;
          }
        });

        $('a.close').on('click', function() {
          var $tag = $(this).parent(),
            type = $tag.data('type'),
            $swagbox = $tag.parent().prev('.swagbox'),
            tags = $swagbox.data('tags');

          switch (type) {
            case 'hashtag':
              var text = $tag.text();
              $swagbox.val($swagbox.val().replace('#' + text.replace(' ', '_'), text));
              break;
            case 'mention':
              var text = $tag.text();
              $swagbox.val($swagbox.val().replace('@' + text, text.replace('_', ' ')));
              break;
            case 'swag':
              var key = $tag.data('key'),
                val = $tag.data('val'),
                text = key + ':' + val;
              $swagbox.val($swagbox.val().replace('^' + text, text.replace(':', ' ').replace('_', ' ')));
              break;
          }
          $tag.detach();
        });
      }
    }

    $(this)
      .on('change', displayTags)
      .val(text)
      .addClass('swagbox');

    displayTags.call(this);
  	return this;
  };
  
  $.fn.swagbox.onSwagtag = function(cb){
    _swagcallback = cb;
  };
}( jQuery ));