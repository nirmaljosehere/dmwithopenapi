import {
  sampleRUM,
  createOptimizedPicture as libCreateOptimizedPicture,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './aem.js';
import assetsInit from './aem-assets-plugin-support.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

const comingSoonPlaceHolder = `${window.location.origin}/resources/summit/coming-soon.webp`;

const summitHost = 'delivery-p129624-e1269699';

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Gets the extension of a URL.
 * @param {string} url The URL
 * @returns {string} The extension
 * @private
 * @example
 * get_url_extension('https://example.com/foo.jpg');
 * // returns 'jpg'
 * get_url_extension('https://example.com/foo.jpg?bar=baz');
 * // returns 'jpg'
 * get_url_extension('https://example.com/foo');
 * // returns ''
 * get_url_extension('https://example.com/foo.jpg#qux');
 * // returns 'jpg'
 */
function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

/**
 * Checks if an element is an external image.
 * @param {Element} element The element
 * @param {string} externalImageMarker The marker for external images
 * @returns {boolean} Whether the element is an external image
 * @private
 */
function isExternalImage(element, externalImageMarker) {
  // if the element is not an anchor, it's not an external image
  if (element.tagName !== 'A') return false;

  // if the element is an anchor with the external image marker as text content,
  // it's an external image
  if (element.textContent.trim() === externalImageMarker) {
    return true;
  }

  // if the element is an anchor with the href as text content and the href has
  // an image extension, it's an external image
  if (((element.textContent.trim() === element.getAttribute('href'))
  || element.getAttribute('href').includes(summitHost)
|| element.getAttribute('href').includes('varun/Sofa1'))
&& !element.getAttribute('href').includes('s7viewers')) {
    const ext = getUrlExtension(element.getAttribute('href'));
    return (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext.toLowerCase())) || element.getAttribute('href').includes('/is/image/');
  }

  return false;
}

/*
  * Appends query params to a URL
  * @param {string} url The URL to append query params to
  * @param {object} params The query params to append
  * @returns {string} The URL with query params appended
  * @private
  * @example
  * appendQueryParams('https://example.com', { foo: 'bar' });
  * // returns 'https://example.com?foo=bar'
*/
function appendQueryParams(url, params) {
  const { searchParams } = url;
  params.forEach((value, key) => {
    searchParams.set(key, value);
  });
  url.search = searchParams.toString();
  return url.toString();
}

function matchDMUrl(srcUrl) {
  return srcUrl ? srcUrl.includes('/is/image') : false;
}

/**
 * Creates an optimized picture element for an image.
 * If the image is not an absolute URL, it will be passed to libCreateOptimizedPicture.
 * @param {string} src The image source URL
 * @param {string} alt The image alt text
 * @param {boolean} eager Whether to load the image eagerly
 * @param {object[]} breakpoints The breakpoints to use
 * @returns {Element} The picture element
 *
 */
export function createOptimizedPicture(extImg, alt = '', eager = false, breakpoints = [{ media: '(min-width: 600px)', width: '1800' }, { width: '750' }]) {
  const src = extImg.getAttribute('href');
  const isAbsoluteUrl = /^https?:\/\//i.test(src);

  // Fallback to createOptimizedPicture if src is not an absolute URL
  if (!isAbsoluteUrl) return libCreateOptimizedPicture(src, alt, eager, breakpoints);

  const url = new URL(src);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  let isMemberCollectionImage = false;
  const memberCollection = document.getElementsByClassName('member-collections');
  if (memberCollection && memberCollection.length > 0) {
    isMemberCollectionImage = memberCollection[0].contains(extImg);
  }

  if (isMemberCollectionImage) {
    // Load placeholder image
    const placeholderImg = document.createElement('img');
    placeholderImg.setAttribute('src', comingSoonPlaceHolder); // Set placeholder image URL
    placeholderImg.setAttribute('alt', alt);
    picture.setAttribute('data-original-source', src);
    picture.appendChild(placeholderImg);
    return picture;
  }

  if (matchDMUrl(src)) {
    const isTemplateUrl = url.search.match(/\$[a-zA-Z0-9]+=[a-zA-Z0-9]+/g);
    if (isTemplateUrl) {
      picture.setAttribute('data-is-template', 'true');
    }

    const hasWidthInSrc = url.searchParams.get('src') ? url.searchParams.get('src').includes('wid=') : false;
    const appendWidParam = !hasWidthInSrc && !url.searchParams.get('wid');

    breakpoints.forEach((br, i) => {
      const searchParams = appendWidParam
        ? new URLSearchParams({ wid: br.width })
        : new URLSearchParams();

      if (i < breakpoints.length - 1) {
        const source = document.createElement('source');
        if (br.media) source.setAttribute('media', br.media);
        source.setAttribute('srcset', appendQueryParams(url, searchParams));
        picture.appendChild(source);
      } else {
        const img = document.createElement('img');
        img.setAttribute('loading', eager ? 'eager' : 'lazy');
        img.setAttribute('alt', alt);
        picture.appendChild(img);
        img.setAttribute('src', appendQueryParams(url, searchParams));
      }
    });
  } else {
    // webp
    breakpoints.forEach((br) => {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('type', 'image/webp');
      const searchParams = new URLSearchParams({ width: br.width, format: 'webply' });
      source.setAttribute('srcset', appendQueryParams(url, searchParams));
      picture.appendChild(source);
    });

    // fallback
    breakpoints.forEach((br, i) => {
      const searchParams = new URLSearchParams({ width: br.width, format: ext });

      if (i < breakpoints.length - 1) {
        const source = document.createElement('source');
        if (br.media) source.setAttribute('media', br.media);
        source.setAttribute('srcset', appendQueryParams(url, searchParams));
        picture.appendChild(source);
      } else {
        const img = document.createElement('img');
        img.setAttribute('loading', eager ? 'eager' : 'lazy');
        img.setAttribute('alt', alt);
        picture.appendChild(img);
        img.setAttribute('src', appendQueryParams(url, searchParams));
      }
    });
  }

  return picture;
}

/*
  * Decorates external images with a picture element
  * @param {Element} ele The element
  * @param {string} deliveryMarker The marker for external images
  * @private
  * @example
  * decorateExternalImages(main, '//External Image//');
  */
function decorateExternalImages(ele, deliveryMarker) {
  const extImages = ele.querySelectorAll('a');
  extImages.forEach((extImage) => {
    if (isExternalImage(extImage, deliveryMarker)) {
      const extImageSrc = extImage.getAttribute('href');
      const extPicture = createOptimizedPicture(extImage);

      /* copy query params from link to img */
      const extImageUrl = new URL(extImageSrc);
      const { searchParams } = extImageUrl;
      extPicture.querySelectorAll('source, img').forEach((child) => {
        if (child.tagName === 'SOURCE') {
          const srcset = child.getAttribute('srcset');
          if (srcset) {
            const queryParams = appendQueryParams(new URL(srcset, extImageSrc), searchParams);
            if (srcset.includes('/is/image/')) {
              child.setAttribute('srcset', queryParams.replaceAll('%24', '$'));
            } else {
              child.setAttribute('srcset', queryParams);
            }
            child.setAttribute('loading', 'eager');
          }
        } else if (child.tagName === 'IMG') {
          const src = child.getAttribute('src');
          if (src) {
            const queryParams = appendQueryParams(new URL(src, extImageSrc), searchParams);
            if (src.includes('/is/image/')) {
              child.setAttribute('src', queryParams.replaceAll('%24', '$'));
            } else {
              child.setAttribute('src', queryParams);
            }
            child.setAttribute('loading', 'eager');
          }
        }
      });
      extImage.parentNode.replaceChild(extPicture, extImage);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // decorate external images with explicit external image marker
  decorateExternalImages(main, '//External Image//');

  // decorate external images with implicit external image marker
  decorateExternalImages(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}
await assetsInit();
loadPage();
