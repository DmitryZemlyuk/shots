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
            }
        });
    }

    /* ---------------- STATE ---------------- */

    function isEnabled() {
        return Lampa.Storage.get('hide_shots', false) === true;
    }

    function updateBodyClass() {
        document.body.classList.toggle('hide-shots-enabled', isEnabled());
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

    new MutationObserver(applyHideShots)
        .observe(document.body, { childList: true, subtree: true });

    /* ---------------- CSS ---------------- */

    function injectStyle() {
        if (document.getElementById('hide-shots-style')) return;

        const style = document.createElement('style');
        style.id = 'hide-shots-style';
        style.textContent = `
            /* кружок */
            .settings-param[data-name="hide_shots_toggle"] .settings-param__name::before {
                content: '';
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #666;
                display: inline-block;
                margin-left: 12px;
                vertical-align: middle;
                top: -2px;
                left: -7px;
                position: relative;
            }

            body.hide-shots-enabled
            .settings-param[data-name="hide_shots_toggle"]
            .settings-param__name::before {
                background: #2ecc71;
            }
        `;
        document.head.appendChild(style);
    }

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
                Lampa.Storage.set('hide_shots', !isEnabled());
                updateBodyClass();
                applyHideShots();
            }
        });

        Lampa.Listener.follow('settings', function (e) {
            if (e.type === 'open' && e.name === 'hide_shots') {
                injectStyle();
                updateBodyClass();
            }
        });
    }

    /* ---------------- INIT ---------------- */

    injectStyle();
    updateBodyClass();

    if (isEnabled()) {
        applyHideShots();
    }

})();
