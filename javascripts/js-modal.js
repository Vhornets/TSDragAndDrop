/* MessageBox by Victor Hornets
 * No-jQuery version
 * 2013
 * ----------------------------------------------------------------------------------------
 * http://vh-m.net/
 * https://github.com/Vhornets
 * ----------------------------------------------------------------------------------------
 * Usage:
 * new MessageBox([Object object] options);
 * options:
 *      header:      String   ---  Header text
 *      body:        String   ---  Body content(static text or link to page which is load via AJAX
 *      loadAJAX:    Boolean  ---  How to load body content: static content or via AJAX
 *      draggable:   Boolean  ---  Make modal window draggable or not
 *      galleryMode: Boolean  ---  Set modal window to gallery mode
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
            _this.utils.getElementByClass('message-block-header').style.cursor = '';
        }

        boxHeader.onmousedown = function(e) {
            e = window.event || e;
            _this.utils.getElementByClass('message-block-header').style.cursor = 'move';
            _this.dragObject = boxBody;
            var style = _this.utils.getStyle(_this.dragObject);
            var offset = {
                left: _this.dragObject.offsetLeft,
                top: _this.dragObject.offsetTop
            }
            _this.delta['X'] = e.clientX - offset.left;
            _this.delta['Y'] = e.clientY - offset.top;
            _this.maxW = parseInt(style.width.substr(0,3), 10);
            _this.maxH = parseInt(style.height.substr(0,3), 10);
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

        function destroyModal() {
            document.body.removeChild(_this.utils.getElementByClass('message-block'));
            document.body.removeChild(document.getElementById('message-block-bg'));
        }

        this.utils.getElementByClass('message-block-close').onclick =  document.getElementById('message-block-bg').onclick = function(e) {
            destroyModal();
        };

        document.body.onkeydown = function(e) {
            e = e || window.event;

            if(e.keyCode == 27) {
                destroyModal();
                document.body.onkeydown = null;
            }
        };
    };

    MessageBox.prototype.createBox = function () {
        var bg = document.createElement('div'),
            messageBlock = document.createElement('div');

        bg.id = 'message-block-bg';
        messageBlock.className = 'message-block';
        messageBlock.innerHTML =  "<div class='message-block-header'>" +
                                     "<span class='message-block-header-text'></span><span class='message-block-close'>&times;</span>" +
                                     "</div>" + "<div class='message-block-body'></div>";

        if(this.docW <= 700) {
            messageBlock.style.width = 500 + 'px';
        }

        document.body.insertBefore(bg, document.body.firstChild);
        document.body.insertBefore(messageBlock, document.getElementById('message-block-bg'));

        this.initCloseEvent();
    };

    MessageBox.prototype.setContent = function(opts) {
        var blockBody = this.utils.getElementByClass('message-block');

        this.utils.getElementByClass('message-block-header-text').innerHTML = opts.header;

        if(opts.draggable) {
            this.initDragObject();
        }

        if(!opts.loadAJAX) {
            this.utils.getElementByClass('message-block-body').innerHTML = opts.body;
        }

        else {
            var _this = this;
            blockBody.style.height = '96%';
            blockBody.style.width = '60%';

            blockBody.style.top = '10px';

            this.utils.loadAJAX(opts.body, function(responce) {
                _this.utils.getElementByClass('message-block-body').innerHTML = responce;
            });
        }

        this.setCenter();
    };

    MessageBox.prototype.setCenter = function() {
        var blockBody = this.utils.getElementByClass('message-block');
        var style = this.utils.getStyle(blockBody);

        if(this.utils.IE() < 9) {
            blockBody.style.width = '700px';
            blockBody.style.left = Math.round(this.docW / 2) - Math.round(style.width.substr(0,3)/2) + 'px';
            blockBody.style.top = 0;
            return;
        }

        blockBody.style.left = Math.round(this.docW / 2) - Math.round(style.width.substr(0,3)/2) + 'px';
        blockBody.style.top = Math.round(this.docH / 2) - Math.round(style.height.substr(0,3)/2) + 'px';
    };

    MessageBox.prototype.initGallery = function(containerId) {
        var images = document.getElementById(containerId).getElementsByTagName('img');
        var totalImages = images.length - 1;
        var curImg = 0;
        var _this = this;

        function set() {
            _this.utils.getElementByClass('message-block-body').innerHTML = images[curImg].outerHTML;
            _this.utils.getElementByClass('message-block-header-text').innerHTML = images[curImg].getAttribute('alt') + ' (' + parseInt(curImg + 1) + '/' + parseInt(totalImages + 1) + ')';
            _this.setCenter();

        }

        set();

        document.body.onkeydown = function(e) {
            e = e || window.event;
            if(e.keyCode == 39) {
                curImg = curImg + 1;
                if(curImg > totalImages) curImg = 0;
                set();
            }
            if(e.keyCode == 37) {
                curImg = curImg - 1;
                if(curImg < 0) curImg = totalImages;
                set();
            }
        }
        this.setCenter();

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

                else throw 'AJAX error';
            };

            xhr.send('');
        },

        // IE sniffer by James Padolsey
        IE: function() {
            var undef,
                v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');

            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );

            return v > 4 ? v : undef;
        }
    };

    return MessageBox;
})();
