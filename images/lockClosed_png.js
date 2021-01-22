/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;