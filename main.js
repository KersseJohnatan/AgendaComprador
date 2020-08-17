
window.addEventListener('load', incluido);
window.addEventListener('load', cancelar);
window.addEventListener('load', imprimir);
window.addEventListener('load', atualizar);
window.addEventListener('load', excluir);

var db = openDatabase('dbTips', '1.0', 'Banco de Agenda', 2 * 1024 * 1024);
db.transaction(function (tx) {
   tx.executeSql('CREATE TABLE IF NOT EXISTS agenda(ID INTEGER PRIMARY KEY AUTOINCREMENT, codFornecedor TEXT NOT NULL, codComprador TEXT NOT NULL, dataVisita DATE NOT NULL, horaInicio TIME NOT NULL, horaFim TIME NOT NULL, observacoes TEXT NOT NULL)')
});
function incluido() {
   $(".btn-gravar").click(function (e) {
      e.preventDefault();
      incluir();
   });
   carregarTabelaFornecedores();
}
function cancelar() {
   $(".btn-cancelar").click(() => {
         var msg = `Deseja sair sem gravar o fornecedor?`
         if (!confirm(msg))
         return;
         hideModal();
         resetarFormulario();
      }
   )
};
function imprimir() {
   $(".btn-imprimir").click(() =>  {
      var pegar_dados = document.getElementById('tabela-agendamento').innerHTML
      var janela = window.open('', 'print', 'width=900, heigth=800');
      
      console.log(pegar_dados)
      janela.document.write('<table border="1" width=950, heigth=900><thead>');
      janela.document.write('<title>Agenda de Comprador</title></thead>');
      janela.document.write(pegar_dados);
      janela.document.write('</table></thead>');
      janela.document.close();
      janela.print();
      janela.close();
      })
   
};
function incluir() {
   var idFornecedor = document.getElementById('idFornecedor').value

   var codFornecedor = document.getElementById('codFornecedor').value
   var codComprador = document.getElementById('codComprador').value
   var dataVisita = document.getElementById('dataVisita').value
   var horaInicio = document.getElementById('horaInicio').value
   var horaFim = document.getElementById('horaFim').value
   var observacoes = document.getElementById('observacoes').value

   db.transaction((tx) => {
      if (idFornecedor) {
         tx.executeSql('UPDATE agenda SET codFornecedor=?, codComprador=?, dataVisita=?, horaInicio=?, horaFim=?, observacoes=? WHERE ID=?',
            [codFornecedor, codComprador, dataVisita, horaInicio, horaFim, observacoes, idFornecedor],
            (tx, resultado) => {
               carregarTabelaFornecedores();
               hideModal();
               resetarFormulario();
            },
            (tx, error) => { console.log("ERROR", error); }
         )
      } else {
         tx.executeSql('INSERT INTO agenda(codFornecedor, codComprador, dataVisita, horaInicio, horaFim, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
            [codFornecedor, codComprador, dataVisita, horaInicio, horaFim, observacoes], 
            (tx, resultado) => {
               carregarTabelaFornecedores();
               hideModal();
               resetarFormulario();
            });
      }
   })
}
function carregarTabelaFornecedores() {
   var table = document.getElementById('table');

   db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM agenda', [], function (tx, resultado) {
         var rows = resultado.rows;

         var tr = '';
         for (var i = 0; i < rows.length; i++) {
            tr += '<tr>';
            tr += '<td>' + rows[i].ID + '</td>'
            tr += '<td> ' + rows[i].codFornecedor + '</td>'
            tr += '<td>' + rows[i].codComprador + '</td>'
            tr += '<td>' + rows[i].dataVisita + '</td>'
            tr += '<td>' + rows[i].horaInicio + '</td>'
            tr += '<td>' + rows[i].horaFim + '</td>'
            tr += '<td>' + rows[i].observacoes + '</td>'
            tr += '<td id="' + rows[i].ID + '"><button type="button" value="editar" class="btn btn-primary btn-atualizar btn-sm mr-2">Editar</button>'
            tr += '<button type="button" value="excluir" class="btn btn-danger btn-sm btn-excluir">Excluir</button></td>'
            tr += '</tr>';
            table.innerHTML = tr;
         }
var tr = table.childNodes;
document.getElementById("txtAgenda").addEventListener("keyup", function(){
   var fornecedor = document.getElementById("txtAgenda").value.toLowerCase();
      for(var i=0; i<table.childNodes.length; i++){
         var achou = false;
         var tr = table.childNodes[i];
         var td = tr.childNodes;
            for(var j=0; j<td.length; j++){
               var value = td[j].childNodes[0].textContent.toLowerCase();
               console.log(td[j].childNodes);
               if(value.indexOf(fornecedor)>= 0){
                  achou = true;
               }
            }
            if(achou){
               tr.style.display = "table-row";
            }else{
               tr.style.display = "none";
            }
      }
})
      });
   });
}
function dataAtualFormatada(){
   var data = new Date(),
       dia  = data.getDate().toString(),
       diaF = (dia.length == 1) ? '0'+dia : dia,
       mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
       mesF = (mes.length == 1) ? '0'+mes : mes,
       anoF = data.getFullYear();
   return diaF+"/"+mesF+"/"+anoF;
}
$('#dataVisita').val(dataAtualFormatada);

function atualizar() {
   $(document).on('click', '#tabela-agendamento tbody tr td button.btn-atualizar', (e) => {
      const fornecedor_id = e.target.parentElement.id;
      
      var idFornecedor = document.getElementById('idFornecedor');
      var codFornecedor = document.getElementById('codFornecedor');
      var codComprador = document.getElementById('codComprador');
      var dataVisita = document.getElementById('dataVisita');
      var horaInicio = document.getElementById('horaInicio');
      var horaFim = document.getElementById('horaFim');
      var observacoes = document.getElementById('observacoes');

      db.transaction(function (tx) {
         tx.executeSql('SELECT * FROM agenda WHERE ID=?', [fornecedor_id], function (tx, resultado) {
            const info_fornecedor = resultado.rows[0];

            idFornecedor.value = info_fornecedor.ID
            codFornecedor.value = info_fornecedor.codFornecedor
            codComprador.value = info_fornecedor.codComprador
            dataVisita.value = info_fornecedor.dataVisita
            horaInicio.value = info_fornecedor.horaInicio
            horaFim.value = info_fornecedor.horaFim
            observacoes.value = info_fornecedor.observacoes
         })
      })
      abreModal();
   });
}
function resetarFormulario(){
   var idFornecedor = document.getElementById('idFornecedor');
   var codFornecedor = document.getElementById('codFornecedor');
   var codComprador = document.getElementById('codComprador');
   var dataVisita = document.getElementById('dataVisita');
   var horaInicio = document.getElementById('horaInicio');
   var horaFim = document.getElementById('horaFim');
   var observacoes = document.getElementById('observacoes');

   idFornecedor.value = ''
   codFornecedor.value = ''
   codComprador.value = ''
   dataVisita.value = ''
   horaInicio.value = ''
   horaFim.value = ''
   observacoes.value = ''
}
function excluir() {
   $(document).on('click', '#tabela-agendamento tbody tr td button.btn-excluir', (e) => {
      const fornecedor_id = e.target.parentElement.id;
      var msg = `Deseja realmente excluir a AGENDA? `;

      if (!confirm(msg)) return;

      db.transaction((tx) => {
         tx.executeSql('DELETE FROM agenda WHERE ID=?', [fornecedor_id], function (tx, resultado) {
            carregarTabelaFornecedores();
         })
      })
   });
}
function abreModal() {
   $('#cadFornecedor').modal({
      backdrop: 'static',
      keyboard: false
   });
}
function hideModal() {
   $('#cadFornecedor').modal('hide');
}
