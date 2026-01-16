(function () {
    'use strict';

    if (!window.Lampa) return;

    var observer;
    var STORAGE_KEY = 'hide_shots_enabled';

    function hideShots() {
        if (!Lampa.Storage.get(STORAGE_KEY, true)) return;

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

    function togglePlugin(enabled) {
        if (enabled) startObserver();
        else stopObserver();
    }

    Lampa.Listener.follow('app', function (event) {
        if (event.type !== 'ready') return;

        Lampa.SettingsApi.addParam({
            component: 'plugin',
            param: {
                name: STORAGE_KEY,
                type: 'toggle',
                default: true
            },
            field: {
                name: 'Скрывать Shots'
            },
            onChange: function (value) {
                togglePlugin(value);
            }
        });
        Lampa.Plugin.add({
            name: 'Hide Shots',

            onStart: function () {
                togglePlugin(Lampa.Storage.get(STORAGE_KEY, true));
            },

            onStop: function () {
                stopObserver();
            }
        });
    });
})();
