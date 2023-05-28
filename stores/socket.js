import { defineStore } from 'pinia'
import { io } from 'socket.io-client';

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(),
    ping = ref()

  const socketGetter = computed(() => socket.value)
  const pingGetter = computed(() => ping.value)

  function init(url='https://socket-dev.thechess.io'){
    if(socket.value) return;

    socket.value = io(url)

    socket.value.on('disconnect', () => {
      console.warn("DISCONNECT")
      socket.value.connect()
      console.warn("RECONNECTED")
      if(process.client && localStorage.getItem('accessToken')) emit("auth", JSON.stringify({accessToken: localStorage.getItem('accessToken')}))
      let route = useRoute();
      if(process.client && route.params.id) emit('room', JSON.stringify({ gameId: route.params.id }))
    })

    socket.value.on('info_message', (resp) => {
      console.log(resp)
    })

    setInterval(getPing, 10000);
  }

  function disconnect(){
    socket.value.disconnect()
  }

  function emit(name, body){
    //console.log(name)
    socket.value.emit(name, body)
  }

  function listen(name, callback){
    socket.value.on(name, callback)
  }

  function getPing(){
    const start = Date.now();

    emit("ping", () => {
      const dur = Date.now() - start;
      ping.value = dur;
    });
  }

  return {socketGetter, pingGetter, init, emit, listen}
})