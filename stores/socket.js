import { defineStore } from 'pinia'
import { io } from 'socket.io-client';

export const useSocketStore = defineStore('socket', () => {
  let { $showToast } = useNuxtApp();
  const socket = ref()
  let connectionToast = undefined;
  const socketGetter = computed(() => socket.value)

  function init(){
    if(socket.value) return;

    let env = useRuntimeConfig();
    socket.value = io(env.public.SOCKET_URL, {
      transports: ["websocket"]
    })

    socket.value.on('disconnect', (reason) => {
      connectionToast = $showToast("Reconnection...", 'info', 0);
      // $showToast("Check your internet connection and if this message won't be gone - please, refresh the page.", 'error')

      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.value.connect();
      }
      // else the socket will automatically try to reconnect
    })

    socket.value.on('connect_error', () => {
      $showToast("Connection Error. Please, refresh the page.", 'error')
      console.warn("CONNECT ERROR")
    })

    socket.value.on("connect", () => {
      if (connectionToast != undefined){
        connectionToast.dismiss();
        connectionToast = undefined;
      }
      if(!process.client) return;
      if(localStorage.getItem('accessToken')) {
        let accessToken = JSON.stringify({accessToken: localStorage.getItem('accessToken')})
        console.log(`sending auth on connect: ${accessToken}`)
        emit('auth', accessToken);

        let route = useRoute();
        if(route.params.id) {
          console.log(`sending emit on connect: ${JSON.stringify({ gameId: route.params.id })}`)
          emit('room', JSON.stringify({ gameId: route.params.id }))
        }
      }
    })

    socket.value.on('info_message', (resp) => {
      //console.log(resp)
    })
  }

  function disconnect(){
    socket.value.disconnect()
  }

  function emit(name, body){
    console.log(name, body)
    socket.value.emit(name, body)
  }

  function listen(name, callback){
    socket.value.on(name, callback)
  }

  return {socketGetter, init, emit, listen}
})