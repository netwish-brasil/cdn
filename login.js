const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


$("#formlogin").submit((e) => {

    e.preventDefault();

    if ($("#user-name").val() == "" || $("#user-password").val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Preencha seu usuario e senha corretamente',
        });
    } else {
        $.ajax({
            method: "POST",
            url: "app/Functions/php/login.php",
            data: {
                userLogin: $("#user-name").val(),
                passLogin: $("#user-password").val()
            }
        }).done((data) => {
            if (data == "success") {
                Toast.fire({
                    icon: 'success',
                    title: 'Logado(a) com sucesso'
                })
                setTimeout(() => {
                    window.location = "imovel";
                }, 2000);
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Usuário ou senha incorreto'
                })
            }
        });
    }

});
