let lista = document.querySelector('ul');
let container = document.querySelector('.container');

document.addEventListener('DOMContentLoaded', loadingItems);

function createItem() {
    let newItem = {};

    let nome = document.querySelector('#nome').value;
    let qtd = document.querySelector('#qtd').value;
    let checked = document.querySelector('#checked').checked;

    if (nome === null) {
        return;
    }

    if (qtd === null && qtd <= 0) {
        return;
    }

    newItem.name = nome;
    newItem.quantity = qtd;
    newItem.checked = checked;

    fetch('http://localhost:9797/', {
        method: 'POST',
        body: JSON.stringify(newItem)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Resultado: ', result);
            document.querySelector('#nome').value = '';
            document.querySelector('#qtd').value = '';
            document.querySelector('#checked').checked = false;
            loadingItems();
        })
        .catch(error => {
            console.error('Erro: ', error);
        });
}


function loadingItems() {
    lista.innerHTML = '';
    fetch('http://localhost:9797/')
        .then(response => response.json())
        .then(data => {
            // console.log(JSON.stringify(data));
            data.forEach((item) => {
                addItem(item);
            });
        })
        .catch(error => {
            console.error('Erro: ', error);
        });
}

function addItem(item) {
    let li = document.createElement('li');
    let deleteButton = document.createElement('button');
    let editButton = document.createElement('button');

    deleteButton.innerHTML = 'Excluir';
    editButton.innerHTML = 'Editar';

    li.innerHTML = `<div style="margin-top: 8px" class='title'>${item.name}</div>
                    <div class='text'>Quantidade: ${item.quantity}</div>
                    <input style="margin-top: 6px;" type='checkbox' ${item.checked ? 'checked' : ''} onclick='return false;'>  Selecionado</input>`;

    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        deleteItem(item);
    });
    editButton.addEventListener('click', (e) => {
        e.preventDefault();
        showEditScreen(item);
    });

    li.appendChild(document.createElement('br'));
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    lista.appendChild(li);
}

function showEditScreen(item) {
    let body = document.querySelector('body');
    container.style.display = 'none';
    lista.style.display = 'none';

    let newForm = document.createElement('div');
    newForm.classList.add('container');
    newForm.setAttribute('id', 'newForm');
    newForm.innerHTML = `<label for="nome">Nome</label>
                        <input type="text" name="nome" value="${item.name}" id="nomeEdit"/>
                        <label for="quantidade">Quantidade</label>
                        <input type="number" min="1" name="quantidade" value="${item.quantity}" id="qtdEdit"/>
                        <label for="checked">Selecionado</label>
                        <input type="checkbox" ${item.checked ? "checked" : ""} name="checked" id="checkedEdit"/>
                        <button onclick=editItem(${JSON.stringify(item)})>Salvar</button>`;
    body.appendChild(newForm);
}

function editItem(item) {
    console.log('Edit: ' + JSON.stringify(item));
    let nome = document.querySelector('#nomeEdit').value;
    let qtd = parseInt(document.querySelector('#qtdEdit').value);
    let checked = document.querySelector('#checkedEdit').checked;
    let newForm = document.querySelector('#newForm');
    let body = document.querySelector('body');

    const editedItem = {};

    if (item.name !== nome && nome !== '') {
        editedItem.name = nome;
    }

    if (item.quantity !== qtd && qtd > 0) {
        editedItem.quantity = qtd;
    }

    if (item.checked !== checked) {
        editedItem.checked = checked;
    }

    fetch(`http://localhost:9797/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(editedItem)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Resultado: ', result);
            body.removeChild(newForm);
            container.style.display = 'flex';
            lista.style.display = 'block';
            loadingItems();
        })
        .catch(error => {
            console.error('Erro: ', error);
        });

}

function deleteItem(item) {

    fetch(`http://localhost:9797/${item.id}`, {
        method: 'DELETE'
    })
        .then(response => {

            if (response.ok) {
                console.log('Registro excluído com sucesso!');

            } else {
                console.error('Erro ao excluir registro!');
            }
            loadingItems();
        })
        .catch(error => {
            console.error('Erro: ', error);
        });

}
