# AEM Asset Selector for Franklin Authoring
Integration between AEM Asset Selector and AEM Franklin to make AEM assets available in Franklin site authoring.

# High level flow

[Link to Diagram Source](https://lucid.app/lucidchart/d6db1b7d-144f-4ac9-94a2-fce760ed2ca4/edit?viewport_loc=-368%2C-403%2C1899%2C1069%2C0_0&invitationId=inv_cd6848d0-dfc0-4be9-b0cb-3cae5a1ba757)

![High Level Flow](/resources/using-asset-selector-with-franklin.jpeg)

## Environments
- Preview: https://main--{repo}--{owner}.hlx.page/
- Live: https://main--{repo}--{owner}.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Prerequisite

### Apart from using Block references directly from the repository, is there anything additional that needs to be addressed?

Yes, it's crucial to ensure that all external images used on the page are converted into corresponding `<picture>` tags before the block code is executed.. [Reference here](https://github.com/hlxsites/franklin-assets-selector/blob/ext-images/EXTERNAL_IMAGES.md)

### Any reference pages for the quick view of site?

PFB the relevant links -

- Page URL : [Check here](https://aem-dynamicmedia-demo--dm--hlxsites.aem.live/travel-hospitality/wknd-trvl-home)
- Content URL : [Check Here](https://docs.google.com/document/d/1nWiXrvWAnoGGthR0oa2I0WcJF5TekHXPzv7ZWa5LxVE/edit?tab=t.0)
- Block Documentation : [Check Here](https://aem-dynamicmedia-demo--dm--hlxsites.aem.page/tools/sidekick/library.html?plugin=blocks)

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
3. Install the [AEM CLI](https://github.com/adobe/aem-cli): `npm install -g @adobe/aem-cli`
4. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
5. Open the repo directory in your favorite IDE and start coding :)