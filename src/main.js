import api from "./api";

class App {
    constructor() {
        this.repository =  JSON.parse(localStorage.getItem('Repository')) || [];
        this.form = document.querySelector('form');
        this.list = document.querySelector('.list-group');
        this.input = document.querySelector('#repository');
        this.eventRegister();
    }

    eventRegister() {
        this.renderData();
        this.form.onsubmit = eventForm => this.repositAdd(eventForm);
    }

    async repositAdd(eventForm) {
        eventForm.preventDefault();
        let input = this.input.value;
        if(input === '')
            return;

        this.showSeacrh();
        try{
            let response = await api.get(`/repos/${input}`);
            let {name, description, html_url, owner: { avatar_url } } = response.data;
            this.repository.push({
                name,
                description,
                avatar_url,
                html_url,
            });
            this.renderData();
        }catch(erro){
            this.list.removeChild(document.querySelector('.list-group-item-warning'));

            let error = document.querySelector('.list-group-item-danger');
            if(error !== null){
                this.list.removeChild(error);
            }
            const li = document.createElement('li');
            li.setAttribute('class','list-group-item list-group-item-danger');
            li.textContent = `O repositório ${input} não existe ou não pode ser encontrado.`;
            this.list.appendChild(li);
        }
    }

    showSeacrh = () => {
        let input = this.input.value;
        const li = document.createElement('li');
        li.setAttribute('class','list-group-item list-group-item-warning');
        li.textContent = `Aguarde, buscando o repositório ${input}...`;
        this.list.appendChild(li);
    }

    saveData = () => {
        localStorage.setItem('Repository', JSON.stringify(this.repository));
    }

    renderData = () => {
        this.list.textContent = '';   
        this.repository.forEach(element => {
            const li = document.createElement('li');
            li.setAttribute('class','list-group-item');
            li.onclick = () => this.removeRepository(li);

            const strong = document.createElement('strong');
            const p = document.createElement('p');
            const img = document.createElement('img');
            const a = document.createElement('a');

            strong.textContent = element.name;
            p.textContent = element.description;
            img.src = element.avatar_url;
            img.alt = `Avatar do usuário`;
            a.href = element.html_url;
            a.target = '_blank';
            a.textContent = 'Acessar reposirório';
            const elements = [strong,p,img,a];
            li.append(...elements);
            this.list.appendChild(li);
        });
        this.input.value = '';
        this.input.focus();
        this.saveData();
    }

    removeRepository = (element) => {
        this.list.removeChild(element);
        this.repository = this.repository.filter(repo => repo.name !== element.querySelector('strong').textContent);
        this.saveData();
    } 
}

new App();