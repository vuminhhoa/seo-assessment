import { merge } from "lodash-es";

import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";
import getWords from "../../stringProcessing/getWords";

/**
 * Assessment to check whether the text has internal links and whether they are followed or no-followed.
 */
class BulletPointAssessment extends Assessment {
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
				recommendedMaximumWordCount: 100,
				slightlyTooMany: 100,
				farTooMany: 200,
			},
			scores: {
				goodShortTextNoBullets: 9,
				goodBullets: 9,
				okBullets: 6,
				badBullets: 3,
				badLongTextNoBullets: 2,
			},
		};

		this.identifier = "bulletPointFormat";
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
		this.bulletCount = researcher.getResearch( "getBulletCount" );
		this._textLength = getWords( paper.getText() ).length;

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
		if ( this._textLength > this._config.parameters.recommendedMaximumWordCount && this.bulletCount === 0 ) {
			return {
				score: this._config.scores.badBullets,
				resultText: "You should consider breaking down your content with bullet points",
			};
		}
		if ( this._textLength < this._config.parameters.recommendedMaximumWordCount && this.bulletCount === 0 ) {
			return {
				score: this._config.scores.goodShortTextNoBullets,
				resultText: "Short text. No need to use bullet points.",
			};
		}
		if ( this._textLength > this._config.parameters.recommendedMaximumWordCount && this.bulletCount > 0 ) {
			return {
				score: this._config.scores.goodBullets,
				resultText: "Good use of bullet point. Help your text organize and emphasize information quickly and effectively.",
			};
		}
		if ( this._textLength > this._config.parameters.farTooMany && this.bulletCount === 0 ) {
			return {
				score: this._config.scores.badLongTextNoBullets,
				resultText: "You are having quite a long text but no bullet point. Consider using them.",
			};
		}
	}
}

export default BulletPointAssessment;
