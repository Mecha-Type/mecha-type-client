import { ActionItemType } from '.';
import { ITypingStateType } from '../use-typing-game';

export default (state: ITypingStateType, action: ActionItemType): ITypingStateType => {
  let { chars, charsState, currIndex, correctChar, errorChar, spaceChar, keystrokes, phase, countErrors } = state;
  let payload = action.payload ?? null;

  if (phase !== 1 || currIndex === -1) {
    return state;
  }

  let newCharsState = [...charsState];
  if (payload) {
    let newIndex = chars.lastIndexOf(' ', currIndex);
    newIndex = newIndex === -1 ? 0 : newIndex + 1;
    for (let i = currIndex; i >= newIndex; i--) {
      if (newCharsState[i] === 1) {
        correctChar -= 1;
      } else if (newCharsState[i] === 2) {
        if (countErrors === 'once') {
          errorChar -= 1;
        }
      }
      newCharsState[1] = 0;
    }
    currIndex = newIndex;
  } else {
    if (newCharsState[currIndex] === 1) {
      correctChar -= 1;
    } else if (newCharsState[currIndex] === 2) {
      if (countErrors === 'once') {
        errorChar -= 1;
      }
    }
    newCharsState[currIndex] = 0;
  }
  if (currIndex !== -1) {
    currIndex -= 1;
  }
  let currChar = (currIndex >= 0 ? chars[currIndex] : '') ?? '';
  return {
    ...state,
    currIndex,
    currChar,
    charsState: newCharsState,
    correctChar,
    errorChar,
    spaceChar,
    keystrokes,
  };
};
