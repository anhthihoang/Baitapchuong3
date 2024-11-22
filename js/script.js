$(document).ready(function () {
    var container = $('#container');
    var bird = $('#bird');
    var pole = $('.pole');
    var pole_1 = $('#pole_1');
    var pole_2 = $('#pole_2');
    var score = $('#score');
    var start_btn = $("#play_btn");
    var restart_btn = $("#restart_btn");
    var level_display = $('#level'); // Thêm phần tử hiển thị Level
    var coin = $('<div class="coin"></div>'); // Thêm element đồng xu
    container.append(coin);

    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var pole_initial_pos = parseInt(pole.css('right'));
    var pole_initial_height = 150;
    var bird_left = parseInt(bird.css('left'));
    var bird_height = parseInt(bird.height());
    var speed = 10;
    var level = 1;
    var interval_time = 40; // Thời gian interval ban đầu

    var go_up = false;
    var score_updated = false;
    var gameOver = false;
    var gameStarted = false; // Biến để kiểm tra xem trò chơi đã bắt đầu chưa

    // Đặt lại vị trí của đồng xu
    function reset_coin_position() {
        var coin_top = Math.floor(Math.random() * (container_height - 50)) + 25; // Đảm bảo đồng xu nằm trong container
        coin.css({
            'top': coin_top,
            'right': -50
        });
    }
    reset_coin_position();

    function updateLevel(newLevel, newInterval) {
        level = newLevel;
        interval_time = newInterval;
        level_display.text('Level: ' + level);
        clearInterval(the_game);
        the_game = setInterval(gameLoop, interval_time);
    }

    function gameLoop() {
        if (!gameStarted) return; // Nếu trò chơi chưa bắt đầu, không chạy gameLoop

        if (collision(bird, pole_1) || collision(bird, pole_2) || parseInt(bird.css('top')) <= 0 || parseInt(bird.css('top')) > container_height - bird_height) {
            stopGame();
        } else {
            var pole_current_pos = parseInt(pole.css('right'));
            var coin_current_pos = parseInt(coin.css('right'));

            if (pole_current_pos > container_width - bird_left) {
                if (score_updated === false) {
                    var newScore = parseInt(score.text()) + 1;
                    score.text(newScore);
                    score_updated = true;

                    // Cập nhật Level dựa trên điểm số
                    if (newScore >= 50) {
                        stopGame("Chiến thắng!");
                    } else if (newScore >= 40) {
                        updateLevel(4, 20);
                    } else if (newScore >= 20) {
                        updateLevel(3, 25);
                    } else if (newScore >= 5) {
                        updateLevel(2, 30);
                    }
                }
            }

            if (pole_current_pos > container_width) {
                var new_height = Math.floor(Math.random() * 150) + 50; // Chiều cao ngẫu nhiên từ 50 đến 200
                var gap = 150; // Khoảng cách giữa hai cột

                pole_1.css('height', new_height).addClass('tree-top');
                pole_2.css('height', container_height - new_height - gap).addClass('tree-trunk');

                // Đặt lại vị trí của đồng xu
                reset_coin_position();

                score_updated = false;
                pole_current_pos = pole_initial_pos;
                coin_current_pos = pole_initial_pos;
                speed = speed + 3;
            }

            pole.css('right', pole_current_pos + speed);
            coin.css('right', coin_current_pos + speed);

            if (go_up === false) {
                go_down();
            }

            if (collision(bird, coin)) {
                score.text(parseInt(score.text()) + 1);
                reset_coin_position(); // Di chuyển đồng xu đến vị trí mới
            }
        }
    }

    var the_game;

    start_btn.on("click", function () {
        gameStarted = true; // Bắt đầu trò chơi
        start_btn.hide(); // Ẩn nút "Click vào để chơi"
        the_game = setInterval(gameLoop, interval_time); // Bắt đầu vòng lặp trò chơi
    });

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

    // Điều khiển bằng chuột
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

    // Hàm làm chim rơi xuống
    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10); // Tốc độ rơi xuống
    }

    // Hàm làm chim bay lên
    function up() {
        bird.css('top', parseInt(bird.css('top')) - 10); // Tốc độ bay lên
    }

    // Hàm kiểm tra va chạm
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

    // Hàm dừng trò chơi
    function stopGame(message) {
        clearInterval(the_game);
        gameOver = true;
        restart_btn.fadeToggle(200); // Hiển thị nút chơi lại

        if (message) {
            alert(message);
        }

        // Đảm bảo nút chơi lại được căn giữa
        restart_btn.css({
            'top': (container_height / 2) - (restart_btn.height() / 2),
            'left': (container_width / 2) - (restart_btn.width() / 2)
        });
    }

    // Hàm khởi động lại trò chơi
    $(restart_btn).on("click", function () {
        location.reload();
    });
});
