// == Hide Shots | Separate Settings Screen (FINAL) ==
(function () {
    'use strict';

    if (!window.Lampa) return;

    var STORAGE_KEY = 'hide_shots_enabled';
    var observer = null;
    var originalDisplay = new WeakMap();
    var settings_registered = false;

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
        if (observer) return;
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
        if (settings_registered) return;
        settings_registered = true;

        Lampa.SettingsApi.addComponent({
            component: 'hide_shots',
            name: 'Hide Shots',
            icon:
                '<svg viewBox="0 0 512 512" fill="currentColor">' +
                '<path d="M253.266 512a19.166 19.166 0 0 1-19.168-19.168V330.607l-135.071-.049a19.164 19.164 0 0 1-16.832-28.32L241.06 10.013a19.167 19.167 0 0 1 36.005 9.154v162.534h135.902a19.167 19.167 0 0 1 16.815 28.363L270.078 502.03a19.173 19.173 0 0 1-16.812 9.97z"/>' +
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
