/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;