document.addEventListener('DOMContentLoaded', () => {
    // Verifica se há um usuário logado no localStorage
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    // Atualiza o cabeçalho com base no estado de login
    const authButtonsDiv = document.querySelector('.auth-buttons');
    if (loggedUser) {
        authButtonsDiv.innerHTML = `
            <span>Bem-vindo, ${loggedUser.username}</span>
            <button id="logoutBtn" class="btn">Sair</button>
        `;

        // Botão de logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('loggedUser'); // Remove o usuário logado
            window.location.reload(); // Recarrega a página
        });
    }

    // Registro de Usuário
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const cpf = document.getElementById("cpf").value.trim();
            const username = document.getElementById("regUsername").value.trim();
            const password = document.getElementById("regPassword").value.trim();

            if (!fullName || !cpf || !username || !password) {
                alert("Preencha todos os campos.");
                return;
            }

            if (localStorage.getItem(cpf)) {
                alert("Já existe um usuário cadastrado com este CPF.");
                return;
            }

            const user = { fullName, username, password };
            localStorage.setItem(cpf, JSON.stringify(user));

            alert("Usuário registrado com sucesso!");
            window.location.href = "login.html";
        });
    }

    // Login de Usuário
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const cpf = document.getElementById('cpfLogin').value;
            const password = document.getElementById('password').value;

            const user = JSON.parse(localStorage.getItem(cpf));

            if (user && user.password === password) {
                // Armazena o usuário logado no localStorage
                localStorage.setItem('loggedUser', JSON.stringify({ username: user.username }));
                window.location.href = "../index.html";
            } else {
                alert('CPF ou senha incorretos. Tente novamente.');
            }
        });
    }
});


                                //consultas_agendadas.html

// Apenas uma simulação para testar o código //REMOVER DEPOIS!
//let consultas = [
 //   { id: 1, data: '2024-11-12T10:00', paciente: 'João', cpf: '12345678900', especialista: 'Dr. Marcos' },
 //   { id: 2, data: '2024-11-15T14:30', paciente: 'Maria', cpf: '98765432100', especialista: 'Dra. Paula' }
//];

// Função para verificar consulta pelo CPF
function verificarConsulta() {
    const cpf = document.getElementById('cpfInput').value.trim();
    const consulta = consultas.find(c => c.cpf === cpf);

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = ''; // Limpar resultados anteriores

    if (consulta) {
        resultadoDiv.innerHTML = `
            <h3>Consulta Encontrada:</h3>
            <table>
                <tr><th>ID</th><th>Data</th><th>Paciente</th><th>Especialista</th><th>Ações</th></tr>
                <tr>
                    <td>${consulta.id}</td>
                    <td>${new Date(consulta.data).toLocaleString()}</td>
                    <td>${consulta.paciente}</td>
                    <td>${consulta.especialista}</td>
                    <td>
                        <button onclick="editarConsulta(${consulta.id})">Editar</button>
                        <button onclick="excluirConsulta(${consulta.id})">Excluir</button>
                    </td>
                </tr>
            </table>
        `;
    } else {
        resultadoDiv.innerHTML = '<p>Nenhuma consulta encontrada para este CPF.</p>';
    }
}

// Função para editar consulta
function editarConsulta(id) {
    const consulta = consultas.find(c => c.id === id);
    document.getElementById('consultaId').value = consulta.id;
    document.getElementById('novaData').value = consulta.data;
    document.getElementById('novoEspecialista').value = consulta.especialista;
    document.getElementById('formulario').style.display = 'block';
}

// Função para atualizar consulta
function atualizarConsulta() {
    const id = parseInt(document.getElementById('consultaId').value);
    const novaData = document.getElementById('novaData').value;
    const novoEspecialista = document.getElementById('novoEspecialista').value;

    const consulta = consultas.find(c => c.id === id);
    consulta.data = novaData;
    consulta.especialista = novoEspecialista;

    alert('Consulta atualizada com sucesso!');
    document.getElementById('formulario').style.display = 'none';
    verificarConsulta();
}

// Função para excluir consulta
function excluirConsulta(id) {
    consultas = consultas.filter(c => c.id !== id);
    alert('Consulta excluída com sucesso!');
    verificarConsulta();
}

// Função para cancelar edição
function cancelarEdicao() {
    document.getElementById('formulario').style.display = 'none';
}

                                    //CONSULTAS.HTML

// Define a data mínima como a data de amanhã
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const formattedDate = tomorrow.toISOString().split('T')[0];
document.getElementById('data').min = formattedDate;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('consulta-form');
    
    // Função para validar o CPF
    function validarCPF(cpf) {
        const regex = /\d{3}\.\d{3}\.\d{3}-\d{2}/;
        return regex.test(cpf);
    }

    // Valida o formulário antes de enviar
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Validação dos campos
        const nome = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        const cpf = document.getElementById('cpf').value;
        const telefone = document.getElementById('telefone').value;
        const especialidade = document.getElementById('especialidade').value;
        const data = document.getElementById('data').value;
        const horario = document.getElementById('horario').value;
        const pagamento = document.getElementById('pagamento').value;
        const historico = document.getElementById('historico').files[0];

        if (!nome || !idade || !cpf || !telefone || !especialidade || !data || !horario || !pagamento || !historico) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (!validarCPF(cpf)) {
            alert("CPF inválido! O formato deve ser 000.000.000-00");
            return;
        }

        // Cria um FormData para enviar os dados
        const formData = new FormData(form);

        // Envia os dados para o servidor
        fetch('/upload_consulta', { // Modifique o endpoint conforme o necessário no seu servidor
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Consulta agendada com sucesso!");
                form.reset(); // Limpa o formulário
            } else {
                alert("Houve um erro ao agendar a consulta. Tente novamente.");
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Ocorreu um erro. Tente novamente.");
        });
    });
});
