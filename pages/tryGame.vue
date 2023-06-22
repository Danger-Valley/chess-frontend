<template>
  <TheChessboard
    :board-config="{
      fen: 'rn2kbnr/ppPppppp/8/8/8/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1'
    }"
    reactive-config
    @move="onMove"
    @promotion="onPromote"
    @checkmate="onCheckmate"
  />
</template>


<script setup>
import { TheChessboard } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';
import '@/assets/styles/chess.css';

const onMove = (e) => {
  console.log(e)
}

const onPromote = (e) => {
  console.log(e)
}

const onCheckmate = (e) => {
  console.log(e)
}
</script>