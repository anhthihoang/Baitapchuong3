$(document).ready(function () {
    var container = $('#container');
    var bird = $('#bird');
    var pole = $('.pole');
    var pole_1 = $('#pole_1');
    var pole_2 = $('#pole_2');
    var score = $('#score');
    var restart_btn = $("#restart_btn");

    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var pole_initial_pos = parseInt(pole.css('right'));
    var pole_initial_height = 150;
    var bird_left = parseInt(bird.css('left'));
    var bird_height = parseInt(bird.height());
    var speed = 10;

    var go_up = false;
    var score_updated = false;
    var gameOver = false;

    var the_game = setInterval(function () {
        if (collision(bird, pole_1) || collision(bird, pole_2) || parseInt(bird.css('top')) <= 0 || parseInt(bird.css('top')) > container_height - bird_height) {
            stopGame();
        } else {
            var pole_current_pos = parseInt(pole.css('right'));

            if (pole_current_pos > container_width - bird_left) {
                if (score_updated === false) {
                    var newScore = parseInt(score.text()) + 1;
                    score.text(newScore);
                    score_updated = true;
                }
            }

            if (pole_current_pos > container_width) {
                var new_height = Math.floor(Math.random() * 150) + 50; // Random height between 50 and 200
                var gap = 150; // Adjusted gap between poles

                pole_1.css('height', new_height);
                pole_2.css('height', container_height - new_height - gap);

                score_updated = false;
                pole_current_pos = pole_initial_pos;
                speed = speed + 3;
            }

            pole.css('right', pole_current_pos + speed);

            if (go_up === false) {
                go_down();
            }
        }
    }, 40);

    $(document).on("keydown", function (e) {
        var key = e.keyCode;
        if ((key === 32 || key === 40) && gameOver === false && go_up === false) {
            go_up = setInterval(up, 50);
        }
    });

    $(document).on("keyup", function (e) {
        var key = e.keyCode;
        if ((key === 32 || key === 40) && gameOver === false) {
            clearInterval(go_up);
            go_up = false;
        }
    });

    $(document).on("mousedown", function () {
        if (gameOver === false && go_up === false) {
            go_up = setInterval(up, 50);
        }
    });

    $(document).on("mouseup", function () {
        if (gameOver === false) {
            clearInterval(go_up);
            go_up = false;
        }
    });

    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10); // Adjusted downward speed
    }

    function up() {
        bird.css('top', parseInt(bird.css('top')) - 10); // Adjusted upward speed
    }

    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;

        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        } else {
            return true;
        }
    }

    function stopGame() {
        clearInterval(the_game);
        restart_btn.fadeToggle(200);
        gameOver = true;
    }

    $(restart_btn).on("click", function () {
        location.reload();
    });
});
