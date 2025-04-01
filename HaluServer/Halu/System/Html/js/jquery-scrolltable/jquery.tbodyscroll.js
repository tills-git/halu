/**
 * tbodyScroll jQuery plugin
 * 
 * @version 1.0.0
 * @author Alex Efros <powerman-asdf@ya.ru>, http://powerman.name/, 2010
 * @license MIT
 * 
 * Add vertical scrollbar to <tbody> element and keep <thead> and <tfoot>
 * contents above/below table while scrolling body.
 */

/**
 * Add vertical scrollbar to <tbody>.
 * 
 * @param {Object}  options
 * @param {String}  [options.thead_height]  Height for <thead>, will be forced on 'thead th'
 * @param {String}  options.tbody_height    Height for <tbody>
 * @param {String}  [options.tfoot_height]  Height for <tfoot>, will be forced on 'tfoot th'
 * @param {String}  [options.head_bgcolor]  Header background-color (include scrollbar width)
 * @param {String}  [options.foot_bgcolor]  Footer background-color (include scrollbar width)
 * 
 * @returns {Object} jQuery object representing the element
 */
(function($) {
    $.fn.tbodyScroll = function( options ) {

        return this.each(function() {

            var $this   = $(this),
                inner   = $this.wrap('<div class="tbodyScroll-inner">').parent(),
                outer   = inner.wrap('<div class="tbodyScroll-outer">').parent(),
                thead_th= $this.find('thead th'),
                tfoot_th= $this.find('tfoot th');

            var settings = {
                thead_height: 0,
                tfoot_height: 0,
                head_bgcolor: thead_th.css('background-color'),
                foot_bgcolor: tfoot_th.css('background-color')
            };
            if( options )
                $.extend( settings, options );

						// 20151210 shimoji
            //outer.prepend('<div class="tbodyScroll-head-bg">');
            outer.prepend('<div class="tbodyScroll-foot-bg">');

            thead_th.height( settings.thead_height );
            tfoot_th.height( settings.tfoot_height );
            thead_th.css({ 'padding-top': 0, 'padding-bottom': 0 });
            tfoot_th.css({ 'padding-top': 0, 'padding-bottom': 0 });
            //if ($.browser.msie) // http://bugs.jquery.com/ticket/7417
            //    var horiz_spc = $this.find('thead')[0].currentStyle.borderSpacing.split(' ')[0];
            //else
                var horiz_spc = $this.find('thead').css('border-spacing').split(' ')[0];
            $this.find('thead').css({ 'border-spacing': horiz_spc+' 0px' });
            $this.find('tfoot').css({ 'border-spacing': horiz_spc+' 0px' });

            outer.css({
                'position':         'relative',
                'float':            'left',
                'padding-top':      settings.thead_height,
                'padding-bottom':   settings.tfoot_height,
                'padding-left':     0,
                'padding-right':    0
            });
            inner.css({
                'overflow-y':       'scroll',
                'overflow-x':       'hidden',
                'height':           settings.tbody_height
            });
            $this.find('thead').css({
                'position':         'absolute',
                'top':              0,
                'left':             0
            });
            $this.find('tfoot').css({
                'position':         'absolute',
                'bottom':           0,
                'left':             0
            });
            outer.find('.tbodyScroll-head-bg').css({
                'position':         'absolute',
                'top':              0,
                'left':             0,
                'right':            0,
                'height':           settings.thead_height,
                'background-color': settings.head_bgcolor
            });
            outer.find('.tbodyScroll-foot-bg').css({
                'position':         'absolute',
                'bottom':           0,
                'left':             0,
                'right':            0,
                'height':           settings.tfoot_height,
                'background-color': settings.foot_bgcolor
            });
            
            //if ($.browser.webkit) // https://bugs.webkit.org/show_bug.cgi?id=48975
                setTimeout(function(){$("<style></style>").appendTo("head").remove();}, 0);
            //if ($.browser.msie) // IE add scrollbar inside block [IE8]
            //    inner.css({ 'padding-right': 16 });

        });

    };
})( jQuery );
