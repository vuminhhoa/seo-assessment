/** @module analyses/getBoldItalicFormats */

var inlineFormatRegex = /<(b|i|strong|em)([^>]*)>(.*?)<\/\1>/gi;

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} paper The paper to get the text from.
 * @returns {Array} An array with the anchors
 */
function getInlineFormatEls( paper ) {
	var text = paper.getText();

	return text.match( inlineFormatRegex );
}

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {number} The number of links found in the text.
 */
export default function( paper ) {
	var elements = getInlineFormatEls( paper );

	return elements ? elements.length : 0;
}


