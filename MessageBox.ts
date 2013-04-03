class MessageBox {
    private dragObject:HTMLElement; //временная переменная класса для хранения объекта перетаскивания
    private delta = []; //смещение курсора для плавного перетаскивания

    private docW = $(window).width();
    private docH = $(window).height();

    private maxW:number;
    private maxH:number;
    /*
    Конструктор получает jQuery-селектор
    показывает скрытый контейнер и позиционирует его по центру экрана
     */
    constructor() {
        this.createBox();
        this.initDragObject(".message-block-header");
    }
    /*
    Инициализация объекта перетаскивания,
    который записывается в this.DragObject
    */
    private initDragObject(obj):void {
        $(obj).mousedown((e) => {
            this.dragObject = $(obj).parent();

            this.delta['X']= e.clientX - this.dragObject.offset().left;
            this.delta['Y'] = e.clientY - this.dragObject.offset().top;

            this.maxW = this.dragObject.width() + 5;
            this.maxH = this.dragObject.height() + 5;

            this.startDrag();

            return false;
        });

        $(document, obj).mouseup((e) => {
            $(document).unbind('mousemove');
            this.dragObject = null;
        });
    }

    private startDrag():void {
        $(document).mousemove((e) => {
            this.dragObject.offset({
                top: e.clientY - this.delta['Y'],
                left: e.clientX - this.delta['X']
            });

            this.calculateBorders(this.dragObject, e);

            return false;
        });
    }
    /*
    Вычисляем границы экрана,
    чтобы перетаскиваемый объект не вылазил за границы.
    Принимает первым пар-ром jQuery-объект, вторым - объект-событие
    */
    private calculateBorders(target, e):void {
        var leftPosition = target.position().left;
        var topPosition = target.position().top;

        if(leftPosition + this.maxW >= this.docW) {
            target.offset({left:this.docW - this.maxW, top:e.clientY - this.delta['Y']});
        }
        if(topPosition + this.maxH >= this.docH) {
            target.offset({top:this.docH - this.maxH, left:e.clientX - this.delta['X']});
        }
        if(topPosition + this.maxH >= this.docH && leftPosition + this.maxW >= this.docW) {
            target.offset({top:this.docH - this.maxH, left:this.docW - this.maxW});
        }
        if(leftPosition <= 0) {
            target.offset({left:0, top:e.clientY - this.delta['Y']});
        }
        if(topPosition <= 0) {
            target.offset({top:0, left:e.clientX - this.delta['X']});
        }
        if(topPosition <= 0 && target.position().left <= 0) {
            target.offset({top:0, left:0});
        }
        if(leftPosition <= 0 && topPosition + this.maxH >= this.docH) {
            target.offset({left:0, top:this.docH - this.maxH});
        }
        if(topPosition <= 0 && leftPosition + this.maxW >= this.docW) {
            target.offset({top:0, left:this.docW - this.maxW});
        }
    }

    private initCloseEvent():void {
        $(".message-block-close, #message-block-bg").click(function() {
            $(".message-block").remove();
            $("#message-block-bg").remove();
        });
    }

    private createBox():void {
        $(document.body).prepend("<div id='message-block-bg'></div>");

        $("#message-block-bg").show();

        $("#message-block-bg").after(
            "<div class='message-block'>" +
            "<div class='message-block-header'>" +
            "<span class='message-block-header-text'></span><span class='message-block-close'>&#x2715;</span>" +
            "</div>" +
            "<div class='message-block-body'></div>" +
            "</div>");

        $(".message-block").show().offset({
            top: (this.docH / 2) - ($(".message-block-body").height(),
            left: (this.docW / 2) - ($(".message-block").width() / 2)
        });

        this.initCloseEvent();
    }

    public function setContent(headerTtext:string, bodyText:string, loadPage:bool): void {
        $(".message-block-header-text").html(headerTtext);

        if(!loadPage) {
            $(".message-block-body").html(bodyText);
        }
        else {
            $(".message-block-body").load(bodyText);
        }
    }
}