<!-- Context: ui/web/foundations/react-state | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# React State Management Patterns

## 1. Local State First

**Start with local state, lift when needed**:
```jsx
// Local state
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Lifted state when shared
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Counter count={count} setCount={setCount} />
      <Display count={count} />
    </>
  );
}
```

## 2. useReducer for Complex State

**Use reducer for related state updates**:
```jsx
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

**Related**: `ui/web/foundations/react-patterns.md`