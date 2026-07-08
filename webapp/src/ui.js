/*global navigate*/

// import './spatial-navigation-polyfill.js';
import './navigation-checkbox.js';

import './ui.css';

import { configRead, configWrite } from './config.js';
import { checkboxTools } from './checkboxTools.js';

let lastTabIndex = 0;

function isGerman() {
  return /^de\b/i.test(navigator.language || '');
}

function text(key) {
  const german = {
    title: 'YouTube webOS Cobalt AdFree',
    adblock: 'Werbung blockieren',
    sponsorblock: 'SponsorBlock aktivieren',
    sponsor: 'Sponsor-Segmente überspringen',
    intro: 'Intro überspringen',
    outro: 'Outro überspringen',
    interaction: 'Abo-/Like-Hinweise überspringen',
    selfpromo: 'Eigenwerbung überspringen',
    musicOfftopic: 'Musik/off-topic überspringen',
    preview: 'Vorschau/Rückblick überspringen',
    filler: 'Füller/Abschweifung überspringen',
    hook: 'Hook/Begrüßung überspringen',
    openHint: 'Grün drücken für YouTube-Extras'
  };
  const english = {
    title: 'YouTube webOS Cobalt AdFree',
    adblock: 'Enable AdBlocking',
    sponsorblock: 'Enable SponsorBlock',
    sponsor: 'Skip Sponsor Segments',
    intro: 'Skip Intro Segments',
    outro: 'Skip Outro Segments',
    interaction: 'Skip Interaction Reminders',
    selfpromo: 'Skip Self Promotion',
    musicOfftopic: 'Skip Music/Off-topic',
    preview: 'Skip Preview/Recap',
    filler: 'Skip Filler/Tangent',
    hook: 'Skip Hook/Greeting',
    openHint: 'Press [GREEN] for YouTube extras'
  };
  return (isGerman() ? german : english)[key];
}

export function userScriptStartUI() {
  // We handle key events ourselves.
  window.__spatialNavigation__.keyMode = 'NONE';

  const ARROW_KEY_CODE = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

  const uiContainer = document.createElement('div');
  uiContainer.classList.add('ytaf-ui-container');
  uiContainer.style.display = 'none';
  uiContainer.setAttribute('tabindex', 0);
  uiContainer.addEventListener(
    'focus',
    () => {
      console.info('uiContainer focused!');
      const tabIndex = document.querySelector(':focus').tabIndex;
      if (tabIndex !== null) {
        lastTabIndex = tabIndex;
      }
    },
    true
  );
  uiContainer.addEventListener(
    'blur',
    () => console.info('uiContainer blured!'),
    true
  );

  uiContainer.addEventListener(
    'keydown',
    (evt) => {
      console.info(
        'uiContainer key event:',
        evt.type,
        evt.charCode,
        evt.keyCode
      );
      if (evt.charCode !== 404 && evt.charCode !== 172) {
        if (evt.keyCode in ARROW_KEY_CODE) {
          if (uiContainer.offsetParent !== null) {
            navigate(ARROW_KEY_CODE[evt.keyCode]);
          }
        } else if (evt.keyCode === 13 || evt.keyCode === 32) {
          // "OK" button
          checkboxTools.toggleCheck(document.querySelector(':focus').id);
        } else if (evt.keyCode === 27) {
          // Back button
          closeContainer();
        }
        evt.preventDefault();
        evt.stopPropagation();
      }
    },
    true
  );

  const callbackConfig = (configName) => {
    return (newState) => {
      configWrite(configName, newState);
    };
  };

  const divTitle = document.createElement('div');
  divTitle.classList.add('center');
  divTitle.innerHTML = `<h1>${text('title')}</h1>`;
  uiContainer.appendChild(divTitle);

  uiContainer.appendChild(
    checkboxTools.add(
      '__adblock',
      text('adblock'),
      configRead('enableAdBlock'),
      callbackConfig('enableAdBlock')
    )
  );
  uiContainer.appendChild(
    checkboxTools.add(
      '__sponsorblock',
      text('sponsorblock'),
      configRead('enableSponsorBlock'),
      callbackConfig('enableSponsorBlock')
    )
  );

  const sponsorBlock = document.createElement('div');
  sponsorBlock.classList.add('blockquote');
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_sponsor',
      text('sponsor'),
      configRead('enableSponsorBlockSponsor'),
      callbackConfig('enableSponsorBlockSponsor')
    )
  );
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_intro',
      text('intro'),
      configRead('enableSponsorBlockIntro'),
      callbackConfig('enableSponsorBlockIntro')
    )
  );
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_outro',
      text('outro'),
      configRead('enableSponsorBlockOutro'),
      callbackConfig('enableSponsorBlockOutro')
    )
  );
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_interaction',
      text('interaction'),
      configRead('enableSponsorBlockInteraction'),
      callbackConfig('enableSponsorBlockInteraction')
    )
  );
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_selfpromo',
      text('selfpromo'),
      configRead('enableSponsorBlockSelfPromo'),
      callbackConfig('enableSponsorBlockSelfPromo')
    )
  );
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_music_offtopic',
      text('musicOfftopic'),
      configRead('enableSponsorBlockMusicOfftopic'),
      callbackConfig('enableSponsorBlockMusicOfftopic')
    )
  );
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_preview',
      text('preview'),
      configRead('enableSponsorBlockPreview'),
      callbackConfig('enableSponsorBlockPreview')
    )
  );
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_filler',
      text('filler'),
      configRead('enableSponsorBlockFiller'),
      callbackConfig('enableSponsorBlockFiller')
    )
  );
  sponsorBlock.appendChild(
    checkboxTools.add(
      '__sponsorblock_hook',
      text('hook'),
      configRead('enableSponsorBlockHook'),
      callbackConfig('enableSponsorBlockHook')
    )
  );
  uiContainer.appendChild(sponsorBlock);

  document.querySelector('body').appendChild(uiContainer);

  let latestFocus = null;
  function openContainer() {
    console.info('Container: Showing & Focusing!');
    uiContainer.style.display = 'block';
    latestFocus = document.querySelector(':focus');
    document.querySelector('[tabindex="' + lastTabIndex + '"]').focus();
    keepContainerFocus();
  }

  function keepContainerFocus() {
    if (uiContainer.offsetParent !== null) {
      if (
        !uiContainer.matches(':focus') &&
        uiContainer.querySelector(':focus') == null
      ) {
        latestFocus = document.querySelector(':focus');
        console.info('Container: Not have focus: Focusing!');
        document.querySelector('[tabindex="' + lastTabIndex + '"]').focus();
      }

      setTimeout(keepContainerFocus, 100);
    }
  }

  function closeContainer() {
    console.info('Container: Hiding!');
    uiContainer.style.display = 'none';
    uiContainer.blur();
    if (latestFocus != null) {
      latestFocus.focus();
    }
  }

  const eventHandler = (evt) => {
    console.info(
      'Key event:',
      evt.type,
      evt.charCode,
      evt.keyCode,
      evt.defaultPrevented
    );
    if (evt.charCode == 404 || evt.charCode == 172) {
      console.info('Taking over!');
      evt.preventDefault();
      evt.stopPropagation();
      if (evt.type === 'keydown') {
        if (uiContainer.style.display === 'none') {
          openContainer();
        } else {
          closeContainer();
        }
      }
      return false;
    } else if (
      evt.type === 'keydown' &&
      evt.charCode == 0 &&
      evt.keyCode == 187
    ) {
      // char '='
      if (uiContainer.style.display === 'none') {
        openContainer();
        evt.preventDefault();
        evt.stopPropagation();
      } else {
        closeContainer();
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
    return true;
  };

  // Red, Green, Yellow, Blue
  // 403, 404, 405, 406
  // ---, 172, 170, 191
  document.addEventListener('keydown', eventHandler, true);
  document.addEventListener('keypress', eventHandler, true);
  document.addEventListener('keyup', eventHandler, true);

  setTimeout(() => {
    showNotification(text('openHint'), 3000, 'green');
  }, 2000);
}

export function showNotification(text, time = 3000, variant = 'yellow') {
  console.info('Show notification: ' + text);
  if (!document.querySelector('.ytaf-notification-container')) {
    console.info('Adding notification container');
    const c = document.createElement('div');
    c.classList.add('ytaf-notification-container');
    document.body.appendChild(c);
  }

  const elm = document.createElement('div');
  const elmInner = document.createElement('div');
  elmInner.innerHTML = text;
  elmInner.classList.add('message');
  elmInner.classList.add(`message-${variant}`);
  elmInner.classList.add('message-hidden');
  elm.appendChild(elmInner);
  document.querySelector('.ytaf-notification-container').appendChild(elm);

  setTimeout(() => {
    elmInner.classList.remove('message-hidden');
  }, 100);
  setTimeout(() => {
    elmInner.classList.add('message-hidden');
    setTimeout(() => {
      document.querySelector('.ytaf-notification-container').removeChild(elm);
    }, 1000);
  }, time);
}
