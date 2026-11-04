from pynput.mouse import Button, Controller
from pynput.keyboard import Listener, KeyCode
import threading
import time

mouse = Controller()

toggle_key = KeyCode(char='ä')
right_click_key = KeyCode(char='å')
left_clicking = False
right_clicking = False


def click_loop():
    while True:
        if left_clicking:
            mouse.click(Button.left, 1)
        if right_clicking:
            mouse.click(Button.right, 1)
        time.sleep(1)

def on_press(key):
    global left_clicking, right_clicking
    if key == toggle_key:
        left_clicking = not left_clicking
        print("Left autoclicker:", "ON" if left_clicking else "OFF")
    elif key == right_click_key:
        right_clicking = not right_clicking
        print("Right autoclicker:", "ON" if right_clicking else "OFF")

threading.Thread(target=click_loop, daemon=True).start()

with Listener(on_press=on_press) as listener:
    listener.join()