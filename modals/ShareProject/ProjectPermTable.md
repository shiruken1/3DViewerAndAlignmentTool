```jsx
<ProjectPermTable
  columns={[
  	{ label: 'User', name: 'user' },
  	{ label: 'Read', name: 'read' },
  	{ label: 'Add Content', name: 'content' },
  	{ label: 'Invite User', name: 'invite' },
  ]}
  items={[
  	{ id: 'abc', name: 'C. Kent', read: 'explicit', content: 'inherited', invite: 'none'},
  	{ id: 'def', name: 'L. Lane', read: 'inherited', content: 'explicit', invite: 'none'},
  ]}
  onInvite={(id, perm) => console.log('onInvite', id, perm)}
  onTogglePerm={(id, perm) => console.log('onTogglePerm', id, perm)}
 />
```