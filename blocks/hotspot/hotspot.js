import { createOptimizedPicture } from '../../scripts/aem.js';

function attachEvents(block) {
  // Hide all hotspots lying under the iframe when the iframe is hovered
  block.querySelectorAll('iframe').forEach((frame) => {
    frame.addEventListener('mouseover', (e) => {
      const frameRect = frame.getBoundingClientRect();
      // const hotspots = document.querySelectorAll('.hotspot');

      document.querySelectorAll('.hotspot').forEach((hotspot) => {
        if (hotspot === e.target.closest('.hotspot')) {
          return;
        }

        const hotspotRect = hotspot.getBoundingClientRect();

        // Check if the hotspot is within the iframe's viewport
        const isInViewport = (
          hotspotRect.top >= frameRect.top
                    && hotspotRect.left >= frameRect.left
                    && hotspotRect.bottom <= frameRect.bottom
                    && hotspotRect.right <= frameRect.right
        );

        if (isInViewport) {
          hotspot.style.display = 'none';
        }
      });
    });
    frame.addEventListener('mouseout', () => {
      document.querySelectorAll('.hotspot').forEach((hotspot) => {
        hotspot.style.display = 'block';
      });
    });
  });
}

export default function decorate(block) {
  [...block.children].forEach((row, r) => {
    if (r > 0) {
      const content = [...row.children][0].textContent.trim();
      const isImage = content.endsWith('.jpg') || content.endsWith('.png') || content.endsWith('.gif') || content.endsWith('.jpeg');
      const isVideo = content.endsWith('.mp4') || content.endsWith('.webm') || content.endsWith('play') || content.endsWith('content/'); // Adjust condition as needed
      const isText = !isImage && !isVideo; // Assuming if it's neither image nor video, it's text
      const nexticondiv = document.createElement('div');
      nexticondiv.classList.add('hotspot'); // Added class for CSS targeting
      nexticondiv.style.left = [...row.children][1].textContent;
      nexticondiv.style.top = [...row.children][2].textContent;
      nexticondiv.setAttribute('data', content);
      //nexticondiv.setAttribute('data-city', [...row.children][0].textContent.split('\n')[2].split(':')[0]);
      // Create content display element
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('hotspot-content');
      if (isImage) {
        const img = document.createElement('img');
        img.src = content;
        contentContainer.appendChild(img);
      } else if (isVideo) {
        const video =document.createElement('div');
        video.innerHTML =`<div class="embed-default">
                        <iframe src=${content} from allow="encrypted-media" loading="lazy">
                            </iframe>
                           </div>`;
        //video.src = content;
        //video.controls = true; // Allows user control over the video
        contentContainer.appendChild(video);
      } else if (isText) {
        contentContainer.textContent = content; // Display text
        contentContainer.classList.add('bgborder');
      }
      // Append content container to hotspot div
      nexticondiv.appendChild(contentContainer);
      nexticondiv.addEventListener('click', () => {
        // Hide content of all other hotspots
        document.querySelectorAll('.hotspot').forEach(hotspot => {
          if (hotspot !== nexticondiv) {
            hotspot.classList.remove('onclick');
          }
        });
        // Toggle the current hotspot content
        nexticondiv.classList.toggle('onclick');
      });
      row.after(nexticondiv);
      row.remove();
    }
  });

  attachEvents(block);
}
