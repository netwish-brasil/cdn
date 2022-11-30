$("#formPesquisa").submit( (e) => {
    e.preventDefault();
    var Pesquisa = $("#pesquisaUsuario").val();
    window.location = "nova?query=" + Pesquisa;
});

$.ajax({
    type: "GET",
    url: "https://ws_geral.netwish.com.br/imovel/lista"
}).done((data) => {

    $("#imoveis_list").html("");

    data.forEach((item) => {

        if(item.chave != "Indisponivel")
        {
            $("#imoveis_list").append(`
                <div class="modal fade text-left" id="reservar_imovel_${item.id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel17" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="myModalLabel17">Reservar Imovel - ${item.id}</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form action="" method="post" class="reservarImovelAjax" id="imovel${item.id}">
                                <div class="modal-body">
                                    <h5><b>${item.post_title}</b></h5>
                                    <p>${item.endereco}</p>
                                    <hr>
                                    <div class="row">
                                        <div class="col-lg-6 col-sm-12 mt-2">
                                            <input type="text" class="form-control" name="nomeCompleto" id="nomecompleto" placeholder="Nome Completo" required>
                                        </div>
                                        <div class="col-lg-6 col-sm-12 mt-2">
                                            <input type="text" class="form-control" name="numeroCpf" id="cpf" placeholder="CPF" required>
                                        </div>
                                        <div class="col-lg-6 col-sm-12 mt-2">
                                            <input type="text" class="form-control" name="telefoneCliente" id="telefone" placeholder="Telefone" required>
                                        </div>
                                        <div class="col-lg-6 col-sm-12 mt-2">
                                            <input type="email" class="form-control" name="emailCliente" id="email" placeholder="Email" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <input type="submit" class="btn btn-outline-primary" value="Efetuar Reserva">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <script>
                    $("#imovel${item.id}").submit( function(a) {

                        a.preventDefault();

                        Swal.fire({
                            title: 'Deseja realmente efetuar a reserva?',
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Efetuar Reserva',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {

                            if (result.value) {

                                $.ajax({
                                    url: "${baseURL}app/Functions/php/reservarImovel.php?imovel_id=${item.id}",
                                    method: "POST",
                                    data: {
                                        nomeCompleto: $("#imovel${item.id} #nomecompleto").val(),
                                        numeroCpf: $("#imovel${item.id} #cpf").val(),
                                        telefoneCliente: $("#imovel${item.id} #telefone").val(),
                                        emailCliente: $("#imovel${item.id} #email").val()
                                    }
                                }).done( (r)=> {
                                    if(r == "error")
                                    {
                                        alert("Não foi possivel efetuar a reserva neste momento. Tente novamente mais tarde.");
                                    }else {
                                        var table = $('.dataTable').DataTable();
                                        table.ajax.reload(function(json) {
                                            parent.table_load();
                                        });

                                        const Toast = Swal.mixin({
                                            toast: true,
                                            position: 'top-end',
                                            showConfirmButton: false,
                                            timer: 5000,
                                            timerProgressBar: true
                                        });
                                        
                                        Toast.fire({
                                            icon: 'success',
                                            title: 'Reserva efetuada com sucesso'
                                        })
                                    }

                                    $('#reservar_imovel_${item.id}').modal('hide')
                                });

                            }

                        })

                    });
                </script>
            `);
        }
    });
});