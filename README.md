# RAIV

RAIV is a browser extension and server combination for capturing
interactivity in web-based visualizations.

## Overview

The browser extension allows you to specify which interactions in the
visualization you wish to capture, takes a screenshot of the
visualization after each captured interaction, and sends the screenshots
to the server to be prepared for playback.

The server encodes the screenshots taken by the browser extension into
an MP4 video file that is used to simulate the original visualization's
interactivity without any of the original source code or data.

## Build Instructions

### Requirements

* [Node.js](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/)
* [Python 3.11](https://www.python.org)
* [pipenv](https://pipenv.pypa.io/en/latest/)

### Browser extension setup

```
cd browser_extension
yarn install --frozen-lockfile

yarn build-watch
```

### Recording/playback server setup

```
cd server
pipenv --python /path/to/python3.11
pipenv sync -d

pipenv run uvicorn src.main:app --reload --port PORT
```

### Playback client setup

```
cd client
yarn install --frozen-lockfile

yarn build-watch
```

### start.sh

Alternatively, you can run `start.sh` which should initialize each
component of the project and run each one in a separate tmux window.

## Usage Instructions

### Browser extension

After building the extension, it should be loaded as an unpacked
extension in your browser. Once done, you should see the following
icon in your extension toolbar:

![toolbar](https://user-images.githubusercontent.com/8481770/230472259-5d5feaef-57e2-436a-bdf6-573d005a07ad.png)

To use RAIV, open the visualization you wish to capture in your
browser then click the toolbar icon. You should see the following
window pop up on the page:

![raiv](https://user-images.githubusercontent.com/8481770/230472520-9766dd89-b076-4b3c-ab38-f894a7cd2515.png)

Clicking the left (start) button will allow you to start specifying the
interactions you wish to capture. Clicking the right (stop) button will end
this process and allow you to begin capturing the visualization.

After clicking the start button, you will see the following dropdown
menu allowing you to specify the type of interaction to capture:

![interaction_types](https://user-images.githubusercontent.com/8481770/230473602-58e1063e-3d5a-4fff-8f89-7b171d5a5994.png)

Toggle interactions differ from clicks in that both states (clicked
and unclicked) are considered important to capture.

Once you've chosen the type of interaction to capture, you can hover
over the visualization and you should see the extension drawing a
border around the element that your mouse is focusing on. Once you
click on an element, an interaction of your specified type on that
element will be added to the interactions to capture.

After adding an interaction, you should see the following new button
that allows you to view/modify the interactions to be captured:

![view_tree](https://user-images.githubusercontent.com/8481770/230473668-36d6d4f6-6e7e-467b-ac00-cd722e693017.png)

Clicking this button will open a tree showing the interactions you
have selected for capturing.

![tree](https://user-images.githubusercontent.com/8481770/230473718-4ca08c55-6632-4645-b6f5-2e0626287cdc.png)

To edit an interaction, left-click on its tree node and you will see
a dialog that contains options for the interaction.

![options](https://user-images.githubusercontent.com/8481770/230473763-dc2cf847-712f-45d9-a18a-37da8b46ab52.png)

The wait time specifies how many milliseconds the extension should wait
after simulating the interaction before taking a screenshot. This is
useful if the interaction triggers asynchronous behavior and needs to
wait for multiple seconds before the visualization has updated. Note
that this cannot be set below 500ms in Chrome as Chrome limits
screenshots to two per second.

The manual capture toggle instructs the extension to wait for you to
confirm that the visualization is ready for a screenshot to be taken.
This is necessary when the interaction has a highly variable wait time
before the visualization is finished updating or when you need to
modify the visualization before taking the screenshot (eg the interaction
triggers a popup that renders out of frame by default and you wish to
drag it into frame before capture).

Going back to the tree view, you may notice that one of the interaction
nodes is green. New interactions will be added as children of the
green tree nodes. It is necessary for correct playback that an
interaction dependent on another interaction (eg a hover event inside of
a popup triggered by a click event) be a child of it in this tree. You
can add/remove a node as a parent (green) node for new interactions by
right clicking on it.

Once you are done adding interactions, click the stop button to end the
interaction selecting process.

Now, fill out the form that specifies where your playback server is
running and click capture:

![form](https://user-images.githubusercontent.com/8481770/230473798-3e3551d8-df04-44c6-af07-ac21ca7927c1.png)

Your video may take some time to encode depending on your server's
available resources and the number of interactions you are capturing.

### Playback

Once you have captured at least one visualization, navigate to where
you ran the server (eg http://localhost:{PORT}) in your browser. You
should see a gallery with a thumbnail for each visualization you've
captured. Click on the thumbnail to open up the playback client, and
then you should be able to perform the interactions you captured just
as you could with the original visualization and data!
