$(function () {
    // only if we're on an article page
    if (!$('.bt-article__body').length) {
        return
    }

    var $article = $('.bt-article__body'),
        $modal = $('.bt-term-modal'),
        modalBaseHtml = $modal.html(),
        $screen = $('.bt-term-modal-screen');

    // fetch terms
    let page = 1;

    const fetchTerms = function () {
        $.ajax('/api/v1/bt-glossary?page=' + page, {
            method: 'GET',
            dataType: 'json',
            error: function (err) {
                console.log('err', err)
            },
            success: function (res) {
                // console.log("RESULTS: ", res.results);
                generateLinks(res.results);

                if(page < res.pages) {
                    page++;
                    fetchTerms();
                }
            }
        });
    };
    fetchTerms();

    $article.on('click', '[data-bt-term]', function (e, elm) {
        var term = JSON.parse(decodeURIComponent($(this).attr('data-term')))
        resetModal()
        generateModal(term)
    });

    function generateLinks(terms) {
        var foundTerms = terms
            .map(function (t) {
                return {term: t, elm: locateTerm(t)}
            })
            .filter(function (t) {
                return !!t.elm
            })
        foundTerms.forEach(function (t) {
            t.elm.html(function (_, html) {
                var text = t.elm.text()
                var re = new RegExp(
                    '(?<!<[^>]*)\\b(' + t.term.title + '[e]*[s]*)\\b',
                    'i'
                );

                var match = text.match(re);
                if (Array.isArray(match)) {
                    match = match[0]
                }
                return html.replace(
                    re,
                    '<span class="bt-term" data-bt-term data-term=' +
                    encodeURIComponent(JSON.stringify(t.term)) +
                    '>' +
                    match +
                    '</span>'
                )
            })
        })
    }

    function locateTerm(term) {
        const termTitle = term.title.replace(/\(|\)/g, ' ');

        var $elm = $article.find(
            '[data-rich-text]:contains(' +
            termTitle +
            '), [data-rich-text]:contains(' +
            termTitle +
            's), [data-rich-text]:contains(' +
            termTitle +
            'es), [data-rich-text]:contains(' +
            termTitle.toLowerCase() +
            '), [data-rich-text]:contains(' +
            termTitle.toLowerCase() +
            's), [data-rich-text]:contains(' +
            termTitle.toLowerCase() +
            'es)'
        )

        // console.log("Elements found: ", $elm.length);
        return $elm.length ? $elm : false
    }

    function resetModal() {
        $modal.html(modalBaseHtml)
    }

    function generateModal(term) {
        var type = term.layoutType

        $modal.addClass('bt-term-modal--' + type)

        if (type === undefined || type === 'text') {
            $modal.find('.bt-term-modal__term').text(term.title)
            $modal.find('.bt-term-modal__def').text(term.description)
            $modal.find('.bt-term-modal__example').text(term.example)
        } else if (type === 'imageCaption' || type === 'textImage') {
            var imageUrl = ''
            try {
                imageUrl =
                    term.image.items[0]._pieces[0].item.attachment._urls['one-half']
            } catch (e) {
                console.log(e)
            }

            $modal.find('.bt-term-modal__term').text(term.title)
            $modal.find('.bt-term-modal__def').text(term.description)
            $modal.find('.bt-term-modal__image').html('<img src="' + imageUrl + '"/>')
        }

        $modal.addClass('bt--active')
        $screen.addClass('bt--active')
    }

    $screen.click(function (e) {
        $modal.removeClass('bt--active')
        $screen.removeClass('bt--active')
    })
})
