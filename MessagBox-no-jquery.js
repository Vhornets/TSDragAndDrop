/* MessageBox by Victor Hornets
 * No-jQuery version
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
*/
var MessageBox = (function () {
    function MessageBox(opts) {
        this.delta = [];
        this.docW = document.documentElement.clientWidth;
        this.docH = document.documentElement.clientHeight;
        this.createBox();
        this.setContent(opts);
    }
    
    MessageBox.prototype.initDragObject = function () {
        var _this = this;
        var boxHeader = this.utils.getElementByClass('message-block-header');        
        var boxBody = this.utils.getElementByClass('message-block'); 
        var resetDrag = function() {
            _this.dragObject = null;
            document.body.onmousemove = null;
        }

        boxHeader.onmousedown = function(e) {
            e = window.event || e;
            _this.dragObject = boxBody;
            var style = _this.utils.getStyle(_this.dragObject);
            var offset = {
                left: _this.dragObject.offsetLeft,
                top: _this.dragObject.offsetTop
            }            
            _this.delta['X'] = e.clientX - offset.left;
            _this.delta['Y'] = e.clientY - offset.top;
            _this.maxW = style.width + 5;
            _this.maxH = style.height + 5;
            _this.startDrag();
            
            return false;
        };

        boxHeader.onmouseup = document.body.onmouseup = resetDrag;
    };
    
    MessageBox.prototype.startDrag = function () {
        var _this = this;

        document.body.onmousemove = function(e) {
            e = window.event || e;
            _this.dragObject.style.top = e.clientY - _this.delta['Y'] + 'px';
            _this.dragObject.style.left = e.clientX - _this.delta['X'] + 'px';
            _this.calculateBorders(_this.dragObject, e);
            
            return false;
        };
    };
    
    MessageBox.prototype.calculateBorders = function (target, e) {
        e = window.event || e;
        //var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        var leftPosition = target.offsetLeft;
        var topPosition = target.offsetTop;

        if(leftPosition + this.maxW >= this.docW) {
            target.style.left = this.docW - this.maxW + 'px';
            target.style.top = e.clientY - this.delta['Y'] + 'px';
        }
        if(topPosition + this.maxH >= this.docH) {
            target.style.left = e.clientX - this.delta['X'] + 'px';
            target.style.top = this.docH - this.maxH + /*scrollTop*/ + 'px';
        }
        if(topPosition + this.maxH >= this.docH && leftPosition + this.maxW >= this.docW) {
            target.style.left = this.docW - this.maxW + 'px';
            target.style.top = this.docH - this.maxH + /*scrollTop*/ + 'px';
        }
        if(leftPosition <= 0) {
            target.style.left = 0;
            target.style.top = e.clientY - this.delta['Y'] + 'px';
        }
        if(topPosition <= 0) {
            target.style.left = e.clientX - this.delta['X'];
            target.style.top = 0 + /*scrollTop*/ + 'px';
        }
        if(topPosition <= 0 && leftPosition <= 0) {
            target.style.left = 0;
            target.style.top = 0 + /*scrollTop*/ + 'px';
        }
        if(leftPosition <= 0 && topPosition + this.maxH >= this.docH) {
            target.style.left = 0;
            target.style.top = this.docH - this.maxH + /*scrollTop*/ + 'px';
        }
        if(topPosition <= 0 && leftPosition + this.maxW >= this.docW) {
            target.style.left = this.docW - this.maxW + 'px';
            target.style.top = 0 + /*scrollTop*/ + 'px';
        }
    };
    
    MessageBox.prototype.initCloseEvent = function () {
        var _this = this;
        this.utils.getElementByClass('message-block-close').onclick = document.getElementById('message-block-bg').onclick = function() {
            document.body.removeChild(_this.utils.getElementByClass('message-block'));
            document.body.removeChild(document.getElementById('message-block-bg'));
        };
    };
    
    MessageBox.prototype.createBox = function () {
        var bg = document.createElement('div'),
            messageBlock = document.createElement('div');
    
        bg.id = 'message-block-bg';
        messageBlock.className = 'message-block';
        messageBlock.innerHTML =  "<div class='message-block-header'>" + 
                                     "<span class='message-block-header-text'></span><span class='message-block-close'>&#x2715;</span>" + 
                                     "</div>" + "<div class='message-block-body'></div>";

        document.body.insertBefore(bg, document.body.firstChild);
        document.body.insertBefore(messageBlock, document.getElementById('message-block-bg'));
        var style = this.utils.getStyle(this.utils.getElementByClass('message-block'));

        this.utils.getElementByClass('message-block').style.left = (this.docW / 2) - (style.width.substr(0,3)/2) + 'px';
        this.utils.getElementByClass('message-block').style.top = (this.docH / 2) - (style.height.substr(0,3)/2) + 'px';

        this.initCloseEvent();
    };
    
    MessageBox.prototype.setContent = function (opts) {
        this.utils.getElementByClass('message-block-header-text').innerHTML = opts.header;

        if(opts.draggable) {
            this.initDragObject();
        }
        
        if(!opts.loadAJAX) {
            this.utils.getElementByClass('message-block-body').innerHTML = opts.body;
        } 
        
        else {
            var _this = this;
            this.utils.getElementByClass('message-block').style.height = '96%';
            this.utils.getElementByClass('message-block').style.top = '10px';

            this.utils.loadAJAX(opts.body, function(responce) {
                _this.utils.getElementByClass('message-block-body').innerHTML = responce;
            });
        }
    };

    MessageBox.prototype.utils = {
        getElementByClass: function(classN) {
            if (document.getElementsByClassName) return document.getElementsByClassName(classN)[0];
            else {
                var DOM    = document.getElementsByTagName('*'),
                    length = DOM.length,
                    i      = 0;

                    for(i; i < length; i++) {
                        if(DOM[i].className === classN) {
                            return DOM[i];
                        }
                    }
            }
        },

        getStyle: function(elem) {
            return window.getComputedStyle ? getComputedStyle(elem, '') : elem.currentStyle;
        },

        loadAJAX: function(addr, callback) {
            var xhr = new XMLHttpRequest(),
                _this = this;

            xhr.open('GET', addr, true);

            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    callback(xhr.responseText);
                }

                else return;
            };

            xhr.send('');
        }
    };
    
    return MessageBox;
})();