var MessageBox = (function () {
    function MessageBox(obj) {
        this.delta = new Array();
        $(obj).show();
        $(obj).offset({
            top: ($(document).height() / 2) - ($(obj).height() / 2),
            left: ($(document).width() / 2) - ($(obj).width() / 2)
        });
        $("#message-block-bg").show();
        this.initDragObject(obj);
        this.close();
    }
    MessageBox.prototype.initDragObject = function (obj) {
        var _this = this;
        $(obj).mousedown(function (e) {
            _this.dragObject = $(obj);
            _this.delta['X'] = e.clientX - $(obj).offset().left;
            _this.delta['Y'] = e.clientY - $(obj).offset().top;
            _this.dragObject.css({
                'position': 'absolute',
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
            _this.deltaX = null;
            _this.deltaY = null;
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
            $(this).parent().parent().hide();
            $("#message-block-bg").hide();
        });
    };
    return MessageBox;
})();
//@ sourceMappingURL=MessageBox.js.map
