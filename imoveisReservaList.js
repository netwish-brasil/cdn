$.ajax({
    type: "get",
    url: "https://ws_geral.netwish.com.br/imovel/reservaLista"
}).done((data) => {

    console.log(data);
    $("#imoveis_list").html("");

    data.forEach((item) => {

        var text = item.endereco;
        var len = item.endereco.length;
        var enderecoResumido = "";

        if (len > 50) {
            var query = text.split(" ", 10);
            query.push('...');
            res = query.join(' ');
            enderecoResumido = res;
        }

        var id_imovel = item.imovel_id;

        $.ajax({
            method: "POST",
            url: "https://ws_geral.netwish.com.br/imovel/pesquisaUnica",
            data: {
                id_imovel: id_imovel
            }
        }).done((data) => {

            console.log(data);
            console.log(data[0].thumb);

            var status = "";
            var buttonDevolver = "";

            if (item.devolucao == "1") {
                status = '<i class="fa fa-check"></i>' + " Devolvido";
            } else {
                status = '<i class="fa icon-key"></i>' + " Em empréstimo";
                buttonDevolver = '<button type="button" class="btn mr-1 mb-1 btn-success" data-toggle="modal" data-target="#devolucaoChaveModal' + item.reserva_chave_id + '"><i class="fa fa-check-circle"></i> Devolução</button>';
            }

            $("#imoveis_list").append(`
                <div class="col-12">
                    <div class="card">
                        <div class="card-content">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-12 col-lg-12 col-md-12 ">
                                        <div class="media">
                                            <div class="media-left pr-1">
                                                <img class="media-object " src="${data[0].thumb}" alt="${data[0].post_title}" width="100">
                                            </div>
                                            <div class="media-body">
                                                <h6 class="text-bold-500 pt-1 mb-0">${data[0].post_title}</h6>
                                                <p>${data[0].endereco}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-2 col-lg-6 col-md-12 ">
                                        <div class="media">
                                            <div class="media-left pr-1">
                                            </div>
                                            <div class="media-body">
                                                <h6 class="text-bold-500 pt-1 mb-0">Status:</h6>
                                                <p>${status}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xl-2 col-lg-6 col-md-12 text-center ">
                                        <div class="media">
                                            <div class="media-left pr-1">
                                            </div>
                                            <div class="media-body">
                                                <h6 class="text-bold-500 pt-1 mb-0">Nome</h6>
                                                <p>${item.nome}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xl-2 col-lg-6 col-md-12 text-center ">
                                        <div class="media">
                                            <div class="media-left pr-1">
                                            </div>
                                            <div class="media-body">
                                                <h6 class="text-bold-500 pt-1 mb-0">CPF</h6>
                                                <p>${item.cpf}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xl-2 col-lg-6 col-md-12 text-center ">
                                        <div class="media">
                                            <div class="media-left pr-1">
                                            </div>
                                            <div class="media-body">
                                                <h6 class="text-bold-500 pt-1 mb-0">Telefone</h6>
                                                <p>${item.telefone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-xl-2 col-lg-6 col-md-12 text-center ">
                                        <div class="media">
                                            <div class="media-left pr-1">
                                            </div>
                                            <div class="media-body">
                                                <h6 class="text-bold-500 pt-1 mb-0">Email</h6>
                                                <p>${item.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xl-2 col-lg-6 col-md-12 text-center ">
                                        ${buttonDevolver}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="modal fade text-left" id="devolucaoChaveModal${item.reserva_chave_id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel1" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="myModalLabel1">Devolução</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <h5>Insira a resposta da devolução: </h5>
                                <a class="btn btn-success btn-block" href="../app/Functions/php/setRespostaImovel.php?id_reserva=${item.reserva_chave_id}&interesse=true">Tem interesse</a>
                                <button type="button" class="btn btn-danger btn-block" data-toggle="modal" data-target="#NaoTemInterrese${item.reserva_chave_id}">
                                    Não tem interesse
								</button>
                            </div>
                        </div>
                    </div>
				</div>


                <div class="modal fade text-left" id="NaoTemInterrese${item.reserva_chave_id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel1" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <form action="../app/Functions/php/setRespostaImovel.php?id_reserva=${item.reserva_chave_id}&interesse=false" method="post">
                                <div class="modal-header">
                                    <h4 class="modal-title" id="myModalLabel1">Não Tem Interesse</h4>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="form-group">
                                        <label for="firstName1">Informe o motivo do desinteresse:</label>
                                        <input type="text" class="form-control" name="motivo_desinteresse" required>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn grey btn-outline-secondary" data-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-outline-primary">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
				</div>
            `);
        });

    });
});