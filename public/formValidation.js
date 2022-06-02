window.onload = function (){
    const title = document.getElementById('title')
    const language = document.getElementById('language')
    const text = document.getElementById('text')
    const category = document.getElementById('category')
    const user = document.getElementById('user')
    const email = document.getElementById('email')
    const password = document.getElementById('password')

    const formInputs = [title, language, text, category, user, email, password]

    formInputs.forEach(e=>{
        if(e) e.addEventListener('input', checkInput)
    })

    document.getElementById('main').addEventListener('submit', (event)=>{
        event.preventDefault()
        let aux = 0

        formInputs.forEach(e=> {
            if(e){
                if(e.value.trim() === ''){
                    appendMessage(e, 'error', 'Campo obrigatório')
                    e.style.borderColor = 'rgb(199, 82, 83)'
                    aux++
                } else if(e.id == 'user' && e.value.length >= 16) {
                    appendMessage(e, 'error', 'Tamanho máximo: 16')
                    e.style.borderColor = 'rgb(199, 82, 83)'
                    aux++
                }  else if(e.value.length >= 255) {
                    appendMessage(e, 'error', 'Tamnho máximo ultrapassado')
                    e.style.borderColor = 'rgb(199, 82, 83)'
                    aux++
                }

                else {
                    appendMessage(e, 'sucess', 'Tudo certo :p')
                    e.style.borderColor = 'rgb(5, 150, 105)'
                }    
            }
        })
        if(aux == 0) {
            document.getElementById('main').submit()
        }
    })
}

function checkInput(){
    if(this.value == '') appendMessage(this, 'error', 'Campo obrigatório')
    if(this.value.length >= 255) appendMessage(this, 'error', 'Tamanho máximo ultrapassado')
    if(this.id == 'user' && this.value.length >= 16) appendMessage(this, 'error', 'Tamanho máximo: 16')
}

function appendMessage(element, type, message){
    const p = document.createElement('p')
    p.classList.add(type, 'message')
    p.innerText = message
    if(!element.nextElementSibling.classList[0]) {
        element.parentNode.insertBefore(p, element.nextSibling)
        removeError(element);
    }
}

function removeError(element){
    setTimeout(function(){
        document.querySelector('.message').remove();
        element.style.borderColor = ''
    },2500);
}
