var timelineNameSpace = {
    totalWidth: 0,
    firstYearTimeLine: 0,
    lastYearTimeLine: 0,
    nbYears: 0,
    isAutoplayStarted: false,
    isAutoplayLoaded: false,
    isAutoplayStopped: false,
    animationYear: 0,

    getFirstAndLastYears: function () {
        this.firstYearTimeLine = parseInt(timeSeries[0]);
        this.lastYearTimeLine = parseInt(timeSeries[timeSeries.length - 1]);
        return {
            firstYear: this.firstYearTimeLine,
            lastYear: this.lastYearTimeLine,
        };
    },

    constructTimeline: function () {
        this.getFirstAndLastYears();
        this.nbYears = this.lastYearTimeLine - this.firstYearTimeLine + 1;

        $("#timeline-slider").slider({
            min: this.firstYearTimeLine,
            max: this.lastYearTimeLine,
            step: 1,
            create: function() {
                var handle = $("#timeline-slider .ui-slider-handle");
                handle.append('<div id="sliderTimePeriod"><span>' + REF.year + '</span></div>');
                $(this).slider('value', REF.year);

                // Add the grey background for the part of the slider after the handle
                var slider = $(this);
                slider.append('<div class="ui-slider-range ui-slider-range-after"></div>');
                timelineNameSpace.updateFillingLine();
            },
            slide: function(event, ui) {
                timelineNameSpace.updateTimeline(ui.value);
                $("#sliderTimePeriod span").text(ui.value); // Update the year display
                timelineNameSpace.updateFillingLine();
            },
            change: function(event, ui) {
                timelineNameSpace.updateFillingLine();
            },stop: (event, ui) => {               
                REF.year = ui.value;
				let el = $("span.sankey-category.geo");
				let subTitle = el.text();
				subTitle = subTitle.replace(/\d{4}/g, "");
				subTitle += " " + REF.year;
				el.text(subTitle);                
            },
			animate: "slow"
        });

        // Autoplay button functionality
        $("#autoplay-start").on("click", function() {
            if (timelineNameSpace.isAutoplayStarted) {
                timelineNameSpace.stopAutoplayTimeline();
            } else {
                timelineNameSpace.initAutoplayTimeline();
            }
        });

        // Call disableTimeLine to apply the necessary disabling logic
        this.disableTimeLine(1995); // Example: Disable years before 1995

        // Ensure the filling line is updated at the start
        this.updateFillingLine();
    },

    updateTimeline: function(year) {
        REF.year = year;
        // Update your content here based on the year
        // For example, 
        sankeyNameSpace.drawDiagramFromSankeyDB(year);
    },

    startAutoplayTimeline: function () {
        this.isAutoplayLoaded = true;
        this.isAutoplayStarted = true;
        this.isAutoplayStopped = false;
        this.updateAutoplayButton();

        $("#diagramYearInfo").fadeIn(1000);

        let year;
        if (this.animationYear == 0 || this.animationYear == timeSeries[timeSeries.length - 1]) {
            year = Number(timeSeries[0]);
        } else {
            year = this.animationYear;
        }
        REF.year = year;

        const func = () => {
            let curYear = year.toFixed(2).toString().replace(".", "");
            let preYear = curYear - 100;
            $("#diagramContainer" + preYear).hide();
            $("#diagramContainer" + curYear).show().attr("class", "current-diagram year-diagram").css({ "margin-left": 0, "margin-top": 0 });

            setTimeout(() => {
                $("#diagramContainer" + curYear).removeClass("current-diagram");
            }, 800);

            if (year.toFixed(2) % 1 == 0) {
                let labelYear = Math.floor(year.toFixed(2));
                this.animationYear = labelYear;
                $("#diagramYearInfo").html(labelYear);
                $("#" + labelYear).trigger("click");

                // Update the slider and year display button
                $("#timeline-slider").slider("value", labelYear);
                $("#sliderTimePeriod span").text(labelYear);
                timelineNameSpace.updateFillingLine();
            }

            if ((year.toFixed(2) <= timeSeries[timeSeries.length - 1] && this.isAutoplayStarted) || (year.toFixed(2) % 1 != 0 && !this.isAutoplayStarted)) {
                timer = setTimeout(func, dataNameSpace.freqFrames * 4);
                year += 1 / dataNameSpace.nbFrames;
                $("#autoplay-stop").focus();
            } else {
                this.stopAutoplayTimeline();
                $("#autoplay-start").focus();
            }
        }

        let timer = setTimeout(func, dataNameSpace.freqFrames * 4);
    },

    stopAutoplayTimeline: function () {
        this.isAutoplayStarted = false;
        this.isAutoplayStopped = true;
        this.updateAutoplayButton();
        $("#diagramYearInfo").fadeOut(1000);
		var targ = document.querySelectorAll('[id^="diagramContainer"');
		targ.forEach(function (element) {
			element.classList.add("year-diagram");
		});
		this.resetAutoplayTimeline();

		let el = $("span.sankey-category.geo");
				let subTitle = el.text();
				subTitle = subTitle.replace(/\d{4}/g, "");
				subTitle += " " + REF.year;
				el.text(subTitle);               
    },

    updateAutoplayButton: function () {
        const timeBtnIcon = $("#autoplay-start > i");
        if (this.isAutoplayStarted) {
            $(timeBtnIcon).removeClass("fa-play").addClass("fa-stop");
        } else {
            $(timeBtnIcon).removeClass("fa-stop").addClass("fa-play");
        }
    },

    disableTimeLine: function (countryFirstYear) {
        countryFirstYear = parseInt(countryFirstYear, 10);
        let diffYears = countryFirstYear - this.firstYearTimeLine;

        if (diffYears > 0) {
            for (let i = this.firstYearTimeLine; i < countryFirstYear; i++) {
                $(`#timeline-slider`).find(`.ui-slider-handle`).attr("data-year-disabled", i);
            }

            if (REF.year < countryFirstYear) {
                REF.year = countryFirstYear;
                $("#timeline-slider").slider("value", REF.year);
                $("#sliderTimePeriod span").text(REF.year);
            }
        }

        this.updateFillingLine();
    },

    updateFillingLine: function () {
        const handle = $("#timeline-slider .ui-slider-handle");
        const handlePosition = handle.position().left;
        const sliderWidth = $("#timeline-slider").width();

        $(".ui-slider-range").css({
            width: handlePosition + 'px'
        });

        $(".ui-slider-range-after").css({
            left: handlePosition + 'px',
            width: (sliderWidth - handlePosition) + 'px'
        });
    },

	resetAutoplayTimeline: function () {
		timelineNameSpace.isAutoplayStarted = false;
		timelineNameSpace.isAutoplayLoaded = false;
		timeSeriesNeeded = false;

		$("#svg-container").remove();
		$("div[id^='diagramContainer1']").remove();
		$("div[id^='diagramContainer2']").remove();
		$("#diagramContainer").show();

		//sankeyNameSpace.drawDiagram();
		sankeyNameSpace.buildSankey();
	},

    initAutoplayTimeline: function () {
        $("#diagramContainer").hide();
        $("#diagramYearInfo").hide();
        sankeyNameSpace.year = Number(timeSeries[0]);

        if (document.getElementById("diagramContainer" + timeSeries[timeSeries.length - 1] * 100) !== null) {
            $("#diagramContainer" + timeSeries[timeSeries.length - 1] * 100).hide();
            this.startAutoplayTimeline();
        } else {
            this.isAutoplayStarted = true;
            this.isAutoplayLoaded = true;
            timeSeriesNeeded = true;
            sankeyNameSpace.buildSankey();
        }
    }
};

