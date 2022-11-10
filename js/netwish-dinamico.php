<?php include '../../inc_bco.php';?>

/*!

=========================================================
* Netwish - v2.0.0
=========================================================


*/

//
// Bootstrap Datepicker
//

//IMPRIMIR IFRAME
function imprimir( frame ){
  window.frames[frame].focus();
  window.frames[frame].print();
}


$(document).ready(function () {


      $('.table tbody').on( 'click', 'tr', function () {
          var table = $('.table').DataTable();
        //console.log( table.row( this ).data() );
        //console.log( 'Row index: '+table.row( this ).index() );
        var linha = table.row( this ).index();
        console.log(linha);

        $(".funcao").attr("data-linha", linha);

      });



    // mostra o numero do pedido
    $('.funcao').on('click', function(e) {
      var linha = $(this).data('linha');
      var status = $(this).data("status"); 
      
      atualiza_linha(".table",status,linha,"9");
      $('.table tbody tr:eq('+linha+')').addClass( 'danger' ).removeClass('warning');
      $('.table tbody tr:eq('+linha+') .botoes_ar').css( 'display','none' );
    });



    /*atualiza o valor da linha*/
    function atualiza_linha(table, valor, linha, coluna){
      var oTable = $(table).dataTable();
      oTable.fnUpdate( valor, linha, coluna );
    }





    // mostra o numero do pedido
    $(document).on('click', '.modal-geral', function(e) {
      e.preventDefault;

      var modal = $(this).data('target');
      var link = $(this).data('link');
      var titulo = $(this).attr('title');

      console.log(link);

      $(modal + " .modal-title").html(titulo); 

      $(".carregando_iframe").show();
      $(modal + " iframe").hide();

      $(modal + " iframe").attr({'src':link,'width': "100%"}); 
      $(modal + " iframe").css({'height': "75vh"}); 

        console.log(link);
      });



    // mostra get
    $(document).on('click', '.modal-get', function(e) {
      e.preventDefault;
        var link_final = $(this).attr("endereco")
        $.get(  link_final );
        
        $( this ).closest( "tr" ).remove();//remove a linha

        var table = $('.table').DataTable();
        table.ajax.reload();
      });




    //ordenar datatable por data brasil
    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
     "date-br-pre": function ( a ) {
      if (a == null || a == "") {
       return 0;
     }
     var brDatea = a.split('/');
     return (brDatea[2] + brDatea[1] + brDatea[0]) * 1;
    },

    "date-br-asc": function ( a, b ) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-br-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
    } );



    $('.coluna').click( function () { 
      var iCol = $(this).data('columnV');

      var oTable = $('.table').dataTable();
      var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
      oTable.fnSetColumnVis( iCol, bVis ? false : true );

      if ($(this).hasClass("marca_dt")) {
        $(this).removeClass("marca_dt").addClass("marca_dt_sem"); 
      }else{
        $(this).addClass("marca_dt").removeClass("marca_dt_sem");
      }


    });

    function fnShowHide( iCol ){
      /* Get the DataTables object again - this is not a recreation, just a get of the object */
      var oTable = $('.table').dataTable({
        language: {"emptyTable": "Aguardando parametros..."}
      });

      var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
      oTable.fnSetColumnVis( iCol, bVis ? false : true );
    }


    $(".select2").select2(); //select 2


    //DATATABLE
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //DATATABLE puxa o dado
    $.fn.dataTable.ext.errMode = 'none'; //desabilita erros

    var table = $('.table').dataTable({
      language: {"emptyTable": "Aguardando parametros..."},
     // processing: true, 
     ajax: {"url": "consulta-painel_json.php?t=<?php echo $_GET['c'];?>","cache": false},


     createdRow: function( row, data, dataIndex){
      if (data[9] == "Aguardando") {
        $(row).addClass('warning');
      }else if (data[9] == "Análise") {
        $(row).addClass('success');
      }else if (data[9] == "Análise PCP") {
        $(row).addClass('active');
      }else if (data[9] == "Cancelado") {
        $(row).addClass('danger');
      }else if (data[9] == "Comercial") {
        $(row).addClass('danger');
      }else if (data[9] == "Aprovado") {
        $(row).addClass('danger');
      }else if (data[9] == "Desenvolvimento") { 
        $(row).addClass('info');
      }else if (data[9] == "Encerrado") {
        $(row).addClass('info');
      }else if (data[9] == "OS Programada") {
        $(row).addClass('info');
      }else if (data[9] == "PCP Programação") {
        $(row).addClass('info');
      }else if (data[9] == "Pré-Impressão") {
        $(row).addClass('info');
      }else if (data[9] == "Reprovado") {
        $(row).addClass('bg-red-forte');
      }
    },

    "columnDefs": [  
    {// aqui são os botões
      "render": function ( data, type, row ) { 
        var texto;

        <?php if ($_SESSION["nivel"]!="5") { ?>

          if (row[9] == "Aguardando") {
            texto =  '<div class="botoes_ar"><button type="button" class="btn btn-warning btn-xs<?php if ($_SESSION["nivel"]=="1") { ?> modal-dinamico" data-toggle="modal" data-target="#recusar" data-p="'+ row[0]+'" data-pc=" <?php } ?>"><i class="glyphicon glyphicon-hourglass"></i></button></div>'; 

          }else if (row[9] == "Salvo" || row[9] == "Reprovado" ) {
            texto = '<div class="botoes_ar"><a href="pedido.php?pedido='+ row[0]+'" class="btn btn-success btn-xs modal-dinamico" ><i class="glyphicon glyphicon-pencil"></i></a></div><button type="button" class="btn btn-info btn-xs modal-dinamico" data-toggle="modal" data-target="#consulta" data-p="'+ row[0]+'" data-pc="'+ row[1]+'" ><i class="glyphicon glyphicon-flash"></i></button> <button type="button" endereco="pedido-status.php?s=d&p='+ row[0]+'" class="btn btn-danger btn-xs modal-get confirma" data-toggle="confirmation" data-title="Confirma Exclusão?" data-btn-ok-label="Sim" data-btn-cancel-label="Não"><i class="glyphicon glyphicon-remove"></i></button>';
          }else{
            texto = '<button type="button" class="btn btn-info btn-xs modal-dinamico" data-toggle="modal" data-target="#consulta" data-p="'+ row[0]+'" data-pc="'+ row[1]+'" ><i class="glyphicon glyphicon-flash"></i></button>';
          }
        
        <?php  }else{ ?>

            texto = '<button type="button" class="btn btn-info btn-xs modal-dinamico" data-toggle="modal" data-target="#consulta" data-p="'+ row[0]+'" data-pc="'+ row[1]+'" ><i class="glyphicon glyphicon-flash"></i></button>';

        <?php  } ?>

        if (row[15]) { 
          //modal da nota fiscal
            texto = texto + '<a class="btn btn-danger btn-xs modal-geral" data-toggle="modal" data-target="#geral" data-link="pedido-nota.php?p='+row[0]+'"><i class="fa fa-file-pdf-o"></i></a>';
        }

        return texto ;
      },
      "targets":0,
      "orderable":false
    },
    { 
      "type": 'date-br',
      "targets": [ 1 ]
    },
    { 
      "type": 'date-br',
      "targets": [ 3 ]
    }
    ],
    "lengthMenu": [[50, 100, 150, -1], [50, 100, 150, "Todos"]], 
    "aaSorting": [[1, "desc"]],
    "paging":   true,                 
    "ordering": true,                 
    "info":     false, 
    'sDom':'Brtp',
    "language": {"url": "assets/js/Portuguese-Brasil.json"},
    dom: 'Bfrtip',
    buttons: [ {
      extend: 'copy',
      exportOptions: { columns: [':visible' ]}
     },  
     {
        extend: 'excel',
        exportOptions: {columns: [':visible' ]}
     }, 
     {
        extend: 'pdf',
        exportOptions: {columns: [':visible' ]}
     }, 
     {
        extend: 'print',
        exportOptions: {columns: [':visible' ]}
     }  ]
 

    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Reload de 60s fazendo contagem regresiva
    //setInterval( function () {
    //    var table = $('.table').DataTable();
    //    table.ajax.reload();
    //}, 60000 );


    var output = $('.contador_tempo');
    var isPaused = false;
    var time = new Date();
    var offset = 0;
    var t = window.setInterval(function() {
      if(!isPaused) {
        var tempo = (new Date()).getTime() - time.getTime()
        var milisec = offset + tempo;
        output.html('<i class="glyphicon glyphicon-pause"></i> ' + parseInt(milisec / 1000) + "/60s");

        if(parseInt(milisec / 1000)==61) {  
          console.log("parou"); 
          offset += -61000 ;     
          var table = $('.table').DataTable();
          table.ajax.reload();
        }
        parou = parseInt(milisec / 1000)
      }else{
        output.html('<i class="glyphicon glyphicon-play"></i> ' + parou + "/60s");
      }

    }, 10);

    //with jquery
    $('.contador_tempo').on('click', function(e) {
      e.preventDefault();
      isPaused = !isPaused;
      if (isPaused) {
        offset += (new Date()).getTime() - time.getTime();
      } else {
        time = new Date(); 
      }

    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //BOTÃO BUSCAR
    $(document).on('click', '.buscar', function () {
       $('.table').dataTable().fnClearTable();//limpa a tabela

       var table = $('.table').DataTable();

      //procurando 
      $('.dataTables_empty').html('<i class="fa fa-spinner fa-spin"></i> Procurando...');


      var pega_ano = $(this).attr("qual_ano"); 
      if (pega_ano) {
        $(".ano").val(pega_ano);
      }

      var tipo=$(".tipo").val(); 
      var ano=$(".ano").val();

      //console.log(ano);


      table.ajax.url( 'consulta-painel_json.php?t=<?php echo $consulta_painel[0]['valor'];?>&tipo='+tipo+'&ano='+ano).load();
      console.log ('consulta-painel_json.php?t=<?php echo $consulta_painel[0]['valor'];?>&tipo='+tipo+'&ano='+ano);
      //console.log ('produtos_json.php?tipo='+tipo+'&ano='+ano+'&modelo='+modelo+'&marca='+marca+'&nome='+busca_caixa);


      $('.table').css("width","100%")

      //mostra mensagem de erro
      $('.table').on( 'error.dt', function ( e, settings, techNote, message ) {
        $('.dataTables_empty').text("Sem Registro, reveja os filtros")
      } )
      .DataTable();

    } );


    $('.busca_geral').on( 'keyup', function () {
        var table = $('.table').DataTable();
        table.search( this.value ).draw();
    } );

    $('.filtro').change( function () { 
      var qual_coluna = $(this).data('columnV');
      table.fnFilter( $(this).val(),qual_coluna);
    });

    //esconde colunas
    /*fnShowHide(3);
    fnShowHide(4);*/


    //DATEPICKER
    (function($){
      $.fn.datepicker.dates['pt-BR'] = {
        days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
        daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
        months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: "Hoje",
        clear: "Limpar"
      }; 
    }(jQuery));


    $(".data-caixa").datepicker({format: 'dd/mm/yyyy', language: 'pt-BR'});





  $('.table').css("width","100%")
  $('.dataTables_empty').html('<i class="fa fa-spinner fa-spin"></i> Procurando...');



  //pega ano 
  $(".dropdown-menu li a").click(function(){
    $(".periodo").text($(this).text());
    $(".periodo").val($(this).text());
  });


  //habilita a confirmação do botão excluir
    setInterval( function () {       
      //$(document).find('[data-toggle="confirmation"]').confirmation();
    }, 1000 );



});// fecha document ready



  $( ".libera_impressao" ).click(function() {
    $( "#form_impressao" ).attr("target","_blank");
    $( ".lib_imp" ).val("1");
    $( ".lib_apr" ).val("");
    $( "#form_impressao" ).submit();
  });

 $( ".libera_aprovacao" ).click(function() {
    $( "#form_impressao" ).attr("target","_top");
    $( ".lib_imp" ).val("");
    $( ".lib_apr" ).val("1");
    $( "#form_impressao" ).submit();
  });



 $('#clientes_filtro').on('change', function() {
  var id_cliente = $("#clientes_filtro option:selected").attr('cliente'); 

  $("#filtro_cliente option:selected").text("Escolha");
  $("#filtro_cliente option").hide();
  $("#filtro_cliente option[filtro_cliente*='"+id_cliente+"']").show();

  if (id_cliente==""){
    $("#filtro_cliente option").show();
  }


  console.log(id_cliente)
})
