var MessageBox = (function () {
    function MessageBox() {
        this.delta = new Array();
        this.createBox();
        this.initDragObject(".message-block-header");
        this.close();
    }
    MessageBox.prototype.initDragObject = function (obj) {
        var _this = this;
        $(obj).mousedown(function (e) {
            _this.dragObject = $(obj).parent();
            _this.delta['X'] = e.clientX - $(obj).offset().left;
            _this.delta['Y'] = e.clientY - $(obj).offset().top;
            _this.dragObject.css({
                'opacity': '0.5'
            });
            _this.startDrag();
            return false;
        });
        this.stopDrag();
    };
    MessageBox.prototype.stopDrag = function () {
        var _this = this;
        $(document).mouseup(function () {
            $(_this.dragObject).css({
                'opacity': '1'
            });
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
        });
    };
    MessageBox.prototype.close = function () {
        $(".message-block-close").click(function () {
            $(".message-block").remove();
            $("#message-block-bg").remove();
        });
    };
    MessageBox.prototype.createBox = function () {
        $(document.body).prepend("<div id='message-block-bg'></div>");
        $("#message-block-bg").after("<div class='message-block'>" + "<div class='message-block-header'>" + "<span class='message-block-header-text'></span><span class='message-block-close'>X</span>" + "</div>" + "<div class='message-block-body'></div>" + "</div>");
        $("#message-block-bg").show();
        $(".message-block").show();
        $(".message-block").offset({
            top: ($(document).height() / 2) - ($(".message-block").height() / 2),
            left: ($(document).width() / 2) - ($(".message-block").width() / 2)
        });
    };
    MessageBox.prototype.setHeaderText = function (text) {
        this.headerText = text;
        $(".message-block-header-text").html(text);
    };
    MessageBox.prototype.setBodyText = function (text) {
        this.bodyText = text;
        $(".message-block-body").html(text);
    };
    return MessageBox;
})();
//@ sourceMappingURL=MessageBox.js.map
