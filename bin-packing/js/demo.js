/******************************************************************************

 This is a demo page to experiment with binary tree based
 algorithms for packing blocks into a single 2 dimensional bin.

 See individual .js files for descriptions of each algorithm:

  * packer.js         - simple algorithm for a fixed width/height bin
  * packer.growing.js - complex algorithm that grows automatically

 TODO
 ====
  * step by step animated render to watch packing in action (and help debug)
  * optimization - mark branches as "full" to avoid walking them
  * optimization - dont bother with nodes that are less than some threshold w/h (2? 5?)

*******************************************************************************/
function criaPlaca(placa, pecas, qtdPlaca) {

  // console.log(placa);
  // console.log(pecas);
  var placaUtilizada;
  //console.log(placa);
  $.each(placa, function (indexInArray, valueOfElement) {

    if (valueOfElement.quantidade > 0) {

      placaUtilizada = valueOfElement;
      placa[indexInArray].quantidade--;
      return false;
    }

  });
  //console.log(placaUtilizada);

  if (placaUtilizada == null) {
    Swal.fire({
      title: 'Erro',
      text: "São necessarias mais placas para este pedido!",
      type: 'error',
    });
    return;
  }


  var pecasUtilizadas = "";
  $.each(pecas, function (indexInArray, valueOfElement) {
    if (valueOfElement.quantidade == null) valueOfElement.quantidade = 1;
    pecasUtilizadas += valueOfElement.largura + "x" + valueOfElement.comprimento + "x" + valueOfElement.quantidade + "x" + valueOfElement.cor + "\n";
  });

  //console.log(placaUtilizada);
  var estrutura = '';
  estrutura += '<div class="col-md-3 placa' + qtdPlaca + '" style="background-color: #ffffea;">';
  estrutura += '  <input type="hidden" id="examples" value="complex">';
  estrutura += '  <input type="hidden" id="size' + qtdPlaca + '" value="' + placaUtilizada.largura + 'x' + placaUtilizada.comprimento + '">';
  estrutura += '  <input type="hidden" id="sort" value="maxside">';
  estrutura += '  <input type="hidden" id="color" value="pastel">';
  estrutura += '  <div class="blocks" hidden><textarea id="blocks' + qtdPlaca + '">' + pecasUtilizadas + '</textarea></div>';
  estrutura += '  <div class="ratio' + qtdPlaca + '">Utilizado: <span id="ratio' + qtdPlaca + '">0</span>% | '+ (placaUtilizada.largura)*10 + 'x' + (placaUtilizada.comprimento)*10+'</div>';
  estrutura += '  <div id="nofit' + qtdPlaca + '" class="nofit"></div>';
  estrutura += '  <div id="valor' + qtdPlaca + '" hidden>' + placaUtilizada.valor + '</div>';

  estrutura += '  <div id="packing">';
  estrutura += '    <canvas id="canvas' + qtdPlaca + '" " style="max-width:100%;">';
  estrutura += '      <div id="unsupported">Navegador não suportado!</div>';
  estrutura += '    </canvas>';
  estrutura += '  </div>';
  estrutura += '</div>';



  $('.criaPlaca').append(estrutura);


  Demo = {

    init: function () {

      Demo.el = {
        examples: $('#examples'),
        blocks: $('#blocks' + qtdPlaca),
        canvas: $('#canvas' + qtdPlaca)[0],
        size: $('#size' + qtdPlaca),
        sort: $('#sort'),
        color: $('#color'),
        ratio: $('#ratio' + qtdPlaca),
        nofit: $('#nofit' + qtdPlaca)
      };

      if (!Demo.el.canvas.getContext) // no support for canvas
        return false;

      Demo.el.draw = Demo.el.canvas.getContext("2d");
      //Demo.el.blocks.val(Demo.blocks.serialize(Demo.blocks.examples.current()));
      Demo.el.blocks.change(Demo.run);
      Demo.el.size.change(Demo.run);
      Demo.el.sort.change(Demo.run);
      Demo.el.color.change(Demo.run);
      Demo.el.examples.change(Demo.blocks.examples.change);
      Demo.run();

      Demo.el.blocks.keypress(function (ev) {
        if (ev.which == 13)
          Demo.run(); // run on <enter> while entering block information
      });
      var sobrou = $('#nofit' + qtdPlaca).html();
      //console.log(sobrou);
      if (sobrou != '') {
        sobrou = sobrou.split(",");

        var pecasSobrou = [];
        $.each(sobrou, function (indexInArray, valueOfElement) {
          var medidas = valueOfElement.split("x");
          var cod_bloco = valueOfElement.split("-");
          pecasSobrou[indexInArray] = { largura: medidas[0].trim(), comprimento: medidas[1].trim(), quantidade: 1, cor: cod_bloco[1] };
        });


        //console.log($('#ratio' + qtdPlaca).html());
        if ($('#ratio' + qtdPlaca).html() == "0") {
          $('.placa' + qtdPlaca).remove();
          qtdPlaca--;
        }
        qtdPlaca++;
        criaPlaca(placa, pecasSobrou, qtdPlaca);
      }
    },

    //---------------------------------------------------------------------------

    run: function () {

      var blocks = Demo.blocks.deserialize(Demo.el.blocks.val()); 
      var packer = Demo.packer();

      Demo.sort.now(blocks);

      packer.fit(blocks);

      Demo.canvas.reset(packer.root.w, packer.root.h);
      Demo.canvas.blocks(blocks);
      Demo.canvas.boundary(packer.root);
      Demo.report(blocks, packer.root.w, packer.root.h);
    },

    //---------------------------------------------------------------------------

    packer: function () {
      var size = Demo.el.size.val();
      if (size == 'automatic') {
        return new GrowingPacker();
      }
      else {
        var dims = size.split("x");
        return new Packer(parseInt(dims[0]), parseInt(dims[1]));
      }
    },

    //---------------------------------------------------------------------------

    report: function (blocks, w, h) {
      var fit = 0, nofit = [], block, n, len = blocks.length;
      for (n = 0; n < len; n++) {
        block = blocks[n];
        if (block.fit)
          fit = fit + block.area;
        else
          nofit.push("" + block.w + "x" + block.h+ "-" + block.cor);
      }
      Demo.el.ratio.text(Math.round(100 * fit / (w * h)));
      Demo.el.nofit.html(nofit.join(", ")).toggle(nofit.length > 0);
      Demo.el.nofit.hide();
    },

    //---------------------------------------------------------------------------

    sort: {

      random: function (a, b) { return Math.random() - 0.5; },
      w: function (a, b) { return b.w - a.w; },
      h: function (a, b) { return b.h - a.h; },
      a: function (a, b) { return b.area - a.area; },
      max: function (a, b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); },
      min: function (a, b) { return Math.min(b.w, b.h) - Math.min(a.w, a.h); },

      height: function (a, b) { return Demo.sort.msort(a, b, ['h', 'w']); },
      width: function (a, b) { return Demo.sort.msort(a, b, ['w', 'h']); },
      area: function (a, b) { return Demo.sort.msort(a, b, ['a', 'h', 'w']); },
      maxside: function (a, b) { return Demo.sort.msort(a, b, ['max', 'min', 'h', 'w']); },

      msort: function (a, b, criteria) { /* sort by multiple criteria */
        var diff, n;
        for (n = 0; n < criteria.length; n++) {
          diff = Demo.sort[criteria[n]](a, b);
          if (diff != 0)
            return diff;
        }
        return 0;
      },

      now: function (blocks) {
        var sort = Demo.el.sort.val();
        if (sort != 'none')
          blocks.sort(Demo.sort[sort]);
      }
    },

    //---------------------------------------------------------------------------

    canvas: {

      reset: function (width, height) {
        Demo.el.canvas.width = width + 1; // add 1 because we draw boundaries offset by 0.5 in order to pixel align and get crisp boundaries
        Demo.el.canvas.height = height + 1; // (ditto)
        Demo.el.draw.clearRect(0, 0, Demo.el.canvas.width, Demo.el.canvas.height);
      },

      rect: function (x, y, w, h, color) {
        Demo.el.draw.fillStyle = color;
        Demo.el.draw.fillRect(x + 0.5, y + 0.5, w, h);
      },

      stroke: function (x, y, w, h) {
        Demo.el.draw.strokeRect(x + 0.5, y + 0.5, w, h);
      },

      blocks: function (blocks) {
        var n, block;
        for (n = 0; n < blocks.length; n++) {
          block = blocks[n];
          if (block.fit)
            Demo.canvas.rect(block.fit.x, block.fit.y, block.w, block.h, Demo.color(block.cor));
        }
      },

      boundary: function (node) {
        if (node) {
          Demo.canvas.stroke(node.x, node.y, node.w, node.h);
          Demo.canvas.boundary(node.down);
          Demo.canvas.boundary(node.right);
        }
      }
    },

    //---------------------------------------------------------------------------

    blocks: {

      examples: {

        complex: [],

        current: function () {
          return Demo.blocks.examples[Demo.el.examples.val()];
        },

        change: function () {
          Demo.el.blocks.val(Demo.blocks.serialize(Demo.blocks.examples.current()));
          Demo.run();
        }
      },

  
      deserialize: function (val) {
        var i, j, block, blocks = val.split("\n"), result = [];
        for (i = 0; i < blocks.length; i++) {
          block = blocks[i].split("x");
          if (block.length >= 2)
            result.push({ w: parseInt(block[0]), h: parseInt(block[1]), num: (block.length == 2 ? 1 : parseInt(block[2])), cor: parseInt(block[3]) });
        }
        var expanded = [];
        for (i = 0; i < result.length; i++) {
          for (j = 0; j < result[i].num; j++)
            expanded.push({ w: result[i].w, h: result[i].h, area: result[i].w * result[i].h, cor: result[i].cor });
        }
        return expanded;
      },

      serialize: function (blocks) {
        var i, block, str = "";
        for (i = 0; i < blocks.length; i++) {
          block = blocks[i];
          str = str + block.w + "x" + block.h + (block.num > 1 ? "x" + block.num : "") + "\n";
        }
        return str;
      }

    },

    //---------------------------------------------------------------------------

    colors: {
      pastel: ["#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5"],
      pastel2: ["silver", "gray", "red", "maroon", "yellow", "olive", "lime", "green", "aqua", "teal", "blue", "navy", "fuchsia", "purple"],
      basic: ["silver", "gray", "red", "maroon", "yellow", "olive", "lime", "green", "aqua", "teal", "blue", "navy", "fuchsia", "purple"],
      gray: ["#111", "#222", "#333", "#444", "#555", "#666", "#777", "#888", "#999", "#AAA", "#BBB", "#CCC", "#DDD", "#EEE"],
      vintage: ["#EFD279", "#95CBE9", "#024769", "#AFD775", "#2C5700", "#DE9D7F", "#7F9DDE", "#00572C", "#75D7AF", "#694702", "#E9CB95", "#79D2EF"],
      solarized: ["#b58900", "#cb4b16", "#dc322f", "#d33682", "#6c71c4", "#268bd2", "#2aa198", "#859900"],
      none: ["transparent"]
    },

    color: function (n) {
      var cols = Demo.colors[Demo.el.color.val()];
      return cols[n % cols.length];
      //console.log(cols)
    }

    //---------------------------------------------------------------------------

  }

  $(Demo.init);

}