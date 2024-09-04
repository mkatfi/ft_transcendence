import json
import math

board_width = 700
board_heigth = 500
distense_between_player_and_wall_in_percentgit  = 10
ballspeed = 5
player_spreed = 10
ball_size = board_heigth * 0.03
player_heigth_in_percent = 10
player_width_in_percent = 1

player_h = board_heigth * (player_heigth_in_percent/ 100)
player_w = board_width * (player_width_in_percent / 100)

gameContants = {
    "defX": board_width,
    "defY": board_heigth,
    "p1StartingPositionX": board_width * (player_heigth_in_percent / 100),
    "p1StartingPositionY": (board_heigth / 2) -  (player_h / 2),
    "p2StartingPositionX": board_width * (1 - (player_heigth_in_percent / 100)),
    "p2StartingPositionY": (board_heigth / 2) -  (player_h / 2),
    "playerSpeed": player_spreed,
    "playerW" : player_w,
    "playerMoveDelay": 20,
    "pMinPos": 0,
    "pMaxPos": board_heigth - player_h,
    "pSize": player_h,
    "ballStartingPositionX": (board_width / 2) - (ball_size / 2),
    "ballStartingPositionY": (board_heigth / 2) - (ball_size / 2),
    "max_angle": 90,
    "ballStartVx": ballspeed,
    "ballStartVy": 0,
    "ballSize": ball_size,
    "ballSpeed": ballspeed,
    "ballmaxVY": abs(ballspeed * math.cos(math.pi / 2)),
    "ballMoveDelay": 30,
    "bMinX": 0,
    "bMaxX": board_width - ball_size,
    "bMinY": 0,
    "bMaxY": board_heigth - ball_size,
    "Wall1": 0,
    "wall2": board_width,
    "BoardW": 700,
    "floor": board_heigth,
    "BoardH": board_heigth,
    "roof": 0,
}
# bc = 15
# max_vx = ?
# max_vy = ?

# sin 90 = max_vx / 15 => 15 * sin90 = max_vx
# cos 90 = max_vy / 15 => 15 * cos90 = max_vy. -1
