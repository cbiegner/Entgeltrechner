function pt()
{
    $.getJSON('daten.json', function(data)
    {
        var selPT = $('#pt');
        selPT.append($('<option></option>').val("").html("-- Projektträger wählen --"));
        $.each( data.projekttraeger, function( key, val ) {
            selPT.append($('<option></option>').val(val.wert).html(val.text));
        });
    });
}

function eg()
{
    $.getJSON('daten.json', function(data)
    {
        var selEG = $('#eg');
        selEG.append($('<option></option>').val("").html("-- Entgeltgruppe wählen --"));
        $.each( data.daten, function( key, val ) {
            selEG.append($('<option></option>').val(val.entgeltgruppe).html(val.entgeltgruppe));
        });
    });
}

function st()
{
    $.getJSON('daten.json', function(data)
    {
        var selST = $('#st');
        var eg = $('#eg').val();

        $.each( data.daten, function( key, val ) {
            if(val.entgeltgruppe == eg)
            {
                selST.empty();
                selST.append($('<option></option>').val("").html("-- Entgeltstufe wählen --"));
                if(val.entgeltstufe.stufe1 > 0) { selST.append($('<option></option>').val(1).html("Stufe 1")); }
                if(val.entgeltstufe.stufe2 > 0) { selST.append($('<option></option>').val(2).html("Stufe 2")); }
                if(val.entgeltstufe.stufe3 > 0) { selST.append($('<option></option>').val(3).html("Stufe 3")); }
                if(val.entgeltstufe.stufe4 > 0) { selST.append($('<option></option>').val(4).html("Stufe 4")); }
                if(val.entgeltstufe.stufe5 > 0) { selST.append($('<option></option>').val(5).html("Stufe 5")); }
                if(val.entgeltstufe.stufe6 > 0) { selST.append($('<option></option>').val(6).html("Stufe 6")); }
            }
        });
    });
}

function ts()
{
    $.getJSON('daten.json', function(data)
    {
        var selTS = $('#ts');
        $.each( data.tarifsteigerung, function( key, val ) {
            selTS.append($('<option></option>').val(val.wert).html(val.text));
        });
    });
}

function ready()
{
    $("#eg").change(function() { st(); });

    $.datepicker.setDefaults({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'MM yy',
        onClose: function(dateText, inst) { 
            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
        },

        prevText: '&#x3c;zurück', prevStatus: '',
        prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
        nextText: 'Vor&#x3e;', nextStatus: '',
        nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
        currentText: 'heute', currentStatus: '',
        todayText: 'heute', todayStatus: '',
        clearText: '-', clearStatus: '',
        closeText: 'schließen', closeStatus: '',
        monthNames: ['Januar','Februar','März','April','Mai','Juni', 'Juli','August','September','Oktober','November','Dezember'],
        monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun', 'Jul','Aug','Sep','Okt','Nov','Dez'],
        dateFormat:'mm-yy'
    });

    $("#von").datepicker();
    $("#bis").datepicker();

    eg();
    st();
    ts();
}

function check()
{
    var sb = $('#sb').val();
    var eg = $('#eg').val();
    var st = $('#st').val();
    var aa = $('#aa').val();
    var ts = $('#ts').val();

    if(sb == '')
    {
        alert("Bitte Stellenbezeichnung angeben");
    }
}

function calc()
{
    var eg = $('#eg').val();
    var st = $('#st').val();
    var aa = $('#aa').val();
    var ts = $('#ts').val();

    var startdate = new Date(2017,0,1)
    var enddate = new Date(2019,7,1)

    var calcdate = startdate;

    while(calcdate.getTime() <= enddate.getTime())
    {
        var monat = calcdate;
        var entgelt = 12345.67; //eg * aa / 100;
        var pauschal = entgelt * 30 / 100;
        var grundvg = entgelt + pauschal;
        var jsz = grundvg * 95 / 100 / 12; // !!! TODO
        var summevor = grundvg + jsz;
        var steigerung = summevor * ts / 100;
        var summe = summevor + steigerung;

        var m = '0' + (calcdate.getMonth() + 1);
        if(m.length > 2)
            m = m.substring(1, 3);
        
        var s_monat = '<td>' + m + '-' + calcdate.getFullYear() + '</td>';
        var s_entgelt = '<td>' + entgelt.toFixed(2) + '</td>';
        var s_pauschal = '<td>' + pauschal.toFixed(2) + '</td>';
        var s_grundvg = '<td>' + grundvg.toFixed(2) + '</td>';
        var s_jsz = '<td>' + jsz.toFixed(2) + '</td>';
        var s_steigerung = '<td>' + steigerung.toFixed(2) + '</td>';
        var s_summe = '<td>' + summe.toFixed(2) + '</td>';

        $('#ergeblistable > tbody:last-child').append('<tr>' + 
        s_monat + s_entgelt + s_pauschal + s_grundvg + s_jsz + s_steigerung + s_summe + '</tr>');
        calcdate.setMonth(calcdate.getMonth() + 1);
    }
}