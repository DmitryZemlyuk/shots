(function () {
    'use strict';

    if (!window.Lampa) return;

    var STORAGE_KEY = 'hide_shots_enabled';
    var observer = null;
    var originalDisplay = new WeakMap();

    function isEnabled(v) {
        return v === true || v === 'true';
    }

    function hideElement(el) {
        if (!originalDisplay.has(el)) {
            originalDisplay.set(el, el.style.display || '');
        }
        el.style.display = 'none';
    }

    function showElement(el) {
        el.style.display = originalDisplay.has(el)
            ? originalDisplay.get(el)
            : '';
    }

    function applyHideState() {
        var enabled = isEnabled(Lampa.Storage.get(STORAGE_KEY, true));

        document.querySelectorAll('.selectbox-item').forEach(function (item) {
            var use = item.querySelector('use');
            if (!use) return;

            var href =
                use.getAttribute('xlink:href') ||
                use.getAttribute('href');

            if (href === '#sprite-shots') {
                enabled ? hideElement(item) : showElement(item);
            }
        });

        document
            .querySelectorAll('.shots-player-recordbutton')
            .forEach(function (el) {
                enabled ? hideElement(el) : showElement(el);
            });
    }

    function startObserver() {
        stopObserver();
        observer = new MutationObserver(applyHideState);
        observer.observe(document.body, { childList: true, subtree: true });
        applyHideState();
    }

    function stopObserver() {
        if (!observer) return;
        observer.disconnect();
        observer = null;
        applyHideState();
    }

    function applyState(v) {
        isEnabled(v) ? startObserver() : stopObserver();
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
