// The based path of the aem-assets-plugin code.
const codeBasePath = '/plugins/aem-assets-plugin';

// The blocks that are to be used from the aem-assets-plugin.
const blocks = ['video'];

// Initialize the aem-assets-plugin.
export default async function assetsInit() {
    const { loadBlock, createOptimizedPicture } = await import(`${codeBasePath}/scripts/aem-assets.js`);
    window.hlx = window.hlx || {};
    window.hlx.aemassets = {
        codeBasePath,
        blocks,
        loadBlock,
        createOptimizedPicture,
    };
}