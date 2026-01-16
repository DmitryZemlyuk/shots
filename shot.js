(function () {
    'use strict';

    /* ---------------- LANG ---------------- */

    if (window.Lampa && Lampa.Lang) {
        Lampa.Lang.add({
            hide_shots_title: {
                ru: 'Hide Shots',
                en: 'Hide Shots',
                uk: 'Приховати Shots'
            },
            hide_shots_button: {
                ru: 'Скрывать Shots',
                en: 'Hide Shots',
                uk: 'Приховувати Shots'
            },
            hide_shots_enabled: {
                ru: 'Shots скрыты',
                en: 'Shots hidden',
                uk: 'Shots приховано'
            },
            hide_shots_disabled: {
                ru: 'Shots показаны',
                en: 'Shots shown',
                uk: 'Shots показано'
            }
        });
    }

    /* ---------------- STATE ---------------- */

    function isEnabled() {
        return Lampa.Storage.get('hide_shots', false) === true;
    }

    /* ---------------- LOGIC ---------------- */

    function applyHideShots() {
        if (!isEnabled()) return;

        document.querySelectorAll('.selectbox-item').forEach(item => {
            const use = item.querySelector('use');
            if (!use) return;

            const href = use.getAttribute('xlink:href') || use.getAttribute('href');
            if (href === '#sprite-shots') {
                item.style.display = 'none';
            }
        });

        document
            .querySelectorAll('.shots-player-recordbutton')
            .forEach(el => el.style.display = 'none');
    }

    /* ---------------- OBSERVER ---------------- */

    const observer = new MutationObserver(applyHideShots);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    /* ---------------- SETTINGS ---------------- */

    if (window.Lampa && Lampa.SettingsApi) {

        Lampa.SettingsApi.addComponent({
            component: 'hide_shots',
            name: Lampa.Lang.translate('hide_shots_title'),
            icon: `
            <svg viewBox="0 0 512 512" width="32" height="32" fill="currentColor">
                <path d="M253.266 512a19.166 19.166 0 0 1-19.168-19.168V330.607l-135.071-.049a19.164 19.164 0 0 1-16.832-28.32L241.06 10.013a19.167 19.167 0 0 1 36.005 9.154v162.534h135.902a19.167 19.167 0 0 1 16.815 28.363L270.078 502.03a19.173 19.173 0 0 1-16.812 9.97z"/>
            </svg>`
        });

        Lampa.SettingsApi.addParam({
            component: 'hide_shots',
            param: {
                name: 'hide_shots_toggle',
                type: 'button'
            },
            field: {
                name: Lampa.Lang.translate('hide_shots_button')
            },
            onChange: function () {
                const enabled = !isEnabled();
                Lampa.Storage.set('hide_shots', enabled);

                applyHideShots();

                if (Lampa.Noty) {
                    Lampa.Noty.show(
                        Lampa.Lang.translate(
                            enabled ? 'hide_shots_enabled' : 'hide_shots_disabled'
                        )
                    );
                }
            }
        });
    }

    /* ---------------- INIT ---------------- */

    if (isEnabled()) {
        applyHideShots();
    }

})();
