let container = document.getElementById("container");
let agendar = JSON.parse(localStorage.getItem("agenda")) || [];

// MENU
let btnMenu = document.getElementById("btn-menu");
let menu = document.getElementById("menu-lateral");

if (btnMenu && menu) {
    btnMenu.addEventListener("click", () => {
        menu.classList.toggle("ativo");
    });

    document.addEventListener("click", (event) => {
        if (
            !menu.contains(event.target) &&
            !btnMenu.contains(event.target)
        ) {
            menu.classList.remove("ativo");
        }
    });
}

// FUNÇÃO PARA IR PARA AGENDAMENTO
let agendarServico = (id) => {
    localStorage.setItem("servicoSelecionado", id);
    console.log("SALVOU ID:", id);
    window.location.href = "agendar.html";
};

// GERAR LOJA
let gerarLoja = () => {
    if (!container) return;

    container.innerHTML = listaProdutos.map((produto) => {
        let { id, tempo, valor, img, descricao } = produto;

        return `
        <div id="produto-${id}" class="item">
            <img width="140" src="${img}">
            <div class="detalhes">
                <h3>Serviço ${id}</h3>
                <p class="descricao">${descricao}</p>
                <p class="time">Tempo: ${tempo}</p>
                <div class="preco">
                    <h2>${valor}</h2>
                    <button onclick="agendarServico(${id})">Agendar</button>
                </div>
            </div> 
        </div>
        `;
    }).join("");
};

gerarLoja();
