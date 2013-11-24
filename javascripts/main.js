window.onload = function() {
    var cl = document.getElementById("cl");
    cl.onclick = function() {
        new MessageBox({
            header: 'Hello',
            body: '2.html',
            loadAJAX: true,
            draggable: true
        });
    }

    var images = document.getElementsByTagName('img');
    for(var i = 0; i<images.length; i++) {
        images[i].onclick = function() {
           new MessageBox({
                header: this.getAttribute('alt'),
                body: "<img src='" + this.src + "' width='300' />",
                loadAJAX: false,
                draggable: true
            });
        }
    }

    document.getElementById('gallery').onclick = function() {
        new MessageBox({
                header: this.getAttribute('alt'),
                body: '',
                loadAJAX: false,
                draggable: true          
        })
		.initGallery('MBGallery');
    }
}