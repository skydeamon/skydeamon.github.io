<!-- Context: ui/web/foundations/react-components | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# React Component Patterns

## 1. Functional Components with Hooks

**Always use functional components**:
```jsx
// Good
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

## 2. Custom Hooks for Reusable Logic

**Extract common logic into custom hooks**:
```jsx
// Custom hook
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <div>{user.name}</div>;
}
```

## 3. Composition Over Props Drilling

**Use composition to avoid prop drilling**:
```jsx
// Bad - Props drilling
function App() {
  const [theme, setTheme] = useState('light');
  return <Layout theme={theme} setTheme={setTheme} />;
}

// Good - Composition with Context
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {
  const { theme } = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}
```

## 4. Compound Components

**For complex, related components**:
```jsx
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>;
};

Tabs.Tab = function Tab({ index, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button 
      className={activeTab === index ? 'active' : ''}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ index, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === index ? <div>{children}</div> : null;
};

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Content 1</Tabs.Panel>
  <Tabs.Panel index={1}>Content 2</Tabs.Panel>
</Tabs>
```

**Related**: `ui/web/foundations/react-patterns.md`