import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import './Main.css'

import api from '../services/api'

import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'
import itsamatch from '../assets/itsamatch.png'

export default function Main({ match }){                 //match tem todos os parametros passados +ara esta rota

    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    useEffect(()=>{
        async function loadUsers() {                     // funcao que faz a chamada à api , para nao usar async na funcao useEffect ( nao é uma boa pratica)
            const response = await api.get('/devs',{
                headers: { 
                    user: match.params.id,
                }
            })
            setUsers(response.data)      // coloca na variavel users os valores dados pela api
        }
        loadUsers();                   // chamando a funcao logo em baixo
    }, [match.params.id])             //1º argumento é a funcao que eu quero executar, e o 2º parametro é quando é que eu quero executar a funcao normalmente variaveis dentro de um array e sempre que essas variaveis sofrerem alteraçoes a funcao é chamada de novo | neste caso usou-se o match . parms.id que significa que cada vez que o id for alterado será despoletada a funcao

    useEffect(()=>{
        
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id}                  //2º argumento que pode ser enviado na conexao
        })

        socket.on('match', dev =>{
            setMatchDev(dev)
        })

    }, [match.params.id])

    async function handleLike(id){
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id},
        })
        setUsers(users.filter(user => user._id !== id))
    }

    async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id},
        })
        setUsers(users.filter(user => user._id !== id))
    }

    return(
        //* caso quisesse mostrar o id na tela:  <h1>{match.params.id}</h1>                      // o .id é o nome dado ao parametro no ficheiro routes.js depois dos : */}
        <div className="main-container">
            <Link to="/">
            <img src={logo} alt="Tindev" />
            </Link>
            
                { users.length > 0  ? (
                    <ul>
                        {users.map(user => (                                    //para percorrer um array e retornar aglgo, para cada user pegamos na variável user
                    <li key={user._id} >           {/* o react precisa de saber qual valor é qual, para caso haja remoçoes por exemplo, ele nao tenha de renderizar a partir do zero */}
                    <img src={user.avatar} alt={user.name} />
                    <footer>
                        <strong>{user.name}</strong>
                        <p>{user.bio}</p>
                    </footer>
                    <div className="buttons">
                        <button type="button" onClick={ () => handleLike(user._id)}>
                            <img src={like} alt="Like"/>
                        </button>
                        <button type="button" onClick={ () => handleDislike(user._id)}>
                            <img src={dislike} alt="Dislike"/>
                        </button>
                    </div>
                </li>
                ))} 
                    </ul> 
                ) : (
                    <div className="empty">
                        Acabou :(
                    </div>
                )}
                
            { matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match"/>
                    <img className="avatar" src={matchDev.avatar} alt=""/>
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>
            
                    <button type="button" onClick={()=>setMatchDev(null)}>FECHAR</button>
                    
                </div>
            )}
        </div>
    )
}