// iframe
$(document).ready(function() {
    //força o carregamento do IFRAME, mostra o status
    //$('iframe').load(function() {
    $('iframe').on("load", function(e) {
        $(this).show();
        console.log('laod the iframe')
        $(".carregando_iframe").hide();
    });


    //IMPRIMIR IFRAME
    function imprimir(frame) {
        //window.frames.focus();
        window.frames.print();
        // window.frames[frame].focus();
        // window.frames[frame].print();
    }


});


// modal geral
$(document).on('click', '.imprimir', function(e) {
    window.frames.print();
});

// modal geral
$(document).on('click', '.modal-geral', function(e) {
    e.preventDefault;

    console.log("ewqewqewq: ");

    var modal = $(this).data('target');
    var link = $(this).data('link');
    var titulo = $(this).attr('title');
    var altura = $(this).data('height');
    var id = $(this).data('id');

    altura = (altura) ? altura : '30vh';

    link = (id) ? link + "?id=" + id : link;

    console.log("id: " + id);
    console.log("link: " + link);

    $(modal + " .modal-title").html(titulo);

    $(".carregando_iframe").show();
    $(modal + " iframe").hide();

    $(modal + " iframe").attr({
        'src': link,
        'width': "100%"
    });
    $(modal + " iframe").css({ 'height': altura, 'border': 'none' });
    $(modal + " .modal-body").css({ 'padding': "0px" });

    console.log(link);
});


// esconde coluna
function esconde_coluna(numero) {
    $('td:nth-child(' + numero + ')').hide();
    $('th:nth-child(' + numero + ')').hide();
    $('[data-column-v=' + (numero - 1) + ']').hide();
};


// função para verifica session
var verifica_logado = setInterval(ver_session, 5000);

function ver_session() {
    $.ajax({
        type: "POST",
        url: "inc_session.php",
        data: '',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        success: function(res) {
            //console.log(res);
            if (res === '') {

                Swal.fire({
                    title: "Atenção",
                    text: "Sessão expirada, faça o login novamente!",
                    confirmButtonText: "Login",
                    type: "error"
                }).then(function() {
                    // Redirect the user
                    window.location.href = "//portaldevenda.plastireal.com.br";
                });
            }

        },
        error: function(res) {
            Swal.fire({
                title: "Atenção",
                text: "Sessão expirada, faça o login novamente!",
                confirmButtonText: "Login",
                type: "error"
            }).then(function() {
                // Redirect the user
                window.location.href = "//portaldevenda.plastireal.com.br";
            });
            console.log(res);
        }
    });
}




///SESSION DA FILIAL
function session_filial(filial, nome) {

    $.ajax({
        url: 'session_filial.php',
        data: {
            filial: filial,
            filial_nome: nome,
        },
        method: 'GET',
        // dataType: 'json',
        // headers: {
        //     'Authorization': "<?= $_SESSION['token'] ?>"
        // },
        success: function(data) {
            console.log(data)
        }
    });
}

// LOAD CLICK
$('.menu_loading').on('click', function(e) {
    e.preventDefault;

    Swal.fire({
        title: 'Aguarde...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
});