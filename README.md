TSDragAndDrop
=============

Simple DragAndDrop TypeScript class

Простой класс для обкатывания синтаксиса свежего TypeScript. Дабы не плясать вокруг борьбы с проблемой различной интерпретации объекта-событие, использовался jQuery<br>
Выводит всплывающее окошко с сообщением. <br>
Использование(псевдокод):<br><br>
if (что-то произошло) {<br>
  var message = new MessageBox("название_jquery_селектора");<br>
  div.setHeaderText("Заголовок окна");<br>
  div.setBodyText("Тело окна. Можно использовать html-теги");<br>
}
