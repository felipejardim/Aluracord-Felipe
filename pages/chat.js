import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import appConfig from '../config.json';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

//DESAFIO AULA4- criar mensagem de loading e onMouseOver foto do user da msg, mostrar perfil da pessoa

export default function ChatPage() {
    // Sua lógica vai aqui
    // url e senha do backend sendo carregado através das variaveis de ambiente configuradas no arquivo .env.local ou nas configs do servidor do frontend
    // talvez exista uma forma melhor do que utilizar NEXT_PUBLIC_VAR, mas por hora vamos nessa
    const supabaseCliente = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    function escutaMensagensEmTempoReal(callback) {
        return supabaseCliente.from('mensagens').on('*', (res) => {
            //informar as atualizações no console
            console.log('att:', res);
            callback(res);
        }).subscribe();
    }


    const [mensagem, setMensagem] = React.useState('');
    const [listaMensagens, setListaMensagens] = React.useState([])

    const roteamento = useRouter();
    const username = roteamento.query.username;


    React.useEffect(() => {
        supabaseCliente.from('mensagens').select(`*`).order('id', { ascending: false }).then(({ data }) => {
            setListaMensagens(data)
        })

        escutaMensagensEmTempoReal((res) => {
            setListaMensagens((lista) => {
                if (res.eventType == "INSERT")
                    return [...lista, res.new].sort((a,b)=>{
                        if(a.id < b.id)
                            return 1;
                        if (a.id > b.id) {
                            return -1;
                        }
                        return 0;
                    });
                else if (res.eventType == "DELETE")
                    return lista.filter(item => item.id != res.old.id);
            });
        });
    }, [])

    function handleNovaMensagem(novaMensagem) {
        if(novaMensagem.length <=0) return;
        const mensagem = {
            de: username,
            texto: novaMensagem,
        }

        //impedir usuário de postar mensagem caso não haja usuário 
        if (username) {
            supabaseCliente.from('mensagens').insert([mensagem])
                .then(({ data }) => {
                    // ( ͡° ͜ʖ ͡°)
                    console.log("insert")
                });
        }

        setMensagem('');
    }

    function deletarMensagem(id) {
        supabaseCliente.from('mensagens').delete().match({ id: id }).then(() => {
            console.log("delete")
        });

    }
    // ./Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaMensagens} setLista={setListaMensagens} deletar={deletarMensagem} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <TextField
                                value={mensagem}
                                onChange={e => { setMensagem(e.target.value) }}
                                onKeyPress={e => {
                                    if (e.key == "Enter") {
                                        e.preventDefault();
                                        handleNovaMensagem(mensagem);
                                    }
                                }}
                                placeholder="Insira sua mensagem aqui..."
                                type="textarea"
                                styleSheet={{
                                    width: '100%',
                                    border: '0',
                                    resize: 'none',
                                    borderRadius: '5px',
                                    padding: '6px 8px',
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                    marginRight: '12px',
                                    color: appConfig.theme.colors.neutrals[200],
                                }}
                            />
                            <Button
                                iconName='arrowRight'
                                variant='tertiary'
                                buttonColors={{
                                    contrastColor: appConfig.theme.colors.neutrals["000"],
                                    mainColor: appConfig.theme.colors.primary[500],
                                    mainColorLight: appConfig.theme.colors.primary[400],
                                    mainColorStrong: appConfig.theme.colors.primary[600],
                                }}

                                onClick={() => handleNovaMensagem(mensagem)}
                            />
                        </Box>

                        <ButtonSendSticker
                            onStickerClick={(sticker) => { handleNovaMensagem(`:sticker: ${sticker}`) }}
                        />

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
                overflowX: 'hidden'
            }}
        >

            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Button
                            iconName='FaTrashAlt'
                            variant='tertiary'
                            colorVariant='light'
                            styleSheet={{
                                float: 'right',
                            }}
                            onClick={() => {
                                props.deletar(mensagem.id)
                                props.setLista([...props.mensagens.filter(item => item.id != mensagem.id)])
                            }}
                        />
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong" styleSheet={{ alignSelf: 'end', fontSize: '13px' }}>
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                    alignSelf: 'end'
                                }}
                                tag="span"
                            >
                                {'em ' + (new Date(mensagem.created_at).toLocaleString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker: ') ? (
                            <Image src={mensagem.texto.replace(':sticker: ', '')}
                                styleSheet={{
                                    height:"200px"
                                }}
                            />
                        ) : (
                            mensagem.texto
                        )}
                    </Text>
                )
            })}

        </Box>
    )
}