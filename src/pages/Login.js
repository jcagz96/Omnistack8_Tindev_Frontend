import React, { useState } from 'react'
import './Login.css'

import api from '../services/api'

import logo from '../assets/logo.svg'

export default function Login({ history }) {                   //todos os componentes herdam uma propriedade chamada history relacionada com o DOM, serve para fazer navegação
  const [username, setUsername] = useState('')                //estado de um componente - é qualquer informação que o componente vai manipular/modificar  | '' é o valor inicial que demos aqui
  
  async function handleSubmit(e){                                 // função que vai ser disparada quando o user der submit no formulario, recebe um evento
    e.preventDefault()                                     //  e.preventDefault previne o comportamento padrão que é redirecionar o user para outra pagina, ou seja, bloqueia essa ação
    console.log(username)

    const response = await api.post('/devs', {
      username,                                        //equivalente a ter username: username
    })

    const { _id } = response.data                     //ir buscar o id da api

    history.push(`/dev/${_id}`)                                 //redireciona o user para a rota main
  }

  return (
    <div className="login-container">                        
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev"/>                        {/* src e alt sao propriedades */}
        <input 
          placeholder="Digite o seu username no Github"
          value={username}                                  // valor do input
          onChange={e => setUsername(e.target.value)}      // o ONchange é uma funcçao do html que é disparada quando há qq alteração neste caso no input/caixa de texto | retorna um evento é por isso que usamos e.target.value  | e modificamos a variavel username com o valor do escrito no input
          />
          <button type="submit">Enviar</button>
      </form>   
    </div>
   
  );
}


