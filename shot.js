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

    // === SETTINGS (MAIN LEVEL) ===
    Lampa.Listener.follow('app', function (e) {
        if (e.type !== 'ready') return;
    
        Lampa.SettingsApi.addParam({
            component: 'main', // ← ВАЖНО: главный экран настроек
            param: {
                name: 'hide_shots_enabled',
                type: 'select',
                values: {
                    'true': 'Скрыть Shots',
                    'false': 'Показать Shots'
                },
                'default': 'true'
            },
            field: {
                name: 'Скрывать Shots',
                description: 'Убирает пункт Shots и кнопку записи'
            },
            onChange: function (value) {
                Lampa.Storage.set('hide_shots_enabled', value);
                applyHideState();
            }
        });
    
        // применяем при старте
        startObserver();
    });


})();
