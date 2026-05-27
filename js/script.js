const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbyaqp8kMiCxaI4TaFNYvwA4D5mT3kfQrLX-eRmZurY8ek9iH-54x1gI1lib0VBMAPSY/exec";

function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));

    if (type === 'corporate') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('corporateForm').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('operationalForm').classList.add('active');
    }
}

// Essa função especial vai receber a resposta do Google direto, sem bloqueio de CORS
function gerenciarRespostaGoogle(resposta) {
    // Procura o botão para restaurar o estado visual
    const btn = document.querySelector('.form-content.active .btn-access');
    if (btn) {
        btn.innerText = "Acessar";
        btn.disabled = false;
        btn.style = "";
    }

    if (resposta.sucesso) {
        alert(resposta.mensagem);
        // Redireciona para o seu dashboard quando o usuário e senha baterem!
        window.location.href = "dashboard.html"; 
    } else {
        alert(`Erro: ${resposta.mensagem}`);
    }

    // Limpa a tag de script temporária criada
    const scriptTemp = document.getElementById('googleScriptTemp');
    if (scriptTemp) scriptTemp.remove();
}

function handleLogin(event, tipoContexto) {
    event.preventDefault();
    const btn = event.submitter;

    let usuarioInput, senhaInput;
    if (tipoContexto === 'Corporativo') {
        usuarioInput = document.getElementById('corpUser').value;
        senhaInput = document.getElementById('corpPass').value;
    } else {
        usuarioInput = document.getElementById('opUnit').value;
        senhaInput = document.getElementById('opKey').value;
    }

    // Estado visual de carregamento
    btn.innerText = "AUTENTICANDO AO SISTEMA...";
    btn.style.background = "#021408";
    btn.style.color = "#00ff66";
    btn.style.border = "1px solid #00ff66";
    btn.style.cursor = "not-allowed";
    btn.disabled = true;

    // Criamos os parâmetros incluindo o "callback" que limpa o CORS
    const params = new URLSearchParams({
        tipoContexto: tipoContexto,
        usuario: usuarioInput,
        senha: senhaInput,
        callback: "gerenciarRespostaGoogle" // Diz ao Google para chamar nossa função acima
    });

    // Técnica JSONP: injeta um script dinâmico para rodar a resposta sem o navegador bloquear
    const script = document.createElement('script');
    script.id = 'googleScriptTemp';
    script.src = `${URL_WEB_APP}?${params.toString()}`;
    
    // Tratamento caso o servidor do Google esteja fora do ar
    script.onerror = function() {
        alert("Erro crítico ao tentar alcançar o servidor de autenticação.");
        btn.innerText = "Acessar";
        btn.disabled = false;
        btn.style = "";
        script.remove();
    };

    document.body.appendChild(script);
}

document.getElementById('lnkRequest').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Redirecionando ao formulário de acesso corporativo...');
});