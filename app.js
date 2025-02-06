let listaPessoas = [];
let historicoGrupos = [];

// Função para dividir em grupos
function dividirEmGrupos(listaPessoas, tamanhoGrupo) {
  listaPessoas.sort(() => Math.random() - 0.5);
  const grupos = [];
  for (let i = 0; i < listaPessoas.length; i += tamanhoGrupo) {
    grupos.push(listaPessoas.slice(i, i + tamanhoGrupo));
  }
  return grupos;
}

// Função para verificar repetição de grupos
function gruposRepetidos(gruposAtuais, historicoGrupos) {
  for (const grupo of gruposAtuais) {
    for (const grupoAnterior of historicoGrupos) {
      if (
        JSON.stringify(grupo.sort()) === JSON.stringify(grupoAnterior.sort())
      ) {
        return true;
      }
    }
  }
  return false;
}

// Função para exibir grupos
function exibirGrupos(grupos) {
  const divGrupos = document.getElementById("grupos");
  divGrupos.innerHTML = "";

  grupos.forEach((grupo, indice) => {
    const grupoDiv = document.createElement("div");
    grupoDiv.className = "grupo";
    grupoDiv.innerHTML = `<strong>Grupo ${indice + 1}:</strong> ${grupo.join(
      ", "
    )}`;
    divGrupos.appendChild(grupoDiv);
  });
}

// Função para processar a lista de pessoas
function processarLista(texto) {
  return texto
    .split(/[\n,]/)
    .map((nome) => nome.trim())
    .filter((nome) => nome.length > 0);
}

// Carregar lista manualmente
document.getElementById("listaPessoas").addEventListener("input", (e) => {
  listaPessoas = processarLista(e.target.value);
});

// Carregar lista de arquivo
document.getElementById("arquivo").addEventListener("change", (e) => {
  const arquivo = e.target.files[0];
  if (arquivo) {
    const leitor = new FileReader();
    leitor.onload = (evento) => {
      listaPessoas = processarLista(evento.target.result);
      document.getElementById("listaPessoas").value = listaPessoas.join("\n");
    };
    leitor.readAsText(arquivo);
  }
});

// Habilitar/desabilitar campo de quantidade de grupos
document.querySelectorAll('input[name="tipoGrupo"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    document.getElementById("quantidadeGrupos").disabled =
      e.target.value !== "grupos";
  });
});

// Sortear grupos
document.getElementById("sortear").addEventListener("click", () => {
  if (listaPessoas.length === 0) {
    alert("Insira uma lista de pessoas primeiro!");
    return;
  }

  const tipoGrupo = document.querySelector(
    'input[name="tipoGrupo"]:checked'
  ).value;
  const tamanhoGrupo =
    tipoGrupo === "duplas"
      ? 2
      : Math.ceil(
          listaPessoas.length /
            parseInt(document.getElementById("quantidadeGrupos").value)
        );

  let grupos;
  do {
    grupos = dividirEmGrupos([...listaPessoas], tamanhoGrupo);
  } while (gruposRepetidos(grupos, historicoGrupos));

  historicoGrupos.push(...grupos);
  exibirGrupos(grupos);
});

// Resetar grupos
document.getElementById("resetar").addEventListener("click", () => {
  historicoGrupos = [];
  document.getElementById("grupos").innerHTML = "";
});

// Reiniciar operação
document.getElementById("reiniciar").addEventListener("click", () => {
  listaPessoas = [];
  historicoGrupos = [];
  document.getElementById("listaPessoas").value = "";
  document.getElementById("arquivo").value = "";
  document.getElementById("grupos").innerHTML = "";
});
