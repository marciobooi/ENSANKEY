var glossaryboxNameSpace = {
	nbGlossaryModal: 0,
	leftPositionModal: 50,
	topPositionModal: 50,
	gapMultipleModal: 5,

	glossaryBox: function (id, titleModalBox) {
		var idGlossaryModalBox = 'glossary-modal-' + glossaryboxNameSpace.nbGlossaryModal;
		var glossaryModal = new jBox('Modal', {
			id: idGlossaryModalBox,
			addClass: 'glossary',
			title: titleModalBox,
			content: glossaryboxNameSpace.fillGlossaryModalContent(id),
			repositionOnOpen: true,
			repositionOnContent: true,
			preventDefault: true,
			closeButton: 'box',
			constructOnInit: true,
			draggable: 'title',
			width: 300,
			height: 'auto',
			overlay: false,
			blockScroll: false,
			// Once jBox is closed, destroy it
			onCloseComplete: function () {
				glossaryboxNameSpace.nbGlossaryModal -= 1;
				if (glossaryboxNameSpace.nbGlossaryModal > 0) {
					glossaryboxNameSpace.leftPositionModal -= glossaryboxNameSpace.gapMultipleModal;
					glossaryboxNameSpace.topPositionModal -= glossaryboxNameSpace.gapMultipleModal;
				}
				this.destroy();
			}
		});
		glossaryModal.open();
		if (glossaryboxNameSpace.nbGlossaryModal > 0) {
			glossaryboxNameSpace.leftPositionModal += glossaryboxNameSpace.gapMultipleModal;
			glossaryboxNameSpace.topPositionModal += glossaryboxNameSpace.gapMultipleModal;
		}
		$('#' + idGlossaryModalBox).css({ left: glossaryboxNameSpace.leftPositionModal + '%', top: glossaryboxNameSpace.topPositionModal + '%' });
		glossaryboxNameSpace.nbGlossaryModal++;
	},

	fillGlossaryModalContent: function (id) {
		var contentGlossary;
		$.ajax({

			url: "data/glossary_"+languageNameSpace.languageSelected+".json",
			type: "GET",
			dataType: "json",
			async: false,
			success: function (data) {
				contentGlossary = data[id];
			},
			error: function () {
				error("fillGlossaryModalContent: No data found!");
			}
		});
		return contentGlossary;
	}
};
