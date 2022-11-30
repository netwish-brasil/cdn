$.ajax({
    type: "get",
    url: "https://ws_geral.netwish.com.br/imovel/lista"
}).done((data) => {

    // console.log(data);
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

        var disabledButtton = "";
        var ButttonText = "";
        if(item.chave == "Indisponivel")
        {
            disabledButtton = "disabled";
            ButttonText = "Indisponivel";
        }else {
            ButttonText = "Reservar";
        }

        $("#imoveis_list").append(`
            <div class="col-lg-3 col-md-6">
                <div class="card" style="height: 500px;">
                    <div class="card-content">
                        <img class="card-img-top img-fluid" src="${item.thumb}" alt="${item.post_title}" style="max-height: 250px !important;">
                        <div class="card-body">
                            <h4 class="card-title">${item.post_title}</h4>
                            <p class="card-text enderecoImovel" style="text-overflow: ellipsis;">${enderecoResumido}</p>
                        </div>
                    </div>
                    <div class="card-footer text-muted">
                        <span class="float-left">${item.chave}</span>
                        <span class="float-right">
                            <button ${disabledButtton} type="button" class="btn btn-success block btn-md" data-toggle="modal" data-target="#reservar_imovel_${item.id}">
                                ${ButttonText} 
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        `);

        if(item.chave != "Indisponivel")
        {
            $("#imoveis_list").append(`
                <div class="modal fade text-left" id="reservar_imovel_${item.id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel17" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="myModalLabel17">Reservar Imovel</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form action="../app/Functions/php/reservarImovel.php?imovel_id=${item.id}" method="post" class="reservarImovelAjax">
                                <div class="modal-body">
                                    <h5>${item.post_title}</h5>
                                    <p>${item.endereco}</p>
                                    <hr>
                                    <div class="row">
                                        <div class="col-lg-6 col-sm-12 mt-2">
                                            <input type="text" class="form-control" name="nomeCompleto" id="Default" placeholder="Nome Completo" required>
                                        </div>
                                        <div class="col-lg-6 col-sm-12 mt-2">
                                            <input type="text" class="form-control" name="numeroCpf" id="Default" placeholder="CPF" required>
                                        </div>
                                        <div class="col-lg-6 col-sm-12 mt-2">
                                            <input type="text" class="form-control" name="telefoneCliente" id="Default" placeholder="Telefone" required>
                                        </div>
                                        <div class="col-lg-6 col-sm-12 mt-2">
                                            <input type="email" class="form-control" name="emailCliente" id="Default" placeholder="Email" required>
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
            `);
        }
    });
});