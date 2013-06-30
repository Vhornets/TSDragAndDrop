/* MessageBox by Victor Hornets
 * 2013
 * ----------------------------------------------------------------------------------------
 * http://vh-m.net/
 * https://github.com/Vhornets
 * ----------------------------------------------------------------------------------------
 * Usage:
 * new MessageBox([Object object] options);
 * [Object object] options:
 *  header:    String  --- Header text
 *  body:      String  --- Body content(static text or link to page which is load via AJAX
 *  loadAJAX:  Boolean --- How to load body content: static content or via AJAX
 *  draggable: Boolean --- Make modal window draggable or not
 * ----------------------------------------------------------------------------------------
 * Example:
 * element.onclick = function() {
 *    new MessageBox({
 *        header: 'Hello',
 *        body: '2.html',
 *        loadAJAX: true,
 *        draggable: true
 *    });
 *}
* ----------------------------------------------------------------------------------------
DOM manipulations made with jQuery, so jQuery may be included in your document
*/

var MessageBox = (function () {
    function MessageBox(opts) {
        this.delta = [];
        this.docW = $(window).width();
        this.docH = $(window).height();
        this.createBox();
        this.setContent(opts);        
    }
    
    MessageBox.prototype.initDragObject = function (obj) {
        var _this = this;
        
        $(obj).mousedown(function (e) {
            _this.dragObject = $(obj).parent();
            _this.delta['X'] = e.clientX - _this.dragObject.offset().left;
            _this.delta['Y'] = e.clientY - _this.dragObject.offset().top;
            _this.maxW = _this.dragObject.width() + 5;
            _this.maxH = _this.dragObject.height() + 5;
            _this.startDrag();
            
            return false;
        });
        
        $(document, obj).mouseup(function (e) {
            $(document).unbind('mousemove');
            _this.dragObject = null;
        });
    };
    
    MessageBox.prototype.startDrag = function () {
        var _this = this;
        
        $(document).mousemove(function (e) {
            _this.dragObject.offset({
                top: e.clientY - _this.delta['Y'],
                left: e.clientX - _this.delta['X']
            });
            
            _this.calculateBorders(_this.dragObject, e);
            
            return false;
        });
    };
    
    MessageBox.prototype.calculateBorders = function (target, e) {
        var leftPosition = target.position().left;
        var topPosition = target.position().top;
        if(leftPosition + this.maxW >= this.docW) {
            target.offset({
                left: this.docW - this.maxW,
                top: e.clientY - this.delta['Y']
            });
        }
        if(topPosition + this.maxH >= this.docH) {
            target.offset({
                top: this.docH - this.maxH + $(window).scrollTop(),
                left: e.clientX - this.delta['X']
            });
        }
        if(topPosition + this.maxH >= this.docH && leftPosition + this.maxW >= this.docW) {
            target.offset({
                top: this.docH - this.maxH + $(window).scrollTop(),
                left: this.docW - this.maxW
            });
        }
        if(leftPosition <= 0) {
            target.offset({
                left: 0,
                top: e.clientY - this.delta['Y']
            });
        }
        if(topPosition <= 0) {
            target.offset({
                top: 0 + $(window).scrollTop(),
                left: e.clientX - this.delta['X']
            });
        }
        if(topPosition <= 0 && target.position().left <= 0) {
            target.offset({
                top: 0 + $(window).scrollTop(),
                left: 0
            });
        }
        if(leftPosition <= 0 && topPosition + this.maxH >= this.docH) {
            target.offset({
                left: 0,
                top: this.docH - this.maxH + $(window).scrollTop()
            });
        }
        if(topPosition <= 0 && leftPosition + this.maxW >= this.docW) {
            target.offset({
                top: 0 + $(window).scrollTop(),
                left: this.docW - this.maxW
            });
        }
    };
    
    MessageBox.prototype.initCloseEvent = function () {
        $(".message-block-close, #message-block-bg").click(function () {
            $(".message-block, #message-block-bg").remove();
        });
    };
    
    MessageBox.prototype.createBox = function () {
        $(document.body).prepend("<div id='message-block-bg'></div>");
        $("#message-block-bg").after("<div class='message-block'>" + 
                                     "<div class='message-block-header'>" + 
                                     "<span class='message-block-header-text'></span><span class='message-block-close'>&#x2715;</span>" + 
                                     "</div>" + "<div class='message-block-body'></div>" + "</div>");
        $(".message-block").offset({
            top: (this.docH / 2) - ($(".message-block").height() / 2) + $(window).scrollTop(),
            left: (this.docW / 2) - ($(".message-block").width() / 2)
        })        
        .css({height: 'auto'});

        this.initCloseEvent();
    };
    
    MessageBox.prototype.setContent = function (opts) {
        $(".message-block-header-text").html(opts.header);

        if(opts.draggable) {
            this.initDragObject(".message-block-header");
        }
        
        if(!opts.loadAJAX) {
            $(".message-block-body").html(opts.body);
        } 
        
        else {
            $(".message-block").css({height: '96%'});

            $.ajax({
                url: opts.body,
                cache: false,
                success: function(data) {
                    $(".message-block-body").html(data);
                }
            });
        }
        
        $(".message-block").show('slow');
    };
    
    return MessageBox;
})();