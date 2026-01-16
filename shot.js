(function () {
    'use strict';

    if (!window.Lampa || !Lampa.Plugin) return;

    var observer;

    function hideShots() {
        document.querySelectorAll('.selectbox-item').forEach(function (item) {
            var use = item.querySelector('use');
            if (!use) return;

            var href =
                use.getAttribute('xlink:href') ||
                use.getAttribute('href');

            if (href === '#sprite-shots') {
                item.style.display = 'none';
            }
        });

        document
            .querySelectorAll('.shots-player-recordbutton')
            .forEach(function (el) {
                el.style.display = 'none';
            });
    }

    function startObserver() {
        if (observer) return;

        observer = new MutationObserver(hideShots);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        hideShots();
    }

    function stopObserver() {
        if (!observer) return;
        observer.disconnect();
        observer = null;
    }

    Lampa.Plugin.add({
        name: 'Hide Shots',

        onStart: function () {
            startObserver();
        },

        onStop: function () {
            stopObserver();
        }
    });
})();
