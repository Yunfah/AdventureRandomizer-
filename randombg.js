// random bakgrund till index.html

    $(document).ready(function() {
        var images = ['img_1.jpg', 'img_2.jpg', 'img_3.jpg', 'img_4.jpg', 'img_5.jpg', 'img_6.jpg', 'img_7.jpg'];

        $('.jumbotron').css({'background-image': 'url(img/' + images[Math.floor(Math.random() * images.length)] + ')'});
    });
