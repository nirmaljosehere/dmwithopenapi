import { createOptimizedPicture } from '../../scripts/aem.js';

function isValidUrl(string) {
  const urlRegex = /^https?:\/\/[^\s]+[{}()\w\-._~:/?#[\]@!$&'()*+,;= ]*$/;
  return urlRegex.test(string);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else if (isValidUrl(div.textContent.trim())) div.className = 'cards-card-dynamic-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('div.cards-card-dynamic-image').forEach((div) => {
    const img = document.createElement('img');
    img.src = div.textContent.trim(); // Replace with your image URL
    img.alt = 'Description of image'; // Replace with your image description
    div.textContent = '';
    div.appendChild(img); // Append the img element to the div
  });

  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));
  block.textContent = '';
  block.append(ul);
}
