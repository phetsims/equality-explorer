/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
