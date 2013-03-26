class MessageBox {
    private dragObject:HTMLElement; //временная переменная класса для хранения объекта перетаскивания
    private delta = new Array(); //смещение курсора для плавного перетаскивания
    private headerText:string;
    private bodyText:string;
    /*
    Конструктор получает jQuery-селектор
    показывает скрытый контейнер и позиционирует его по центру экрана
     */
    constructor() {
        this.createBox();
        this.initDragObject(".message-block-header");
        this.close();
    }
    /*
    Инициализация объекта перетаскивания,
    который записывается в this.DragObject
    */
    private initDragObject(obj):void {
        $(obj).mousedown((e) => {
            this.dragObject = $(obj).parent();
            this.delta['X']= e.clientX - $(obj).offset().left;
            this.delta['Y'] = e.clientY - $(obj).offset().top;
            this.dragObject.css({'opacity':'0.5'});
            this.startDrag();
            return false;
        });
        this.stopDrag();
    }

    private stopDrag():void {
        $(document).mouseup(() => {
            $(this.dragObject).css({'opacity':'1'});
            $(document).unbind('mousemove');
            this.dragObject = null;
        });
    }

    private startDrag():void {
        $(document).mousemove((e) => {
            this.dragObject.offset({top: e.clientY - this.delta['Y'], left: e.clientX - this.delta['X']});
        });
    }

    private close():void {
        $(".message-block-close").click(function() {
            $(".message-block").remove();
            $("#message-block-bg").remove();
        });
    }

    private createBox():void {
        $(document.body).prepend("<div id='message-block-bg'></div>");
        $("#message-block-bg").after(
            "<div class='message-block'>" +
            "<div class='message-block-header'>" +
            "<span class='message-block-header-text'></span><span class='message-block-close'>X</span>" +
            "</div>" +
            "<div class='message-block-body'></div>" +
            "</div>");
        $("#message-block-bg").show();
        $(".message-block").show();
        $(".message-block").offset({top: ($(document).height() / 2) - ($(".message-block").height() / 2), left: ($(document).width() / 2) - ($(".message-block").width() / 2)});
    }

    public setHeaderText(text:string) {
        this.headerText = text;
        $(".message-block-header-text").html(text);
    }

    public setBodyText(text:string) {
        this.bodyText = text;
        $(".message-block-body").html(text);
    }
}