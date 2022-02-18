import { Box, Button, Text, TextField, Image, Icon } from '@skynexui/components'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Axios from 'axios'

import appConfig from '../config.json'


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
  const [usuario, setUsuario] = useState(appConfig.defaultUsers.insiraMaisCaracteres);
  const roteamento = useRouter();

  function getUser(username) {
    if (username.length > 2) {
      Axios.get(`https://api.github.com/users/${username}`)
        .then(res => {
          setUsuario(
            {
              id: res.data.id,
              nome: res.data.name,
              avatar: res.data.avatar_url,
              followers: 11,
              following: 27,
              public_repos: 8,
              buttonDisabled: false
            });
        })
        .catch(error => {
          if (error.response.status == 403) {
            setUsuario(appConfig.defaultUsers.apiDoGithubCaiu)
          }
          else {
            setUsuario(appConfig.defaultUsers.usuarioNaoEncontrado)
          }
        })
    }
    else {
      setUsuario(appConfig.defaultUsers.insiraMaisCaracteres)
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

              if (usuario.id > 0) {
                roteamento.push("/chat?username=" + username);
              }
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
              disabled={usuario.buttonDisabled}
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
            <Box
              styleSheet={{
                marginTop: '5px',
                display: usuario.id > 0 ? 'flex' : 'none',
                gap: '5px'
              }}>
              <Box
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  padding: '3px 5px',
                  borderRadius: '1000px',
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Icon name="FaUser" size="1.2ch" />
                <Text variant='body4'>09</Text>
              </Box>

              <Box
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  padding: '3px 5px',
                  borderRadius: '1000px',
                  display: 'flex',
                  gap: '5px'
                }}
              >
                <Icon name="FaUser" size="1.2ch" />
                <Text variant='body4'>07</Text>
              </Box>

              <Box
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  padding: '3px 5px',
                  borderRadius: '1000px',
                  display: 'flex',
                  gap: '5px',

                }}
              >
                <Icon name="FaCode" size="1.2ch" styleSheet={{ marginBottom: '5px' }} />
                <Text variant='body4'>04</Text>
              </Box>
            </Box>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
