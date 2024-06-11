/** @module analyses/getBoldItalicFormats */

var bulletFormatRegex = /<(ul|ol)([^>]*)>(.*?)<\/\1>/gi;

/**
 * Checks a text for bullets and returns the number found.
 *
 * @param {Object} paper The paper to get the text from.
 * @returns {Array} An array with the bullets
 */
function getBulletFormatEls( paper ) {
	var text = paper.getText();

	return text.match( bulletFormatRegex );
}

/**
 * Checks a text for bullets and returns the number found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {number} The number of links found in the text.
 */
export default function( paper ) {
	var elements = getBulletFormatEls( paper );

	return elements ? elements.length : 0;
}


