$(function () {

    // header width control section
    if ($(".bt-home").length) {
        $(".sticky").addClass('max_width')
    } else {
        $(".sticky").removeClass('max_width')
    }

    // user menu
    var $userMenuTrigger = $('.bt-header__user'),
        $userMenu = $('.bt-header__user__menu')

    if ($userMenuTrigger.length) {
        $userMenuTrigger.click(function (e) {
            $userMenu.toggleClass('bt--active');
        });
    }

    if ($(".text_slider").length) {
        // slide show
        var slick_options = {
            dots: true,
            infinite: true,
            arrows: true,
            autoplay: false,
            autoplayspeed: 13000,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            prevArrow: $(".left"),
            nextArrow: $(".right")
        };
        $(".text_slider").slick(slick_options);
    }

    if ($(".main_image_title").length) {
        var home_slick_options = {
            dots: false,
            infinite: true,
            arrows: true,
            autoplay: true,
            autoplayspeed: 8000,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            prevArrow: '<img class="slick-left-white" src="/images/left.png" />',
            nextArrow: '<img class="slick-right-white" src="/images/right.png" />'
        };

        $(".main_image_title").slick(home_slick_options);

        $(".main_image_title .slide-item").click(function () {
            var link = $(this).find("img").data("link");
            location.href = link;
        });
    }

    if ($(".select_item").length) {
        $(".select_item").click(function () {
            $('.select_item').each(function () {
                $(this).removeClass('active');
            });
            $('.select_item').each(function () {
                $('.select_item').removeClass('_active');
            });

            $(this).addClass('active');
            $(this).find('.detail').addClass('_active');
        })
    }

    if ($(".read_btn").length) {
        $(".read_btn").mousedown(function () {
            $(this).addClass('active_btn');
        })
        $(".read_btn").mouseup(function () {
            $(this).removeClass('active_btn');
        });
    }

    if ($('.all-view').length) {
        var view_all = false;
        $('.all-view').click(function () {
            if (view_all) {
                $('.all-view').text("VIEW ALL");
                view_all = false;
            } else {
                $('.all-view').text("VIEW LESS");
                view_all = true;
            }
            $(".popular-item.more").each(function () {
                $(this).toggle();
            })
        });
    }

    if ($(".bt-home").length) {
        $.get('/api/v1/students/assignments', function (data) {
            const createTile = function (tile, i) {
                var $tile_container = $('<div />').addClass('bt-home-marquee__item apos-slideshow-item').attr('data-index', i);
                $tile_container.append($('<img />').attr('data-image', true).attr('src', tile.articleImage));

                var $tile = $('<div />').addClass('bt-inner home-slick-slide-text');

                $tile.css('background-image', 'url(' + tile.articleImage + ')');
                $tile.css('background-size', 'cover');

                const path = '/articles/' + tile.articleSlug;
                var $text = $('<div />').addClass('bt-home-marquee__item__body');
                $text.append($('<div />').addClass('bt-home-marquee__item__title bt-color--white mb3 bt--heavy').text(tile.name));
                $text.append($('<div />').addClass('bt-home-marquee__item__subtitle bt-color--white').text('Assigned to You'));
                const $read_btn = $('<a />').addClass('bt-button').attr('href', path).html($('<span />').text('Read It'));
                $read_btn.append($('<span />'));
                const $read_btn_container = $('<div />').addClass('bt-home-marquee__item__button').html($read_btn);
                $text.append($read_btn_container);
                $tile.append($text);
                $tile_container.append($tile);
                return $tile_container;
            };

            if (data.results.length) {
                var i = $(".slick-slide").length;
                while (i--) {
                    $(".main_image_title").slick('slickRemove', i);
                }

                data.results.forEach(function (result, idx) {
                    var $tile = createTile(result, idx);
                    $(".main_image_title").slick('slickAdd', $tile);
                });
            }
        });
    }

//redirect URL when login success.
//   var currentURL =  window.location.href;
//   var previousURL = localStorage.getItem("URL");
//
//   var loginFlag = apos.user ? true : false;
//   var hadUser = localStorage.getItem('hasUser') || 'false';
//   if (currentURL != previousURL && currentURL.indexOf("login") < 0 && currentURL.indexOf('teachers-portal') < 0) {
//       if (loginFlag && previousURL && hadUser !== 'false' && !hadUser) {
//           document.location.href = previousURL;
//           currentURL = previousURL;
//           localStorage.setItem('hasUser', 'true');
//       }
//       if(!loginFlag) {
//           localStorage.setItem('hasUser', 'false');
//       }
//       localStorage.setItem("URL", currentURL);
//   }

    // Text highlight
    var highlight_flag = false;
    $('#highlight-icon-1').hide();
    $('#highlight-icon').click(function () {
        $('#highlight-icon').hide();
        $('#highlight-icon-1').show();
        highlight_flag = true;
    });
    $('#highlight-icon-1').click(function () {
        $('#highlight-icon').show();
        $('#highlight-icon-1').hide();
        highlight_flag = false;
    });

    window.onmouseup = mouseup;

    function mouseup(event) {
        if (highlight_flag) {
            if (window.getSelection()) {
                window.getSelection().getRangeAt(0).surroundContents($('<span class="highlight_style" />')[0]);
            }
        }

        if ($('#bt-text-to-speach:visible').length &&
            !$('#bt-text-to-speach:visible').find(event.target).length &&
            !$(event.target).hasClass('bt-text-to-speach-button') &&
            !$(event.target).id !== 'bt-text-to-speach-button') {
            $('#bt-text-to-speach').hide();
        }
    }
});
