
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');

function closeMenu() {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
}

menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');

    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute(
        'aria-label',
        isOpen ? 'Close menu' : 'Open menu'
    );
});

menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        menuButton.focus();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 740) {
        closeMenu();
    }
});

const demoText =
    'Proin laoreet elementum ligula, ac tincidunt lorem accumsan nec. ' +
    'Fusce eget urna ante. Donec massa velit, varius a accumsan ac, ' +
    'tempor iaculis massa. Sed placerat justo sed libero varius vulputate.';

const expertiseText = {
    ux: [
        demoText,
        demoText
    ],

    ui: [
        'User interface design focuses on the appearance and behavior ' +
        'of digital products, including typography, colors and components.',

        'Good interfaces are consistent and straightforward to use ' +
        'across different screen sizes.'
    ],

    web: [
        'Web design combines layout, navigation, typography and imagery ' +
        'to create clear, attractive websites.',

        'Responsive web design makes pages comfortable to use on ' +
        'desktop computers, tablets and mobile phones.'
    ]
};

const tabs = [...document.querySelectorAll('.expertise-tab')];

const expertiseContent = document.querySelector('#expertise-content');
const expertiseLead = document.querySelector('#expertise-lead');
const expertiseDetail = document.querySelector('#expertise-detail');

function activateTab(tab, focusTab = false) {
    tabs.forEach(item => {
        const active = item === tab;

        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
    });

    const [lead, detail] = expertiseText[tab.dataset.expertise];

    expertiseLead.textContent = lead;
    expertiseDetail.textContent = detail;

    expertiseContent.setAttribute('aria-labelledby', tab.id);

    if (focusTab) {
        tab.focus();
    }
}

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        activateTab(tab);
    });

    tab.addEventListener('keydown', event => {
        const keys = [
            'ArrowDown',
            'ArrowUp',
            'ArrowRight',
            'ArrowLeft',
            'Home',
            'End'
        ];

        if (!keys.includes(event.key)) {
            return;
        }

        event.preventDefault();

        let next = index;

        if (
            event.key === 'ArrowDown' ||
            event.key === 'ArrowRight'
        ) {
            next = (index + 1) % tabs.length;
        }

        if (
            event.key === 'ArrowUp' ||
            event.key === 'ArrowLeft'
        ) {
            next = (index - 1 + tabs.length) % tabs.length;
        }

        if (event.key === 'Home') {
            next = 0;
        }

        if (event.key === 'End') {
            next = tabs.length - 1;
        }

        activateTab(tabs[next], true);
    });
});
