let diaSelecionado = null;
let botaoSelecionado = null;

// Busca dados iniciais
let id = localStorage.getItem("servicoSelecionado");
let agendar = JSON.parse(localStorage.getItem("agenda")) || [];
// Certifique-se que 'listaProdutos' existe no seu Dados.js
let servico = listaProdutos.find(p => p.id == id);

let info = document.getElementById("info-servico");

// 🔹 RENDERIZA INTERFACE INICIAL
if (servico) {
    info.innerHTML = `
    <div class="servico-detalhes">
        <img width="140" src="${servico.img}">
        <div class="servico-informacoes">
            <h2>${servico.descricao}</h2>
            <p>Tempo: ${servico.tempo}</p>
            <p id="tagp">Valor: ${servico.valor}</p>
        </div>  
        <div class="data-hora">
            <div class="data"></div>
            <div class="hora"></div>
            <button id="btn-limpar">Limpar Todos os Agendamentos</button>
        </div>    
    </div>`;
}

let dataDiv = document.querySelector(".data");
let horaDiv = document.querySelector(".hora");
let btnLimpar = document.getElementById("btn-limpar");

//  LOGICA DE VERIFICAÇÃO (Crucial para o F5)
function horarioJaAgendado(data, hora) {
    if (!data) return false;
    return agendar.find(a =>
        a.dia === data.getDate() &&
        a.mes === data.getMonth() + 1 &&
        a.ano === data.getFullYear() &&
        a.hora === hora
    );
}

function diaJaAgendado(data) {
    return agendar.find(a =>
        a.dia === data.getDate() &&
        a.mes === data.getMonth() + 1
    );
}

//  GERAR DIAS
let hoje = new Date();
for (let i = 0; i < 7; i++) {
    let data = new Date();
    data.setDate(hoje.getDate() + i);

    let btn = document.createElement("button");
    btn.classList.add("dia");
    btn.innerHTML = `<span>${data.toLocaleDateString("pt-BR", { weekday: "short" })}</span><strong>${data.getDate()}</strong>`;

    if (diaJaAgendado(data)) btn.classList.add("agendado");

    btn.addEventListener("click", () => {
        document.querySelectorAll(".dia").forEach(d => d.classList.remove("selecionado"));
        btn.classList.add("selecionado");
        diaSelecionado = data;
        botaoSelecionado = btn;
        mostrarHorarios();
    });
    dataDiv.appendChild(btn);
}

//  MOSTRAR HORÁRIOS (Persistência Visual)
function mostrarHorarios() {
    horaDiv.innerHTML = "";
    let horarios = ["09:00","10:00","11:00","14:00","15:00","16:00"];

    horarios.forEach(h => {
        let btn = document.createElement("button");
        btn.textContent = h;
        btn.classList.add("hora-btn");

        if (horarioJaAgendado(diaSelecionado, h)) {
            btn.classList.add("agendado");
            btn.style.backgroundColor = "red"; // Garante o vermelho no F5
            btn.style.color = "white";
            btn.disabled = true;
        }

        btn.addEventListener("click", () => salvarAgendamento(diaSelecionado, h));
        horaDiv.appendChild(btn);
    });
}

//  SALVAR COM OBSERVAÇÃO DE CANCELAMENTO
function salvarAgendamento(data, hora) {
    let obs = "";

    if (agendar.length > 0) {
        let trocar = confirm("Você já tem um horário. Deseja CANCELAR o anterior e mudar para este?");
        if (!trocar) return;
        obs = " *Obs:* O cliente cancelou o horário anterior para este novo.";
        agendar = []; // Limpa o anterior
    }

    let novoAgendamento = {
        servico: servico.descricao,
        dia: data.getDate(),
        mes: data.getMonth() + 1,
        ano: data.getFullYear(),
        hora: hora,
        observacao: obs
    };

    agendar.push(novoAgendamento);
    localStorage.setItem("agenda", JSON.stringify(agendar));
    
    enviarMensagemWhatsApp(novoAgendamento);
    alert("Agendamento Confirmado!");
    location.reload(); // Recarrega para atualizar todos os status visuais
}


function enviarMensagemWhatsApp(d) {
    const tel = "5511982799240";
    const msg = ` *NOVO AGENDAMENTO*\n\n*Serviço:* ${d.servico} *Data:* ${d.dia}/${d.mes}/${d.ano} *Hora:* ${d.hora}${d.observacao}`;
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank');
}

btnLimpar.onclick = () => {
    localStorage.removeItem("agenda");
    location.reload();
};