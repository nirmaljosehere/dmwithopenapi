import { createDmOptimizedPicture, getMetadata } from '../../scripts/aem.js';

export default function decorate(block) {
  // get the url of the page
  let url = new URL(window.location.href);

  // Use URLSearchParams to get the query parameters
  const params = new URLSearchParams(url.search);

  // Get the value of the 'style' parameter
  const styleParam = params.get('style');
  const page = getMetadata('page');
  if (page === 'gallery') {
    let src = block.textContent.trim();

    if (styleParam && styleParam === 'bw') {
      url = new URL(src);
      url.searchParams.append('fmt', 'jpeg,gray');
      src = decodeURIComponent(url.toString());
    } else if (styleParam && styleParam === 'sepia') {
      // append the sepia version with fmt=jpeg,sepia
      // convert src to a URL object
      url = new URL(src);
      url.searchParams.append('op_colorize', '704214');
      src = decodeURIComponent(url.toString());
    }

    const picture = createDmOptimizedPicture(
      src,
      'dynamic media image',
      false,
      [{ media: '(orientation: landscape)', width: '2000' }, { width: '1000' }],
    );
    block.textContent = '';
    block.appendChild(picture);
  } else {
    const image = document.createElement('img');
    image.src = block.textContent.trim();

    if (styleParam && styleParam === 'bw') {
      // append the black and white version with fmt=jpeg,gray
      // convert src to a URL object
      url = new URL(image.src);
      // add the fmt query parameter to the url
      url.searchParams.append('fmt', 'jpeg,gray');
      // set the src of the image to the url
      image.src = decodeURIComponent(url.toString);
    } else if (styleParam && styleParam === 'sepia') {
      // append the sepia version with fmt=jpeg,sepia
      // convert src to a URL object
      url = new URL(image.src);
      // add the fmt query parameter to the url
      url.searchParams.append('op_colorize', 'ff0000');
      // set the src of the image to the url
      image.src = decodeURIComponent(url.toString);
    }

    image.alt = 'Description of image';
    image.className = 'dynamic-image';

    block.textContent = '';

    // Append image element to the block
    block.appendChild(image);
  }
}
