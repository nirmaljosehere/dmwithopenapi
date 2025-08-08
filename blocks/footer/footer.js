/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';
  const footer = document.createElement('div');
  footer.id = 'footer';
  footer.append('Copyright © 2024 Adobe. All rights reserved.');
  block.append(footer);
}
