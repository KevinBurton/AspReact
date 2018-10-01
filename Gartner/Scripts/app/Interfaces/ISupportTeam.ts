module Gartner {
	export interface ISupportTeam {
		Id: number;
		PreEditors: Array<Gartner.IEmployee>;
		Writers: Array<Gartner.IEmployee>;
		ProofReaders: Array<Gartner.IEmployee>;
		FirstLevelEditors: Array<Gartner.IEmployee>;
		GraphicDesigners: Array<Gartner.IEmployee>;
		Translators: Array<Gartner.IEmployee>;
		TranslatorReviewers: Array<Gartner.IEmployee>;
		TranslatorProofReaders: Array<Gartner.IEmployee>;
	}
} 