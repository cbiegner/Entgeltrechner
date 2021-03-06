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

        selST.empty();
        selST.append($('<option></option>').val("").html("-- Entgeltstufe wählen --"));

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
        closeText: 'OK', closeStatus: '',
        monthNames: ['Januar','Februar','März','April','Mai','Juni', 'Juli','August','September','Oktober','November','Dezember'],
        monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun', 'Jul','Aug','Sep','Okt','Nov','Dez'],
        dateFormat:'mm-yy'
    });

    $("#von").datepicker();
    $("#bis").datepicker();

    $('[data-toggle="tooltip"]').tooltip();

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

    var entgelt = 0; //eg * aa / 100;

    $.getJSON('daten.json', function(data)
    {
        $.each( data.daten, function( key, val ) {
            if(val.entgeltgruppe == eg)
            {
                jsz = val.JSZ;

                switch (st)
                {
                    case "1":
                        entgelt = val.entgeltstufe.stufe1;
                        break;
                    case "2":
                        entgelt = val.entgeltstufe.stufe2;
                        break;
                    case "3":
                        entgelt = val.entgeltstufe.stufe3;
                        break;
                    case "4":
                        entgelt = val.entgeltstufe.stufe4;
                        break;
                    case "5":
                        entgelt = val.entgeltstufe.stufe5;
                        break;
                    case "6":
                        entgelt = val.entgeltstufe.stufe6;
                        break;
                }

                if(entgelt > 0)
                    calc_2(entgelt, jsz);
            }
        });
    });
}

function calc_2(entgelt, jsz)
{
    var eg = $('#eg').val();
    var st = $('#st').val();
    var aa = $('#aa').val();
    var ts = $('#ts').val();
    var von = $('#von').val();
    var bis = $('#bis').val();

    entgelt = entgelt * aa / 100;

    var startdate = new Date(von.substring(3, 7), von.substring(0, 2) - 1, 1);
    var enddate = new Date(bis.substring(3, 7), bis.substring(0, 2) - 1, 1);

    var calcdate = startdate;

    $('#ergebnistable > tbody > tr').remove();

    while(calcdate.getTime() <= enddate.getTime())
    {
        var monat = calcdate;
        var pauschal = entgelt * 30 / 100;
        var grundvg = entgelt + pauschal;
        var steigerung = grundvg * ts / 100;
        var zwsumme = entgelt + pauschal + steigerung;
        var gerundet = Math.round(zwsumme / 10) * 10;
        var aufschlag = zwsumme * jsz/ 100 / 12;
        var aufschlag_g = Math.round(aufschlag);
        var summe = zwsumme + aufschlag;

        var m = '0' + (calcdate.getMonth() + 1);
        if(m.length > 2)
            m = m.substring(1, 3);
        
        var s_monat = '<td align="center"><b>' + m + '-' + calcdate.getFullYear() + '</b></td>';
        var s_entgelt = '<td align="center">' + entgelt.toFixed(2).replace(".", ",") + '</td>';
        var s_pauschal = '<td align="center">' + pauschal.toFixed(2).replace(".", ",") + '</td>';
        var s_steigerung = '<td align="center">' + steigerung.toFixed(2).replace(".", ",") + '</td>';
        var s_zwsumme = '<td align="center">' + zwsumme.toFixed(2).replace(".", ",") + '</td>';
        var s_gerundet = '<td align="center"><b>' + gerundet.toFixed(2).replace(".", ",") + '</b></td>';
        var s_aufschlag = '<td align="center">' + aufschlag.toFixed(2).replace(".", ",") + '</td>';
        var s_aufschlag_g = '<td align="center"><b>' + aufschlag_g.toFixed(2).replace(".", ",") + '</b></td>';
        var s_summe = '<td align="center">' + summe.toFixed(2).replace(".", ",") + '</td>';

        $('#ergebnistable > tbody:last-child').append('<tr>' + 
        s_monat + s_entgelt + s_pauschal + s_steigerung + s_zwsumme + s_gerundet + s_aufschlag + s_aufschlag_g + s_summe + '</tr>');
        calcdate.setMonth(calcdate.getMonth() + 1);
    }
}