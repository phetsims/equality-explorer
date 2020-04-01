/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
