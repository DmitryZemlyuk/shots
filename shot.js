// == Hide Shots | Lampa Plugin ==
(function () {
    'use strict';

    if (!window.Lampa) return;

    var STORAGE_KEY = 'hide_shots_enabled';
    var observer = null;

    function isEnabled(value) {
        return value === true || value === 'true';
    }

    function hideShots() {
        if (!isEnabled(Lampa.Storage.get(STORAGE_KEY, true))) return;

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
        stopObserver();

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

    function applyState(value) {
        if (isEnabled(value)) startObserver();
        else stopObserver();
    }

    Lampa.Listener.follow('app', function (e) {
        if (e.type !== 'ready') return;

        Lampa.SettingsApi.addComponent({
            component: 'hide_shots',
            name: 'Hide Shots',
            icon:
                '<svg viewBox="0 0 24 24" fill="currentColor">' +
                '<path d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/>' +
                '</svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'hide_shots',
            param: {
                name: STORAGE_KEY,
                type: 'toggle',
                default: true
            },
            field: {
                name: 'Скрывать Shots',
                description: 'Убирает пункт Shots и кнопку записи'
            },
            onChange: function (value) {
                applyState(value);
            }
        });

        applyState(Lampa.Storage.get(STORAGE_KEY, true));
    });
})();
