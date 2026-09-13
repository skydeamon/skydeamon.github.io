<!-- Context: ui/web/foundations/react-hooks | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# React Hooks Best Practices

## 1. useEffect Dependencies

**Always specify dependencies correctly**:
```jsx
// Bad - Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []);

// Good - Correct dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Good - Stable function reference
const fetchData = useCallback((id) => {
  api.getUser(id).then(setUser);
}, []);

useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]);
```

## 2. useMemo for Expensive Calculations

**Memoize expensive computations**:
```jsx
function DataTable({ data, filters }) {
  const filteredData = useMemo(() => {
    return data.filter(item => 
      filters.every(filter => filter(item))
    );
  }, [data, filters]);
  
  return <Table data={filteredData} />;
}
```

## 3. useCallback for Stable References

**Prevent unnecessary re-renders**:
```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // Bad - New function on every render
  const handleClick = () => setCount(c => c + 1);
  
  // Good - Stable function reference
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <Child onClick={handleClick} />;
}

const Child = memo(function Child({ onClick }) {
  return <button onClick={onClick}>Click</button>;
});
```

**Related**: `ui/web/foundations/react-patterns.md`