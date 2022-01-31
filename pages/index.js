import { Box, Button, Text, TextField, Image } from '@skynexui/components'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Axios from 'axios'

import appConfig from '../config.json'


//Criar perfis para quando não há o retorno esperado pela API do github
const usuarioNaoEncontrado = {
  id: -1,
  nome: "Usuário não Encontrado",
  avatar: "https://www.placecage.com/166/166"
}

const apiDoGithubCaiu = {
  id: -2,
  nome: "A API do Github Caiu :(",
  avatar: "https://www.placecage.com/166/166"
}

const insiraMaisCaracteres = {
  id: -3,
  nome: "Insira mais letras para pesquisar",
  avatar: "https://www.placecage.com/166/166"
}



function Title(props) {
  const Tag = props.tag || "h1"
  return (<>
    <Tag>{props.children}</Tag>

    <style jsx>{`
      ${Tag}{
        color:${appConfig.theme.colors.neutrals["050"]};
      }
    `}</style>
  </>)
}

export default function PaginaInicial() {
  const [username, setUsername] = useState('');
  const [usuario, setUsuario] = useState(insiraMaisCaracteres);
  const roteamento = useRouter();

  function getUser(username) {
    if (username.length > 2) {
      Axios.get(`https://api.github.com/users/${username}`)
        .then(res => {
          setUsuario(
             {
                id: res.data.id,
                nome: res.data.name,
                avatar: res.data.avatar_url
              });
        })
        .catch(error => {
          if (error.response.status == 403) {
            setUsuario(apiDoGithubCaiu)
          }
          else {
            setUsuario(usuarioNaoEncontrado)
          }
        })
    }
    else {
      setUsuario(insiraMaisCaracteres)
    }
  }

  useEffect(() => {
    getUser(username)
    console.log(usuario)

  }, [username]);

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '5px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={e => {
              e.preventDefault();
              roteamento.push("/chat")
            }}
            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
              {appConfig.name}
            </Text>

            <TextField
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                getUser(username);
              }}
              placeholder='Informe seu usuario do Github'
            />
            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}


          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              flex: 1,
              minHeight: '240px',
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
              }}
              src={usuario.avatar}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              {usuario.nome}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
