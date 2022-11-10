/*!

=========================================================
* NETWISH VALIDAÇÃO - v2.0.0
=========================================================

*/

function hello() {


      $(".obrigatorio2").each(function(){

        if ($(this).is( ":visible" )){
          $(this).addClass('obrigatorio');
        }else{
          $(this).removeClass('obrigatorio');
        }

    });

  
    valida = 0;
    conta_campo = 0;
    conta_campo_total = 0;

  
//valida sem tem algum campo sem preenchimento
  $('.box-danger, .box-primary').each(function(inicio){ 

    conta_campo_interno = 0;

    $(this).find('.form-control').each(function(){

      tem_class = $(this).parents('.form-group').hasClass("border_red");
      tem_obrigatorio = $(this).hasClass("obrigatorio");

     // console.log("tem class: " + tem_class + " tem obrigatorio: " + tem_obrigatorio + " conteudo: "+tem_conteudo);

      if (tem_class == true && tem_obrigatorio == false ){ 
         $(this).parents('.form-group').removeClass("border_red");
      }

    });


    $(this).find('.obrigatorio').each(function(index){

       conta_campo_total+= 1;

       var campo = $(this).val();
       //console.log(inicio + " - " + index + " :interno:" + conta_campo_interno)

       if (campo){ 
         $(this).parents('.form-group').removeClass("border_red");
         conta_campo+= 1;
       }else{
        $(this).parents('.form-group').addClass("border_red");
        conta_campo_interno+=1
        conta_campo-= 1;
      }

    });



    if (conta_campo_interno<=0){ 
      $(this).removeClass("box-danger").addClass("box-primary");
    }else{
      $(this).addClass("box-danger").addClass("box-solid").removeClass("box-primary");
    }

    conta_campo_interno = 0;  

  });



  console.log("total: " + conta_campo_total + " campo: " + conta_campo );


//libera o botão de submit
  if (conta_campo_total==conta_campo){    
    $("#salvar").prop("disabled",false).removeAttr("title");
    $("#confirma").prop("disabled",false).removeAttr("title");
  }else{
    $("#salvar").prop("disabled",true).attr("title","Preencha todos os campos em vermelho");
    $("#confirma").prop("disabled",true).attr("title","Preencha todos os campos em vermelho");
  }


}