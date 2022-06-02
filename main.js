import {Game} from "./Game.js";

$(document).ready(function () {
    const game = new Game();
    // show main screen
    $(".start-screen .btn-play").click(function () {
        $(".main-screen").css("transform", "translateY(0)");
        let mode = $(".start-screen .mode select :selected").val();
        game.mode = Number.parseInt(mode);
        let level = $(".start-screen .level select :selected").val();
        game.stage(Number.parseInt(level));
    });
    // back start screen
    $(".main-screen .fa-circle-arrow-left").click(function () {
        $(".main-screen").css("transform", "translateY(-100%)");
    });
    $(".main-screen .mute").click(function () {
        game.isMute = !game.isMute;
        if (game.isMute) {
            $(this).removeClass("fa-volume-high");
            $(this).addClass("fa-volume-xmark");
        } else {
            $(this).removeClass("fa-volume-xmark");
            $(this).addClass("fa-volume-high");
        }
    })
})