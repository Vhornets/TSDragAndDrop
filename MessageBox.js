var MessageBox = (function () {
    function MessageBox() {
        this.delta = new Array();
        this.docW = $(document).width();
        this.docH = $(document).height();
        this.createBox();
        this.initDragObject(".message-block-header");
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
        if(target.position().left + this.maxW >= this.docW) {
            target.offset({
                left: this.docW - this.maxW,
                top: e.clientY - this.delta['Y']
            });
        }
        if(target.position().top + this.maxH >= this.docH) {
            target.offset({
                top: this.docH - this.maxH,
                left: e.clientX - this.delta['X']
            });
        }
        if(target.position().top + this.maxH >= this.docH && target.position().left + this.maxW >= this.docW) {
            target.offset({
                top: this.docH - this.maxH,
                left: this.docW - this.maxW
            });
        }
        if(target.position().left <= 0) {
            target.offset({
                left: 0,
                top: e.clientY - this.delta['Y']
            });
        }
        if(target.position().top <= 0) {
            target.offset({
                top: 0,
                left: e.clientX - this.delta['X']
            });
        }
        if(target.position().top <= 0 && target.position().left <= 0) {
            target.offset({
                top: 0,
                left: 0
            });
        }
    };
    MessageBox.prototype.initCloseEvent = function () {
        $(".message-block-close").click(function () {
            $(".message-block").remove();
            $("#message-block-bg").remove();
        });
    };
    MessageBox.prototype.createBox = function () {
        $(document.body).prepend("<div id='message-block-bg'></div>");
        $("#message-block-bg").after("<div class='message-block'>" + "<div class='message-block-header'>" + "<span class='message-block-header-text'></span><span class='message-block-close'>X</span>" + "</div>" + "<div class='message-block-body'></div>" + "</div>");
        $("#message-block-bg").show();
        $(".message-block").show().offset({
            top: (this.docH / 2) - ($(".message-block").height() / 2),
            left: (this.docW / 2) - ($(".message-block").width() / 2)
        });
        this.initCloseEvent();
    };
    MessageBox.prototype.setContent = function (headerTtext, bodyText) {
        $(".message-block-header-text").html(headerTtext);
        $(".message-block-body").html(bodyText);
    };
    return MessageBox;
})();
//@ sourceMappingURL=MessageBox.js.map
