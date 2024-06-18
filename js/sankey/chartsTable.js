var tableIsOpen = false
var chartOpen



function handleTable() {

    if(tableIsOpen){
        $('#chart').css('display','none')
        $('#'+chartOpen.cbName).css('display','none')
        $('#btnCloseModalChart').css('display','none')
        $("#chartControls").append(
            $(document.createElement("button")).prop({
                id: "closeTable",
                type: "button",
                class: "close",               
              })
              .attr( "aria-label", "Close")
              .attr("onClick", "closeTable()")
              .append(
                $(document.createElement("span"))
                  .attr("aria-hidden", "true")
                  .html("&times;")
              )
          );
    }

    $("table > thead > tr").append('<th class="tableFix" scope="col"></th>')

}




function closeTable() {
    tableIsOpen = false
    log(chartOpen)

    $('.highcharts-data-table').css('display', 'none')
    $('#chart').css('display','block')
    $('#'+chartOpen.cbName).css('display','initial')
    $('#btnCloseModalChart').css('display','flex')
    $('#closeTable').remove()
}