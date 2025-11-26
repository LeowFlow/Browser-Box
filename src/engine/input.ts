export interface InputState {
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  mouseRightDown: boolean;
}

export function createInputState(canvas: HTMLCanvasElement): InputState {
  const inputState: InputState = {
    mouseX: 0,
    mouseY: 0,
    mouseDown: false,
    mouseRightDown: false,
  };

  canvas.addEventListener('mousemove', (event: MouseEvent) => {
    inputState.mouseX = event.clientX;
    inputState.mouseY = event.clientY;
  });

  canvas.addEventListener('mousedown', (event: MouseEvent) => {
    if (event.button === 0) {
      inputState.mouseDown = true;
    }

    if (event.button === 2) {
      inputState.mouseRightDown = true;
    }
  });

  canvas.addEventListener('mouseup', (event: MouseEvent) => {
    if (event.button === 0) {
      inputState.mouseDown = false;
    }

    if (event.button === 2) {
      inputState.mouseRightDown = false;
    }
  });

  canvas.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
  });

  return inputState;
}
