```jsx
<Table
  items={[
  	{ id: 'abc', user: 'C. Kent', scope: 'Workspace', name: 'GEJ Museum' },
  	{ id: 'def', user: 'L. Lane', scope: 'Project', name: 'West Steel and Framing 09.13' },
  ]}
  onRespond={(id, perm) => console.log('onRespond', id, perm)}
 />
```