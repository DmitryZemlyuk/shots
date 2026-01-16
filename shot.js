(function () {
    'use strict';

    if (!window.Lampa || !Lampa.SettingsApi) return;

    var STORAGE_KEY = 'hide_shots_enabled';
    var observer = null;

    function isEnabled(v) {
        return v === true || v === 'true';
    }

    function applyHideState() {
        var enabled = isEnabled(Lampa.Storage.get(STORAGE_KEY, 'true'));

        document.querySelectorAll('.selectbox-item').forEach(function (item) {
            var use = item.querySelector('use');
            if (!use) return;

            var href = use.getAttribute('xlink:href') || use.getAttribute('href');
            if (href === '#sprite-shots') {
                item.style.display = enabled ? 'none' : '';
            }
        });

        document
            .querySelectorAll('.shots-player-recordbutton')
            .forEach(function (el) {
                el.style.display = enabled ? 'none' : '';
            });
    }

    function startObserver() {
        if (observer) return;
        observer = new MutationObserver(applyHideState);
        observer.observe(document.body, { childList: true, subtree: true });
        applyHideState();
    }

    Lampa.Listener.follow('app', function (e) {
        if (e.type !== 'ready') return;

        // экран
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
                type: 'select',
                values: {
                    'true': 'Включено',
                    'false': 'Выключено'
                },
                'default': 'true'
            },
            field: {
                name: 'Скрывать Shots',
                description: 'Убирает пункт Shots и кнопку записи'
            },
            onChange: function (value) {
                Lampa.Storage.set(STORAGE_KEY, value);
                applyHideState();
            }
        });

        startObserver();
    });

})();
