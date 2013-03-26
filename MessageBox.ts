class MessageBox {
    private dragObject:HTMLElement; //временная переменная класса для хранения объекта перетаскивания
    private delta = new Array(); //смещение курсора для плавного перетаскивания
    private headerText:string;
    private bodyText:string;

    /*
    Конструктор получает jQuery-селектор
    показывает скрытый контейнер и позиционирует его по центру экрана
     */
    constructor(obj) {
        $(obj).show();
        $(obj).offset({top: ($(document).height() / 2) - ($(obj).height() / 2), left: ($(document).width() / 2) - ($(obj).width() / 2)});
        $(document.body).prepend("<div id='message-block-bg'></div>");
        $("#message-block-bg").show();

        this.initDragObject(obj);
        this.close();
    }

    /*
    Инициализация объекта перетаскивания,
    который записывается в this.DragObject
    */
    private initDragObject(obj):void {
        $(obj).mousedown((e) => {
            this.dragObject = $(obj);
            this.delta['X']= e.clientX - $(obj).offset().left;
            this.delta['Y'] = e.clientY - $(obj).offset().top;
            this.dragObject.css({'position':'absolute', 'opacity':'0.5'});
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
            this.deltaX = null;
            this.deltaY = null;
        });
    }

    private startDrag():void {
        $(document).mousemove((e) => {
            this.dragObject.offset({top: e.clientY - this.delta['Y'], left: e.clientX - this.delta['X']});
        });
    }

    private close():void {
        $(".message-block-close").click(function() {
            $(this).parent().parent().hide();
            $("#message-block-bg").hide();
        });
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