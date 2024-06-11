import { merge } from "lodash-es";

import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";

/**
 * Assessment to check whether the text has internal links and whether they are followed or no-followed.
 */
class BoldItalicAccessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum number of internal links in the text.
	 * @param {number} [config.scores.hasInlineFormat] The score to return if has at least one inline format
	 * @param {number} [config.scores.noInlineFormat] The score to return  if has no inline format
	 * @param {string} [config.url] The URL to the relevant KB article.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMinimum: 1,
			},
			scores: {
				hasInlineFormat: 9,
				noInlineFormat: 6,
			},
		};

		this.identifier = "boldItalicFormat";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher, i18n ) {
		this.inlineFormatCount = researcher.getResearch( "getBoldItalicFormats" );
		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks if assessment is applicable to the paper.
	 *
	 * @param {Paper} paper The paper to be analyzed.
	 *
	 * @returns {boolean} Whether the paper has text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}

	/**
	 * Returns a score and text based on the linkStatistics object.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} ResultObject with score and text
	 */
	calculateResult( i18n ) {
		if ( this.inlineFormatCount > 0 ) {
			return {
				score: this._config.scores.hasInlineFormat,
				resultText: "You have used inline format. Make sure to put emphasis where make sense to readers.",
			};
		}

		return {
			score: this._config.scores.noInlineFormat,
			resultText: "It is recommended to use inline formatting like bold, italic to make your text scannable and engaging.",
		};
	}
}

export default BoldItalicAccessment;
