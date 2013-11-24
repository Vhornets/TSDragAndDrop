MessageBox modal
=============
Modal window with drag and drop. Might be used as minimalistic modal gallery with arrows keys to swtich images.
Usage: <br>
new MessageBox([Object object] options); <br>
[Object object] options: <br>
 header:    String  --- Header text <br>
 body:      String  --- Body content(static text or link to page which is load via AJAX <br>
 loadAJAX:  Boolean --- How to load body content: static content or via AJAX <br>
 draggable: Boolean --- Make modal window draggable or not <br>
---------------------------------------------------------------------------------------- <br>
Example: <br>
<pre>
element.onclick = function() { 
   new MessageBox({ 
       header: 'Hello',
       body: '2.html', 
       loadAJAX: true,
       draggable: true 
   });
}
 </pre>
