(function () {
    'use strict';

    if (!window.Lampa) return;

    var observer;
    var PLUGIN_ID = 'hide_shots';
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

        Lampa.Plugin.add({
            id: PLUGIN_ID,
            name: 'Hide Shots',

            onStart: function () {
                togglePlugin(Lampa.Storage.get(STORAGE_KEY, true));
            },

            onStop: function () {
                stopObserver();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'plugin',
            plugin: PLUGIN_ID,  
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
    });
})();
